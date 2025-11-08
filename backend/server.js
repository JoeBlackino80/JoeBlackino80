// 💳 PAYMENT GATEWAY BACKEND - Node.js + Express + Stripe
// Pre fakturačný systém - kompletný working example

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Serve frontend files

// ============================================
// 💾 DATABASE MOCK (v produkčnej app použite real DB)
// ============================================
const invoices = new Map([
  ['2025-0042', {
    id: 1,
    number: '2025-0042',
    clientId: 1,
    clientName: 'ACME s.r.o.',
    clientEmail: 'info@acme.sk',
    total: 1200.00,
    currency: 'eur',
    status: 'issued',
    issueDate: '2025-01-05',
    dueDate: '2025-01-19'
  }]
]);

// ============================================
// 🔑 API ENDPOINTS
// ============================================

/**
 * 1️⃣ Create Payment Intent
 * Frontend zavolá tento endpoint keď zákazník klikne "Zaplatiť"
 */
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { invoiceNumber } = req.body;

    // Validácia: Existuje faktúra?
    const invoice = invoices.get(invoiceNumber);

    if (!invoice) {
      return res.status(404).json({
        error: 'Faktúra nenájdená',
        code: 'INVOICE_NOT_FOUND'
      });
    }

    // Validácia: Je už zaplatená?
    if (invoice.status === 'paid') {
      return res.status(400).json({
        error: 'Faktúra už bola zaplatená',
        code: 'ALREADY_PAID'
      });
    }

    // Vytvor Payment Intent v Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(invoice.total * 100), // Stripe používa centy
      currency: invoice.currency,

      // Metadata - uložia sa v Stripe a prídu späť vo webhooku
      metadata: {
        invoiceNumber: invoice.number,
        invoiceId: invoice.id.toString(),
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail
      },

      // Automaticky povoliť všetky platobné metódy dostupné v krajine
      automatic_payment_methods: {
        enabled: true,
      },

      // Email receipt
      receipt_email: invoice.clientEmail,

      // Description pre bankovú výpis zákazníka
      description: `Faktúra ${invoice.number} - ${invoice.clientName}`,

      // Statement descriptor (max 22 znakov) - zobrazí sa na výpise
      statement_descriptor: `FAK ${invoice.number}`,
    });

    console.log(`✅ Payment Intent created: ${paymentIntent.id} for invoice ${invoice.number}`);

    // Vráť client secret pre frontend
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: invoice.total,
      currency: invoice.currency
    });

  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    res.status(500).json({
      error: error.message,
      code: 'PAYMENT_INTENT_FAILED'
    });
  }
});

/**
 * 2️⃣ Get Invoice Details
 * Pre zobrazenie faktúry pred platbou
 */
app.get('/api/invoice/:number', (req, res) => {
  const invoiceNumber = req.params.number;
  const invoice = invoices.get(invoiceNumber);

  if (!invoice) {
    return res.status(404).json({ error: 'Faktúra nenájdená' });
  }

  res.json(invoice);
});

/**
 * 3️⃣ Webhook - Stripe notifikácie
 * Stripe zavolá tento endpoint keď sa stane niečo s platbou
 * DÔLEŽITÉ: Musí byť raw body (nie JSON parsed)
 */
app.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    // Verify webhook signature (bezpečnosť!)
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`📥 Webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {

      // ✅ Platba úspešná!
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const invoiceNumber = paymentIntent.metadata.invoiceNumber;
        const invoice = invoices.get(invoiceNumber);

        if (invoice) {
          // Update invoice status
          invoice.status = 'paid';
          invoice.paidAt = new Date().toISOString();
          invoice.paymentMethod = 'card';
          invoice.transactionId = paymentIntent.id;

          console.log(`✅ Invoice ${invoiceNumber} marked as PAID`);

          // V reálnej app by ste tu:
          // 1. Uložili do databázy
          // 2. Poslali email potvrdenie zákazníkovi
          // 3. Poslali notifikáciu accountantovi
          // 4. Aktualizovali analytiku

          // Príklad: Poslanie emailu
          sendPaymentConfirmationEmail(invoice);
        }
        break;

      // ❌ Platba zlyhala
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        const failureMessage = failedPayment.last_payment_error?.message;

        console.log('❌ Payment failed:', {
          invoiceNumber: failedPayment.metadata.invoiceNumber,
          reason: failureMessage
        });

        // Notify customer about failure
        // V reálnej app: poslať email s dôvodom zlyhania
        break;

      // 💳 Nová platobná metóda pridaná
      case 'payment_method.attached':
        console.log('💳 Payment method attached');
        break;

      // 💰 Refund spracovaný
      case 'charge.refunded':
        const refund = event.data.object;
        console.log('💰 Refund processed:', refund.id);
        // Update invoice status to 'refunded'
        break;

      // 🔄 Recurring payment (pre subscription faktúry)
      case 'invoice.payment_succeeded':
        console.log('🔄 Subscription payment succeeded');
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Vždy vráť 200 (inak Stripe bude retrying)
    res.json({ received: true });
  }
);

/**
 * 4️⃣ Get Payment Status
 * Pre polling platby z frontend
 */
app.get('/api/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      req.params.paymentIntentId
    );

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      invoiceNumber: paymentIntent.metadata.invoiceNumber
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 5️⃣ Create Refund
 * Pre vrátenie peňazí zákazníkovi
 */
app.post('/api/refund', async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial refund
      reason: reason || 'requested_by_customer',
      metadata: {
        refundedBy: 'admin',
        refundDate: new Date().toISOString()
      }
    });

    console.log(`💰 Refund created: ${refund.id} for ${refund.amount / 100} ${refund.currency}`);

    res.json({
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status
    });

  } catch (error) {
    console.error('❌ Refund error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 📧 HELPER FUNCTIONS
// ============================================

function sendPaymentConfirmationEmail(invoice) {
  // V reálnej app použite SendGrid, Mailgun, AWS SES, atď.
  console.log(`📧 Sending confirmation email to ${invoice.clientEmail}`);

  // Príklad email content:
  const emailContent = `
    Dobrý deň,

    Vaša platba bola úspešne spracovaná.

    Faktúra: ${invoice.number}
    Suma: €${invoice.total.toFixed(2)}
    Zaplatené: ${new Date(invoice.paidAt).toLocaleString('sk-SK')}
    Spôsob platby: Platobná karta
    Transaction ID: ${invoice.transactionId}

    Ďakujeme za spoluprácu!

    S pozdravom,
    Váš fakturačný systém
  `;

  // Real implementation:
  // await sendEmail({
  //   to: invoice.clientEmail,
  //   subject: `Potvrdenie platby - Faktúra ${invoice.number}`,
  //   html: emailContent
  // });
}

// ============================================
// 🚀 SERVER START
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║  💳 Payment Gateway Server                   ║
  ║  🚀 Running on: http://localhost:${PORT}     ║
  ║  📝 Endpoints:                               ║
  ║     POST /api/create-payment-intent          ║
  ║     POST /webhook                            ║
  ║     GET  /api/invoice/:number                ║
  ║     GET  /api/payment-status/:id             ║
  ║     POST /api/refund                         ║
  ╚══════════════════════════════════════════════╝
  `);
});

// ============================================
// 🔒 ENVIRONMENT VARIABLES REQUIRED
// ============================================

/*
Vytvorte .env súbor:

STRIPE_SECRET_KEY=sk_test_xxx  (development)
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PORT=3000

Production:
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  (z Stripe Dashboard → Webhooks)
*/

// ============================================
// 📦 PACKAGE.JSON
// ============================================

/*
{
  "name": "invoice-payment-backend",
  "version": "1.0.0",
  "description": "Payment gateway backend for invoice system",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "stripe": "^14.10.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
*/

// ============================================
// 🧪 TESTING
// ============================================

/*
Test kartové čísla (Stripe test mode):

Úspešné platby:
✅ 4242 4242 4242 4242 (Visa)
✅ 5555 5555 5555 4444 (Mastercard)

Neúspešné platby:
❌ 4000 0000 0000 0002 (Card declined)
❌ 4000 0000 0000 9995 (Insufficient funds)

3D Secure:
🔐 4000 0025 0000 3155 (Requires authentication)

Expiry: Akýkoľvek budúci dátum (napr. 12/25)
CVC: Akékoľvek 3 čísla (napr. 123)
*/

# 💳 PLATOBNÉ BRÁNY - ANALÝZA A INTEGRÁCIA

## 🎯 PREHĽAD

**Otázka:** Dá sa priamo cez aplikáciu platiť faktúry s integráciou platobných brán, bánk a crypto?

**Odpoveď:** ✅ **ÁNO, určite sa to dá!**

Existuje viacero možností ako integrovať platby do fakturačnej aplikácie. Nižšie je kompletná analýza pre slovenský trh.

---

## 🇸🇰 PLATOBNÉ MOŽNOSTI PRE SLOVENSKO

### 1. **SLOVENSKÉ/ČESKÉ PLATOBNÉ BRÁNY** 🏦

#### a) **TatraPay** (Tatra banka)
```
✅ Výhody:
- Slovenská banka, dôveryhodná
- Podpora platobných kariet (Visa, Mastercard)
- Apple Pay, Google Pay
- Nižšie poplatky pre SK trh
- Slovak customer support

💰 Poplatky: ~1.5-2% z transakcie
📄 Dokumentácia: https://www.tatrabanka.sk/sk/business/ucty-platby/tatrapay/
```

#### b) **CardPay** (VÚB banka)
```
✅ Výhody:
- Slovenská banka
- Rýchla integrácia
- Podpora recurring platieb
- Virtuálne terminály

💰 Poplatky: ~1.8-2.2%
📄 Dokumentácia: https://www.vub.sk/podnikatelia/platobne-terminaly/
```

#### c) **ComGate** (česká, ale SK friendly)
```
✅ Výhody:
- Veľmi populárna v SK/CZ
- Najnižšie poplatky v regióne
- Jednoduché API
- Podpora Slovak crown (historicky)

💰 Poplatky: ~1.3-1.9% (najnižšie!)
📄 Dokumentácia: https://www.comgate.cz/
🔧 API: REST API, webhooks
```

#### d) **GoPay** (česká)
```
✅ Výhody:
- Veľmi populárna v e-commerce
- Podpora viacerých platobných metód
- Bitcoin podpora!
- Offline platby v pobočkách

💰 Poplatky: ~1.9-2.5%
📄 Dokumentácia: https://www.gopay.com/sk/
```

---

### 2. **MEDZINÁRODNÉ PLATOBNÉ BRÁNY** 🌍

#### a) **Stripe** ⭐ ODPORÚČANIE #1
```
✅ Výhody:
- Najlepšie API na trhu (developer-friendly)
- Vynikajúca dokumentácia
- Podpora 135+ mien
- Automatické 3D Secure
- Recurring billing built-in
- Webhooks pre všetky udalosti
- Dashboard s analytíkou
- Podpora SEPA prevody (lacnejšie pre EUR)

💰 Poplatky:
- Karty: 1.4% + €0.25 (EU karty)
- SEPA: €0.35 per transaction
- Crypto cez Stripe (v US, zatiaľ nie EU)

📄 Dokumentácia: https://stripe.com/docs
🔧 API: REST, JavaScript SDK, webhooks

⚠️ Nevýhoda:
- Vyššie poplatky ako lokálne brány
- Support len v angličtine
```

#### b) **PayPal**
```
✅ Výhody:
- Najznámejšia platforma
- Každý má PayPal účet
- Buyer/seller protection
- Crypto podpora (od 2024)

💰 Poplatky:
- Domáce: 1.9% + €0.35
- Medzinárodné: 3.9% + fixná suma

⚠️ Nevýhody:
- Vyššie poplatky
- Časté zmrazenie účtov (falošné podozrenia)
- Pomalý customer support
```

#### c) **Square** (od 2024 v EU)
```
✅ Výhody:
- Offline POS terminály
- Online platby
- Jednoduchá integrácia

💰 Poplatky: ~1.75%
```

---

### 3. **SEPA INSTANT PAYMENTS** ⚡ (Priame bankové prevody)

```
✅ Čo to je:
- Instant prevody medzi SEPA bankami
- Peniaze prídu do 10 sekúnd!
- Podporované väčšinou SK bánk

✅ Výhody:
- VEĽMI NÍZKE poplatky (€0.10 - €0.50)
- Bez sprostredkovateľa
- Okamžité potvrdenie
- Bezpečné (priamo cez banku)

⚠️ Implementácia:
- Potrebná PSD2 API integrácia
- Komplexnejšia autentifikácia
- Vyžaduje backend

🔧 Technológia: PSD2 API (Open Banking)

Podporujú:
- Tatra banka (Tatra banka API)
- VÚB (VÚB API)
- Slovenská sporiteľňa (George API)
- mBank
```

---

### 4. **CRYPTOCURRENCY PLATBY** ₿

#### a) **BTCPay Server** ⭐ ODPORÚČANIE pre crypto
```
✅ Výhody:
- ŽIADNE poplatky! (self-hosted)
- Open-source
- Priamo do vašej wallet
- Podpora: Bitcoin, Lightning Network, Ethereum, Litecoin
- Žiadny sprostredkovateľ
- Full control

⚠️ Nevýhody:
- Potrebujete vlastný server
- Technicky náročnejšie
- Volatilita kurzu

📄 Dokumentácia: https://docs.btcpayserver.org/
🔧 API: REST API, webhooks, plugins
💰 Poplatky: €0 (len network fees ~$0.50-$2)
```

#### b) **Coinbase Commerce**
```
✅ Výhody:
- Jednoduchá integrácia
- Podpora: BTC, ETH, USDC, DAI, USDT
- Automatická konverzia na EUR možná

💰 Poplatky: 1% per transaction
📄 Dokumentácia: https://commerce.coinbase.com/docs/
```

#### c) **CoinGate** (EU-friendly)
```
✅ Výhody:
- Európska firma (Lithuania)
- Podpora 50+ cryptocurrencies
- Auto-konverzia na EUR
- Lightning Network podpora

💰 Poplatky: 1%
📄 Dokumentácia: https://developer.coingate.com/
```

#### d) **Binance Pay**
```
✅ Výhody:
- Žiadne poplatky (0%)!
- Najväčšia crypto burza
- Podpora viacerých coinov

⚠️ Nevýhody:
- Obe strany musia mať Binance účet
```

---

## 🏗️ ARCHITEKTÚRA RIEŠENIA

### Variant A: **Hybrid (Frontend + Backend)** ⭐ ODPORÚČANIE

```
┌─────────────────────────────────────────────────┐
│         FRONTEND (Existing App)                 │
│  - Zobrazenie faktúry                           │
│  - Tlačidlo "Zaplatiť"                          │
│  - Payment form (Stripe Elements / iFrame)      │
└─────────────────────────────────────────────────┘
                      ↓ HTTPS
┌─────────────────────────────────────────────────┐
│         BACKEND (Node.js / PHP / Python)        │
│  - API endpoint: /create-payment-intent         │
│  - Bezpečné uloženie API keys                   │
│  - Validácia faktúry                            │
│  - Webhook handling (payment.succeeded)         │
│  - Update invoice status → paid                 │
└─────────────────────────────────────────────────┘
                      ↓ API
┌─────────────────────────────────────────────────┐
│         PAYMENT GATEWAY (Stripe/ComGate)        │
│  - Spracovanie karty                            │
│  - 3D Secure                                    │
│  - Prevod peňazí                                │
└─────────────────────────────────────────────────┘
```

**Prečo potrebujeme backend?**
- ❌ **Nemôžeme** dať API keys do frontend kódu (bezpečnosť!)
- ✅ Backend drží secrets
- ✅ Backend validuje, že faktúra existuje a nie je už zaplatená
- ✅ Backend prijíma webhooky od platobnej brány

---

### Variant B: **Plne Client-Side** (obmedzené možnosti)

```
Možné len s:
1. PayPal Standard Checkout (redirect na PayPal stránku)
2. Crypto: web3.js (MetaMask platby)
3. Square Web Payments SDK (limitované)

⚠️ Nevýhody:
- Horšia user experience (redirecty)
- Žiadna ochrana API keys
- Ťažšie spracovanie webhookov
```

---

## 💻 IMPLEMENTÁCIA - PRÍKLAD SO STRIPE

### 1. **Backend Setup (Node.js)**

```javascript
// server.js
const express = require('express');
const stripe = require('stripe')('sk_live_YOUR_SECRET_KEY'); // ⚠️ NIKDY v frontend!
const app = express();

app.use(express.json());
app.use(express.static('public')); // Vaša frontend app

// Endpoint: Vytvor Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { invoiceId, amount, currency } = req.body;

    // Validácia: Skontroluj, že faktúra existuje a nie je zaplatená
    // (v reálnej app by ste to čítali z databázy)
    const invoice = getInvoiceFromDatabase(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Faktúra neexistuje' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ error: 'Faktúra už bola zaplatená' });
    }

    // Vytvor Payment Intent v Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe používa centy
      currency: currency || 'eur',
      metadata: {
        invoiceId: invoiceId,
        invoiceNumber: invoice.number
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook: Stripe notifikuje o platbe
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = 'whsec_YOUR_WEBHOOK_SECRET';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const invoiceId = paymentIntent.metadata.invoiceId;

      // Update invoice status in database
      updateInvoiceStatus(invoiceId, 'paid', {
        paidAt: new Date().toISOString(),
        paymentMethod: 'card',
        transactionId: paymentIntent.id
      });

      console.log(`✅ Invoice ${invoiceId} marked as PAID`);
      break;

    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object.last_payment_error?.message);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### 2. **Frontend - Platobný Formulár (script.js)**

```javascript
// V InvoiceSystem triede:

async showPaymentModal(invoiceId) {
  const invoice = this.mockInvoices.find(inv => inv.id === invoiceId);

  if (!invoice) {
    this.showNotification('Chyba', 'Faktúra nenájdená', 'error');
    return;
  }

  if (invoice.status === 'paid') {
    this.showNotification('Info', 'Táto faktúra už bola zaplatená', 'info');
    return;
  }

  // Vytvor modal s platobným formulárom
  const modal = document.getElementById('paymentModal');

  document.getElementById('paymentInvoiceNumber').textContent = invoice.number;
  document.getElementById('paymentAmount').textContent = `€${invoice.total.toFixed(2)}`;

  this.openModal('paymentModal');

  // Inicializuj Stripe Elements
  await this.initializeStripePayment(invoice);
}

async initializeStripePayment(invoice) {
  // Load Stripe.js
  const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY'); // ✅ Toto je OK v frontend

  // Zavolaj backend pre Payment Intent
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invoiceId: invoice.id,
      amount: invoice.total,
      currency: 'eur'
    })
  });

  const { clientSecret, paymentIntentId } = await response.json();

  // Vytvor Stripe Elements
  const elements = stripe.elements({ clientSecret });

  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');

  // Handle form submission
  const form = document.getElementById('payment-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit button
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Spracovávam platbu...';

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/payment-success.html',
      },
    });

    if (error) {
      // Show error to customer
      this.showNotification('Chyba platby', error.message, 'error');
      submitButton.disabled = false;
      submitButton.textContent = 'Zaplatiť';
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Platba úspešná! (webhook už aktualizoval faktúru)
      this.showNotification('Úspech', 'Platba bola úspešná!', 'success');

      // Refresh invoice status
      invoice.status = 'paid';
      this.renderInvoices();
      this.closeModal('paymentModal');
    }
  });
}

// Alternatívne: Používaj SEPA Direct Debit (lacnejšie pre EUR)
async initializeSEPAPayment(invoice) {
  const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY');

  const { clientSecret } = await fetch('/api/create-sepa-payment', {
    method: 'POST',
    body: JSON.stringify({ invoiceId: invoice.id, amount: invoice.total })
  }).then(r => r.json());

  const elements = stripe.elements({ clientSecret });

  const ibanElement = elements.create('iban', {
    supportedCountries: ['SEPA'],
  });

  ibanElement.mount('#iban-element');

  // SEPA má nižšie poplatky (€0.35 vs 1.4% + €0.25)
  // Ale trvá 3-5 dní než prídu peniaze
}
```

---

### 3. **HTML - Payment Modal**

```html
<!-- Pridaj do index.html -->
<div class="modal" id="paymentModal">
  <div class="modal-content">
    <div class="modal-header">
      <h3>💳 Zaplatiť faktúru</h3>
      <button class="close-btn" data-close="paymentModal">&times;</button>
    </div>

    <div class="modal-body">
      <div class="payment-summary">
        <p><strong>Faktúra:</strong> <span id="paymentInvoiceNumber"></span></p>
        <p><strong>Suma k úhrade:</strong> <span id="paymentAmount" style="font-size: 24px; color: #2ecc71;"></span></p>
      </div>

      <form id="payment-form">
        <!-- Stripe Elements sa sem vložia -->
        <div id="payment-element">
          <!-- Stripe automaticky vytvorí form fieldy -->
        </div>

        <div id="payment-errors" class="error-message" style="display: none;"></div>

        <button type="submit" class="btn btn-primary btn-large" style="width: 100%; margin-top: 20px;">
          🔒 Zaplatiť bezpečne
        </button>
      </form>

      <div class="payment-methods-info" style="margin-top: 20px; text-align: center; color: #7f8c8d; font-size: 12px;">
        <p>Podporované platobné metódy:</p>
        <p>💳 Visa · Mastercard · 🍎 Apple Pay · 📱 Google Pay</p>
        <p>🔒 Platba je zabezpečená 256-bit SSL šifrovaním</p>
      </div>
    </div>
  </div>
</div>

<!-- Load Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>
```

---

## 🔐 BEZPEČNOSTNÉ POŽIADAVKY

### ⚠️ **KRITICKÉ - NIKDY nerobiť:**

```javascript
// ❌ ❌ ❌ ZLÝÉ - NIKDY!
const stripe = require('stripe')('sk_live_SECRET_KEY');
// Tento kód v FRONTEND = hacker má prístup k vašim peniazom!

// ❌ Ukladať citlivé údaje v localStorage/IndexedDB
localStorage.setItem('cardNumber', '4242424242424242'); // NIKDY!

// ❌ Posielať kartu cez vlastný form
<input name="cardNumber"> // Použite Stripe Elements!
```

### ✅ **Správne postupy:**

```javascript
// ✅ Secret keys len v backend (server)
// Backend: sk_live_xxx (secret)
// Frontend: pk_live_xxx (publishable - safe)

// ✅ Stripe Elements (iframe) - karty nikdy neprechádzajú vaším serverom
// Stripe sa stará o PCI compliance

// ✅ HTTPS everywhere
// Bez HTTPS = karty sa nedajú spracovať

// ✅ Webhook signature validation
stripe.webhooks.constructEvent(body, signature, webhookSecret);

// ✅ Validácia na backend
// Nikdy neverte frontend dátam - vždy validujte na serveri
```

---

## 💰 POROVNANIE POPLATKOV

| Platobná metóda | Poplatky | Rýchlosť | Náročnosť |
|-----------------|----------|----------|-----------|
| **ComGate** (SK/CZ) | 1.3-1.9% | Okamžite | Stredná |
| **TatraPay** | 1.5-2% | Okamžite | Stredná |
| **Stripe karty** | 1.4% + €0.25 | Okamžite | Ľahká |
| **Stripe SEPA** | €0.35 | 3-5 dní | Stredná |
| **SEPA Instant** (PSD2) | €0.10-€0.50 | 10 sekúnd | Zložitá |
| **BTCPay (Bitcoin)** | ~$1 network fee | 10-60 min | Zložitá |
| **Lightning Network** | $0.001 | <1 sekunda | Zložitá |
| **Binance Pay** | 0% | Okamžite | Stredná |

### 💡 Odporúčania podľa scenára:

**Pre malé sumy (<€50):**
- ✅ SEPA Instant (€0.35 fix)
- ✅ Lightning Network ($0.001)

**Pre veľké sumy (>€50):**
- ✅ Stripe karty (1.4% + €0.25)
- ✅ ComGate (1.3-1.9%)

**Pre crypto nadšencov:**
- ✅ BTCPay Server (self-hosted)
- ✅ CoinGate

**Pre najrýchlejšie platby:**
- ✅ Lightning Network (<1s)
- ✅ SEPA Instant (10s)
- ✅ Stripe karty (okamžite)

---

## 🚀 IMPLEMENTAČNÝ PLÁN

### Fáza 1: **MVP - Stripe Integration** (1-2 týždne)

```
✅ Setup:
1. Vytvor Stripe účet (stripe.com/register)
2. Získaj API keys (Dashboard → Developers → API keys)
3. Setup Node.js backend
4. Implementuj /create-payment-intent endpoint
5. Implementuj webhook handler
6. Frontend: Payment modal + Stripe Elements

✅ Testovanie:
- Test mode karty: 4242 4242 4242 4242
- Test declined: 4000 0000 0000 0002
- Test 3D Secure: 4000 0025 0000 3155

✅ Production:
- Aktivuj live mode
- Pridaj SSL certifikát
- Registruj webhook URL
```

### Fáza 2: **SEPA Instant** (2-3 týždne)

```
1. Vyber banku s PSD2 API (Tatra, VÚB, Slsp)
2. Registrácia ako TPP (Third Party Provider)
3. Implementuj OAuth2 flow
4. Payment initiation API
5. Webhook pre payment confirmation
```

### Fáza 3: **Crypto Platby** (1 týždeň)

```
1. Setup BTCPay Server (self-hosted)
2. Vytvor store
3. Generate API key
4. Implementuj invoice creation
5. Webhook pre payment received
```

---

## 📱 USER FLOW - Ako to bude vyzerať zákazníkovi

```
1. Klient dostane faktúru (email s linkom)
   ↓
2. Klikne na "Zobraziť faktúru"
   ↓
3. Vidí faktúru v app + tlačidlo "Zaplatiť online"
   ↓
4. Vyberie platobný spôsob:
   [💳 Karta] [🏦 SEPA] [₿ Bitcoin]
   ↓
5. (Karta) - Vyplní detaily v Stripe Elements
   ↓
6. Potvrdenie 3D Secure (SMS kód od banky)
   ↓
7. ✅ "Platba úspešná!"
   ↓
8. Webhook aktualizuje faktúru → status: paid
   ↓
9. Email potvrdenie: "Faktúra 2025-0042 zaplatená"
```

---

## 📋 CHECKLIST PRE PRODUKCIU

```
Backend:
□ API keys v environment variables (nie v kóde!)
□ HTTPS enabled (Let's Encrypt)
□ Rate limiting (ochrana pred DDoS)
□ Logging všetkých transakcií
□ Webhook signature validation
□ Error handling + retry logic
□ Backup databázy

Frontend:
□ Stripe.js loaded cez CDN
□ Payment form UX/UI
□ Loading states
□ Error handling
□ Success/failure redirects
□ Mobile responsive
□ Accessibility (ARIA labels)

Legal:
□ Terms of Service
□ Privacy Policy
□ Refund policy
□ GDPR compliance
□ Uloženie transaction logs (5-7 rokov)

Testing:
□ Test all payment methods
□ Test declined cards
□ Test 3D Secure
□ Test webhooks
□ Test edge cases (duplicate payments, atď.)
□ Load testing
```

---

## 🎯 ZÁVER

**ÁNO, platby sa dajú integrovať!**

**Najjednoduchšie riešenie:**
- **Frontend:** Vaša existujúca app
- **Backend:** Node.js/PHP s 2 endpointmi
- **Platobná brána:** Stripe (najlepšie API) alebo ComGate (najnižšie poplatky SK)

**Odhadovaný čas implementácie:**
- Stripe MVP: 1-2 týždne
- Produkcia: 3-4 týždne

**Potrebné znalosti:**
- JavaScript (máme ✅)
- Node.js/PHP basics (backend)
- REST API calling (máme ✅)
- Webhooks concept

**Ďalšie kroky:**
1. Rozhodnúť sa: Stripe vs ComGate vs TatraPay
2. Vytvoriť backend (môžem pomôcť s kódom)
3. Integrovať do existujúcej app
4. Testovať
5. Deploy

Chceš, aby som vytvoril **kompletný working example** s Node.js backendom? 🚀

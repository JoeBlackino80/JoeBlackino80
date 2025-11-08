# 💳 Payment Gateway Backend

Backend server pre spracovanie online platieb vo fakturačnom systéme.

## 🚀 Quick Start

### 1. Inštalácia

```bash
cd backend
npm install
```

### 2. Konfigurácia

Skopírujte `.env.example` na `.env` a vyplňte vaše Stripe API keys:

```bash
cp .env.example .env
nano .env  # alebo vi, vim, code, atď.
```

### 3. Získanie Stripe API Keys

1. Zaregistrujte sa na [stripe.com](https://stripe.com)
2. Choďte do Dashboard → Developers → [API keys](https://dashboard.stripe.com/apikeys)
3. Skopírujte:
   - **Secret key** → `STRIPE_SECRET_KEY`
   - **Publishable key** → `STRIPE_PUBLISHABLE_KEY`

### 4. Nastavenie Webhooku

1. Choďte do Dashboard → Developers → [Webhooks](https://dashboard.stripe.com/webhooks)
2. Kliknite "Add endpoint"
3. URL: `https://vasa-domena.sk/webhook` (alebo ngrok pre local testing)
4. Events to send: Vyber všetky `payment_intent.*` eventy
5. Skopírujte **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 5. Spustenie servera

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server beží na: `http://localhost:3000`

---

## 📡 API Endpoints

### 1️⃣ Vytvorenie Payment Intent

**POST** `/api/create-payment-intent`

Request:
```json
{
  "invoiceNumber": "2025-0042"
}
```

Response:
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxxxxxxxxxxxxxx",
  "amount": 1200.00,
  "currency": "eur"
}
```

### 2️⃣ Získanie faktúry

**GET** `/api/invoice/:number`

Response:
```json
{
  "id": 1,
  "number": "2025-0042",
  "clientName": "ACME s.r.o.",
  "total": 1200.00,
  "status": "issued"
}
```

### 3️⃣ Webhook (Stripe notifikácie)

**POST** `/webhook`

Automaticky zavolaný Stripe keď sa zmení stav platby.

### 4️⃣ Status platby

**GET** `/api/payment-status/:paymentIntentId`

Response:
```json
{
  "status": "succeeded",
  "amount": 1200.00,
  "currency": "eur",
  "invoiceNumber": "2025-0042"
}
```

### 5️⃣ Vytvorenie refundu

**POST** `/api/refund`

Request:
```json
{
  "paymentIntentId": "pi_xxxxxxxxxxxxxxx",
  "amount": 1200.00,
  "reason": "requested_by_customer"
}
```

---

## 🧪 Testovanie

### Test kartové čísla (Stripe test mode)

**✅ Úspešné platby:**
- `4242 4242 4242 4242` - Visa (default success)
- `5555 5555 5555 4444` - Mastercard

**❌ Neúspešné platby:**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds
- `4000 0000 0000 0069` - Expired card
- `4000 0000 0000 0127` - Incorrect CVC

**🔐 3D Secure:**
- `4000 0025 0000 3155` - Requires authentication
- `4000 0027 6000 3184` - 3DS2 required

**Detaily:**
- Expiry: Akýkoľvek budúci dátum (napr. `12/25`)
- CVC: Akékoľvek 3 číslice (napr. `123`)
- ZIP: Akýkoľvek (napr. `12345`)

Viac test kariet: https://stripe.com/docs/testing

---

## 🔒 Bezpečnosť

### ⚠️ NIKDY nenahrávajte na git:

```bash
# .gitignore už obsahuje:
.env
node_modules/
*.log
```

### ✅ Best practices:

1. **API keys len v .env súbore**
   - Nikdy v kóde
   - Nikdy v git repozitári

2. **HTTPS v produkcii**
   - Použite Let's Encrypt
   - Stripe vyžaduje HTTPS pre webhooks

3. **Webhook signature validation**
   - Vždy validujte webhook signature
   - Ochrana pred fake webhookmi

4. **Rate limiting**
   - Pridajte `express-rate-limit`
   - Max 100 requests/15min per IP

5. **CORS**
   - Nastavte allowed origins
   - Nie wildcard `*` v produkcii

---

## 📦 Deployment

### Option 1: Railway.app (najjednoduchšie)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add environment variables v Railway dashboard

# 5. Deploy
railway up
```

### Option 2: Heroku

```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create invoice-payment-backend

# 4. Set environment variables
heroku config:set STRIPE_SECRET_KEY=sk_live_xxx
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_xxx

# 5. Deploy
git push heroku main
```

### Option 3: VPS (DigitalOcean, Vultr)

```bash
# 1. SSH do servera
ssh root@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 3. Clone repo & install
git clone https://github.com/your-repo.git
cd backend
npm install --production

# 4. Setup PM2 (process manager)
npm install -g pm2
pm2 start server.js --name payment-backend

# 5. Setup Nginx reverse proxy
# 6. Setup SSL with Let's Encrypt
```

---

## 🐛 Troubleshooting

### Webhook nie je prijatý

```bash
# Test webhook lokálne s ngrok:
npm install -g ngrok
ngrok http 3000

# Použite ngrok URL v Stripe webhook settings:
# https://xxxx-xx-xx-xxx-xxx.ngrok.io/webhook
```

### Stripe API key error

```
Error: No API key provided
```

**Fix:** Skontrolujte, že .env súbor existuje a obsahuje `STRIPE_SECRET_KEY`

### CORS error

```
Access-Control-Allow-Origin missing
```

**Fix:** Pridajte váš frontend domain do `ALLOWED_ORIGINS` v .env

---

## 📚 Dokumentácia

- [Stripe API Docs](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Payment Intents](https://stripe.com/docs/payments/payment-intents)

---

## 📞 Support

Issues? Otvorte ticket alebo kontaktujte: support@vasafirma.sk

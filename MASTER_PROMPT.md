# 🎯 MASTER PROMPT - SLOVENSKÝ FAKTÚRAČNÝ SYSTÉM PRE SZČO

## 📋 ZÁKLADNÝ POPIS

Vytvor kompletný **Single Page Application (SPA) faktúračný systém** v čistom vanilla JavaScript pre slovenské SZČO/živnostníkov. Aplikácia musí byť **100% client-side**, funkčná offline po prvom načítaní, s plnou podporou slovenských daňových pravidiel (DPH 20%, validácia IČO, IBAN).

---

## 🛠️ TECHNICKÝ STACK

### Povinné technológie:
```
- Frontend: Vanilla JavaScript ES6+ (žiadne frameworky - React/Vue/Angular)
- HTML5: Sémantický markup
- CSS3: Moderný responsive dizajn, dark mode podpora
- Databáza: IndexedDB (primárne) + localStorage (fallback)
- Knižnice:
  * Chart.js 4.4.0 (grafy a vizualizácie)
  * jsPDF 2.5.1 (PDF export faktúr)
```

### Architektúra:
```
- Pattern: Object-Oriented Programming (OOP)
- 2 hlavné triedy:
  1. InvoiceDB - databázová vrstva (IndexedDB operations)
  2. InvoiceSystem - business logika a UI management
- Event Delegation pattern pre optimálny performance
- Lazy Initialization pre charts (len keď sú potrebné)
```

---

## 📊 DÁTOVÉ MODELY

### 1. Company (Firma)
```javascript
{
  id: number,
  name: string,
  ico: string,        // 8-miestne IČO s checksumom
  dic: string,        // DIČ
  icdph: string,      // IČ DPH (voliteľné)
  address: string,
  city: string,
  zip: string,
  country: string,
  email: string,
  phone: string,
  iban: string,       // SK IBAN s checksumom
  bankName: string,
  logo: string        // Base64 obrázok
}
```

### 2. Client (Klient)
```javascript
{
  id: number,
  name: string,
  ico: string,
  dic: string,
  icdph: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  zip: string,
  country: string,
  iban: string,
  invoiceCount: number,    // Počet faktúr
  totalRevenue: number,    // Celkový obrat
  createdDate: string      // ISO datum
}
```

### 3. Product/Service (Produkt/Služba)
```javascript
{
  id: number,
  name: string,
  description: string,
  price: number,           // Cena bez DPH
  unit: string,            // 'ks', 'hod', 'm²', atď.
  vatRate: number,         // 20 (percent)
  category: string,        // 'service' alebo 'goods'
  stockQuantity: number,   // Skladové množstvo (voliteľné)
  trackStock: boolean      // Sledovať sklad?
}
```

### 4. Invoice (Faktúra)
```javascript
{
  id: number,
  number: string,          // Format: YYYY-####
  type: string,            // 'invoice', 'proforma', 'offer'
  clientId: number,
  companyId: number,
  issueDate: string,       // ISO datum
  dueDate: string,         // ISO datum
  deliveryDate: string,    // ISO datum dodania
  paymentMethod: string,   // 'transfer', 'cash', 'card'
  variableSymbol: string,  // Variabilný symbol
  constantSymbol: string,  // Konštantný symbol
  items: [
    {
      productId: number,
      name: string,
      description: string,
      quantity: number,
      unit: string,
      pricePerUnit: number,  // Bez DPH
      vatRate: number,
      discount: number,      // Percent
      total: number          // S DPH
    }
  ],
  subtotal: number,        // Suma bez DPH
  totalVat: number,        // Celková DPH
  total: number,           // Celková suma s DPH
  status: string,          // 'draft', 'issued', 'paid', 'overdue', 'cancelled'
  notes: string,           // Poznámky
  alreadyPaid: number,     // Už zaplatené
  created: string,         // ISO timestamp
  modified: string         // ISO timestamp
}
```

### 5. Project (Projekt)
```javascript
{
  id: number,
  name: string,
  clientId: number,
  description: string,
  budget: number,
  estimatedHours: number,
  actualHours: number,
  deadline: string,        // ISO datum
  status: string,          // 'active', 'completed', 'on-hold'
  created: string
}
```

---

## 🎨 UI/UX POŽIADAVKY

### Navigácia (Top navbar):
```
[Logo] Fakturačný Systém  [Dropdown: Aktívna firma ▼]

[Dashboard] [Faktúry] [Klienti] [Produkty] [Projekty]
[DPH] [Banka] [Kalkulátor] [Reporty] [Nastavenia] [🌙]
```

### Stránky (Single Page):

#### 1. **DASHBOARD**
```
┌─────────────────────────────────────────────────────┐
│ 📊 ŠTATISTIKY (4 karty)                             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │ Obrat    │ │ Faktúry  │ │ Po spl.  │ │ Klienti  ││
│ │ €45,230  │ │ 156      │ │ 3        │ │ 42       ││
│ │ +12.5%   │ │ 8 neuh.  │ │ €2,340   │ │ +5 mes.  ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
├─────────────────────────────────────────────────────┤
│ 📈 GRAFY (4 charts v 2x2 grid)                      │
│ ┌──────────────┐ ┌──────────────┐                  │
│ │ Obrat v čase │ │ Príjmy/Výdaj │                  │
│ │ [Line chart] │ │ [Bar chart]  │                  │
│ └──────────────┘ └──────────────┘                  │
│ ┌──────────────┐ ┌──────────────┐                  │
│ │ TOP klienti  │ │ Kategórie    │                  │
│ │ [Bar chart]  │ │ [Doughnut]   │                  │
│ └──────────────┘ └──────────────┘                  │
├─────────────────────────────────────────────────────┤
│ 📄 NEDÁVNE FAKTÚRY (tabuľka 5 posledných)          │
│ 📋 NEDÁVNE AKTIVITY (log 10 posledných akcií)      │
└─────────────────────────────────────────────────────┘
```

Grafy musia byť:
- **Responzívne** (Chart.js responsive: true)
- **Lazy loaded** (inicializuj len pri navigácii na stránku, nie v constructore)
- **100ms delay** po navigácii (setTimeout pre zabezpečenie DOM ready)
- **Conditionally created** (if (!this.charts.chartName) { create })

#### 2. **FAKTÚRY**
```
┌─────────────────────────────────────────────────────┐
│ [+ Nová faktúra] [📥 Import] [📤 Export ▼]          │
│ [🔍 Hľadať...] [Filter: Všetky ▼] [Rok: 2025 ▼]    │
├─────────────────────────────────────────────────────┤
│ TABUĽKA:                                            │
│ ☐ | Číslo | Klient | Dátum | Splatnosť | Suma | Stav│
│ ☐ | 2025-0042 | ACME | 01.11 | 15.11 | €1,250 | 💰 │
│ ☐ | 2025-0041 | Tech | 28.10 | 11.11 | €890   | ⏰ │
│                                                     │
│ [Akcie]: [✉ Email] [📄 PDF] [👁 Náhľad] [✏ Edit] [🗑]│
└─────────────────────────────────────────────────────┘
```

**Funkcie:**
- ✅ Bulk selection (checkboxy)
- ✅ Bulk delete (ak >0 vybraných, zobraziť button)
- ✅ Real-time search (filter pri každom keystroke)
- ✅ Status badge farby: paid=zelená, overdue=červená, issued=oranžová, draft=šedá
- ✅ Inline actions pre každý riadok
- ✅ CSV export (UTF-8 BOM pre Excel)
- ✅ PDF export (jsPDF s podporou slovenčiny)

#### 3. **KLIENTI**
```
┌─────────────────────────────────────────────────────┐
│ 📊 ŠTATISTIKY (4 karty)                             │
│ ┌────────────┐┌────────────┐┌──────────┐┌─────────┐│
│ │ Klienti: 42││ Obrat:     ││ Priemer: ││ TOP:    ││
│ │            ││ €125,340   ││ €2,984   ││ ACME    ││
│ └────────────┘└────────────┘└──────────┘└─────────┘│
├─────────────────────────────────────────────────────┤
│ 📈 GRAF: Obrat podľa klientov (Bar chart)           │
│ [Interaktívny bar chart - TOP 10 klientov]          │
├─────────────────────────────────────────────────────┤
│ [+ Nový klient] [📥 Import CSV] [📤 Export CSV]     │
│ [🔍 Hľadať klienta...]                              │
├─────────────────────────────────────────────────────┤
│ TABUĽKA:                                            │
│ ☐ | Názov | IČO | Email | Faktúr | Obrat | Akcie   │
└─────────────────────────────────────────────────────┘
```

**CSV Import formát:**
```csv
name;ico;dic;icdph;email;address;iban
ACME s.r.o.;12345678;1234567890;SK1234567890;info@acme.sk;Bratislava 1;SK1234567890123456789012
```

**Validácie:**
- IČO: 8 číslic + modulo 11 checksum (slovenský algoritmus)
- IBAN: SK + 22 číslic + modulo 97 checksum (ISO 7064)
- Email: RFC 5322 regex
- DIČ: 10 číslic

#### 4. **PRODUKTY**
```
┌─────────────────────────────────────────────────────┐
│ 📊 ŠTATISTIKY + GRAF (podobne ako Klienti)          │
├─────────────────────────────────────────────────────┤
│ [+ Nový produkt] [📥 Import CSV] [📤 Export CSV]    │
│ [🔍 Hľadať...] [Kategória: Všetky ▼]                │
├─────────────────────────────────────────────────────┤
│ TABUĽKA:                                            │
│ ☐ | Názov | Cena | DPH | Jednotka | Kategória | ⚙  │
└─────────────────────────────────────────────────────┘
```

#### 5. **PROJEKTY**
```
│ [+ Nový projekt] [🔍 Hľadať...] [Status: Všetky ▼] │
│ TABUĽKA:                                            │
│ ☐ | Názov | Klient | Rozpočet | Hodiny | Deadline |│
```

#### 6. **DPH**
```
┌─────────────────────────────────────────────────────┐
│ VÝPOČET DPH ZA OBDOBIE                              │
│ [Od: 01.01.2025] [Do: 31.12.2025] [Vypočítať]      │
├─────────────────────────────────────────────────────┤
│ Výsledky:                                           │
│ • DPH na výstupe (z faktúr): €8,460                 │
│ • DPH na vstupe (z nákladov): €2,340               │
│ • DPH na úhradu: €6,120                             │
│                                                     │
│ [📤 Export výkazu DPH (PDF)]                        │
└─────────────────────────────────────────────────────┘
```

#### 7. **BANKA**
```
│ [📤 Import výpisu (.csv)]                           │
│ PÁROVANIE TRANSAKCIÍ:                               │
│ € | Dátum | Suma | VS | Párovanie | Faktúra        │
│ • Automatické párovanie podľa variabilného symbolu  │
│ • Manuálne označenie zaplatených faktúr             │
```

#### 8. **KALKULÁTOR**
```
┌─────────────────────────────────────────────────────┐
│ DAŇOVÝ KALKULÁTOR PRE SZČO                          │
│ Príjem za rok: [_________] €                        │
│ Výdavky:                                            │
│  • Paušál 60%: ○                                    │
│  • Skutočné výdavky: [_________] € ○                │
│                                                     │
│ VÝSLEDOK:                                           │
│ • Základ dane: €XX,XXX                              │
│ • Daň z príjmu (19%): €X,XXX                        │
│ • Odvody (zdravotné + sociálne): €X,XXX             │
│ • Celkové odvody: €XX,XXX                           │
│ • Čistý zisk: €XX,XXX                               │
└─────────────────────────────────────────────────────┘
```

#### 9. **REPORTY**
```
│ [Obdobie: Rok 2025 ▼] [Export ▼]                   │
│                                                     │
│ 📊 FINANČNÝ PREHĽAD                                 │
│ • Celkový príjem: €XXX,XXX                          │
│ • Celkové výdavky: €XX,XXX                          │
│ • Zisk: €XX,XXX                                     │
│ • Marža: XX%                                        │
│                                                     │
│ 📈 GRAFY (Line + Bar + Pie)                         │
```

#### 10. **NASTAVENIA**
```
┌─────────────────────────────────────────────────────┐
│ PROFIL FIRMY                                        │
│ [Upraviť logo] [Upraviť údaje]                      │
│                                                     │
│ NASTAVENIA APLIKÁCIE                                │
│ Jazyk: [Slovenčina ▼]                               │
│ Tmavý režim: [Vypnutý ▼]                            │
│ Formát dátumu: [DD.MM.YYYY ▼]                       │
│ Mena: [EUR (€) ▼]                                   │
│                                                     │
│ ZÁLOHOVANIE                                         │
│ [📥 Exportovať všetky dáta (JSON)]                  │
│ [📤 Importovať dáta (JSON)]                         │
│ [🗑 Vymazať všetky dáta]                            │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 MODÁLY (Modal Windows)

### Modal: Nová faktúra
```
┌──────────────────────────────────────────┐
│ Nová faktúra                          [×]│
├──────────────────────────────────────────┤
│ Číslo faktúry: [2025-0043] (auto)       │
│ Klient: [Vyberte klienta ▼]             │
│ Dátum vystavenia: [06.11.2025]          │
│ Dátum splatnosti: [20.11.2025] (auto+14)│
│ Spôsob platby: [Bankový prevod ▼]       │
│                                          │
│ POLOŽKY:                                 │
│ ┌──────────────────────────────────────┐│
│ │ Produkt | Množstvo | Cena | DPH | Σ ││
│ │ [Select]│ [1] [ks] │ [€0] │20% │€0 ││
│ └──────────────────────────────────────┘│
│ [+ Pridať položku]                       │
│                                          │
│ ┌──────────────────────────────────────┐│
│ │ Medzisúčet:           €1,000.00      ││
│ │ DPH 20%:              €200.00        ││
│ │ CELKOM:               €1,200.00      ││
│ └──────────────────────────────────────┘│
│                                          │
│ Poznámka: [___________________________] │
│                                          │
│ [Zrušiť]  [Uložiť koncept] [Vystaviť]   │
└──────────────────────────────────────────┘
```

**LIVE KALKULAČKA:**
- Pri zmene množstva/ceny → auto-prepočet riadku
- Pri zmene položiek → auto-prepočet súčtov
- Podpora zliav v % alebo €
- Auto-populate z produktov (názov, cena, DPH)

---

## ⚙️ FUNKCIONALITA

### 1. **LIVE INVOICE CALCULATOR**
```javascript
// Pri každej zmene v položke faktúry:
function calculateItemTotal(row) {
  const quantity = parseFloat(row.querySelector('input[name="quantity[]"]').value) || 0;
  const price = parseFloat(row.querySelector('input[name="price[]"]').value) || 0;
  const vatRate = parseFloat(row.querySelector('select[name="vat[]"]').value) || 0;
  const discount = parseFloat(row.querySelector('input[name="discount[]"]')?.value) || 0;

  const subtotal = quantity * price;
  const discountAmount = subtotal * (discount / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const vatAmount = subtotalAfterDiscount * (vatRate / 100);
  const total = subtotalAfterDiscount + vatAmount;

  row.querySelector('.item-total').value = total.toFixed(2) + ' €';
  updateInvoiceTotals(); // Globálny prepočet
}

function updateInvoiceTotals() {
  let subtotal = 0;
  let totalVat = 0;

  document.querySelectorAll('.invoice-item-row').forEach(row => {
    // Vypočítaj pre každý riadok...
  });

  document.getElementById('invoiceSubtotal').textContent = '€' + subtotal.toFixed(2);
  document.getElementById('invoiceTotalVat').textContent = '€' + totalVat.toFixed(2);
  document.getElementById('invoiceTotal').textContent = '€' + (subtotal + totalVat).toFixed(2);
}
```

### 2. **SEARCH & FILTERING**
```javascript
// Real-time filter pri každom keystroke:
document.getElementById('productSearch').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  this.renderProducts(this.mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm)
  ));
});

document.getElementById('categoryFilter').addEventListener('change', (e) => {
  const category = e.target.value;
  const filtered = category === ''
    ? this.mockProducts
    : this.mockProducts.filter(p => p.category === category);
  this.renderProducts(filtered);
});
```

### 3. **BULK DELETE**
```javascript
// Multi-select s bulk delete:
function initBulkDelete() {
  const selectAll = document.getElementById('selectAllClients');
  const checkboxes = document.querySelectorAll('.client-checkbox');
  const bulkDeleteBtn = document.getElementById('bulkDeleteClientsBtn');

  selectAll.addEventListener('change', (e) => {
    checkboxes.forEach(cb => cb.checked = e.target.checked);
    updateBulkDeleteButton();
  });

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => updateBulkDeleteButton());
  });

  function updateBulkDeleteButton() {
    const checkedCount = document.querySelectorAll('.client-checkbox:checked').length;
    bulkDeleteBtn.style.display = checkedCount > 0 ? 'inline-block' : 'none';
    bulkDeleteBtn.textContent = `Zmazať označené (${checkedCount})`;
  }
}
```

### 4. **CSV EXPORT**
```javascript
function exportClientsCSV() {
  // UTF-8 BOM pre správne zobrazenie v Excel:
  let csv = '\uFEFF';
  csv += 'Názov;IČO;DIČ;IČ DPH;Email;Adresa;IBAN;Počet faktúr;Celkový obrat\n';

  this.mockClients.forEach(client => {
    csv += `${client.name};${client.ico};${client.dic};${client.icdph};`;
    csv += `${client.email};${client.address};${client.iban};`;
    csv += `${client.invoiceCount};${client.totalRevenue.toFixed(2)}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'klienti-' + new Date().toISOString().split('T')[0] + '.csv';
  link.click();
}
```

### 5. **CSV IMPORT**
```javascript
function handleClientCSVImport(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const csvContent = e.target.result;
    const lines = csvContent.split('\n');
    const headers = lines[0].split(';');

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';');
      if (values.length < headers.length) continue;

      const client = {
        id: Date.now() + i,
        name: values[0],
        ico: values[1],
        dic: values[2],
        icdph: values[3],
        email: values[4],
        address: values[5],
        iban: values[6],
        invoiceCount: parseInt(values[7]) || 0,
        totalRevenue: parseFloat(values[8]) || 0
      };

      this.mockClients.push(client);
    }

    this.renderClients();
    this.showNotification('Import úspešný', `Importovaných ${lines.length - 1} klientov`, 'success');
  };

  reader.readAsText(file, 'UTF-8');
}
```

### 6. **PDF EXPORT (jsPDF)**
```javascript
function downloadPDF(invoiceId) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const invoice = this.mockInvoices.find(inv => inv.id === invoiceId);
  const client = this.mockClients.find(c => c.id === invoice.clientId);
  const company = this.companies.find(c => c.id === this.currentCompanyId);

  // Hlavička faktúry
  doc.setFontSize(20);
  doc.text('FAKTÚRA', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Číslo: ${invoice.number}`, 20, 35);
  doc.text(`Dátum vystavenia: ${invoice.issueDate}`, 20, 42);
  doc.text(`Dátum splatnosti: ${invoice.dueDate}`, 20, 49);

  // Dodávateľ
  doc.setFontSize(10);
  doc.text('Dodávateľ:', 20, 65);
  doc.text(company.name, 20, 71);
  doc.text(company.address, 20, 77);
  doc.text(`IČO: ${company.ico}`, 20, 83);
  doc.text(`DIČ: ${company.dic}`, 20, 89);

  // Odberateľ
  doc.text('Odberateľ:', 120, 65);
  doc.text(client.name, 120, 71);
  doc.text(client.address, 120, 77);
  doc.text(`IČO: ${client.ico}`, 120, 83);

  // Tabuľka položiek
  let y = 110;
  doc.setFontSize(10);
  doc.text('Položka', 20, y);
  doc.text('Množstvo', 90, y);
  doc.text('Cena', 120, y);
  doc.text('DPH', 145, y);
  doc.text('Spolu', 170, y);

  y += 7;
  invoice.items.forEach(item => {
    doc.text(item.name, 20, y);
    doc.text(`${item.quantity} ${item.unit}`, 90, y);
    doc.text(`€${item.pricePerUnit.toFixed(2)}`, 120, y);
    doc.text(`${item.vatRate}%`, 145, y);
    doc.text(`€${item.total.toFixed(2)}`, 170, y);
    y += 7;
  });

  // Súčty
  y += 10;
  doc.setFontSize(12);
  doc.text('Celkom bez DPH:', 120, y);
  doc.text(`€${invoice.subtotal.toFixed(2)}`, 170, y);
  y += 7;
  doc.text('DPH 20%:', 120, y);
  doc.text(`€${invoice.totalVat.toFixed(2)}`, 170, y);
  y += 7;
  doc.setFontSize(14);
  doc.text('CELKOM:', 120, y);
  doc.text(`€${invoice.total.toFixed(2)}`, 170, y);

  doc.save(`faktura-${invoice.number}.pdf`);
}
```

### 7. **VALIDÁCIE**

#### IČO Checksum (Slovak modulo 11):
```javascript
function validateIcoChecksum(ico) {
  if (!/^\d{8}$/.test(ico)) return false;

  const weights = [8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 7; i++) {
    sum += parseInt(ico[i]) * weights[i];
  }

  const remainder = sum % 11;
  let checkDigit;

  if (remainder === 0) {
    checkDigit = 1;
  } else if (remainder === 1) {
    checkDigit = 0;
  } else {
    checkDigit = 11 - remainder;
  }

  return parseInt(ico[7]) === checkDigit;
}
```

#### IBAN Checksum (ISO 7064 modulo 97):
```javascript
function validateIbanChecksum(iban) {
  // SK formát: SK + 2 check digits + 22 čísel
  if (!/^SK\d{22}$/.test(iban)) return false;

  // Preusporiadaj: posuň prvé 4 znaky na koniec
  const rearranged = iban.substring(4) + iban.substring(0, 4);

  // Preveď písmená na čísla (A=10, B=11, ..., Z=35)
  let numericString = '';
  for (let char of rearranged) {
    if (char >= 'A' && char <= 'Z') {
      numericString += (char.charCodeAt(0) - 55).toString();
    } else {
      numericString += char;
    }
  }

  // Modulo 97 na veľkom čísle (digit-by-digit algoritmus)
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }

  return remainder === 1;
}
```

### 8. **INDEXEDDB + AUTO-SAVE**

#### InvoiceDB trieda:
```javascript
class InvoiceDB {
  constructor() {
    this.dbName = 'InvoiceSystemDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const storeNames = ['companies', 'clients', 'products', 'projects',
                           'invoices', 'offers', 'proformas', 'settings'];

        storeNames.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });

            if (storeName === 'invoices') {
              store.createIndex('number', 'number', { unique: true });
              store.createIndex('clientId', 'clientId', { unique: false });
              store.createIndex('status', 'status', { unique: false });
            }
          }
        });
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async saveData(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async migrateFromLocalStorage() {
    // Migrácia existujúcich dát z localStorage do IndexedDB
    const companies = localStorage.getItem('invoiceSystemCompanies');
    if (companies) {
      const companiesArray = JSON.parse(companies);
      for (const company of companiesArray) {
        await this.saveData('companies', company);
      }
    }
    // ... podobne pre clients, products, atď.
  }
}
```

#### Auto-save pattern:
```javascript
// Dual storage - IndexedDB + localStorage fallback
function saveCompanies() {
  // localStorage (instant, synchronous)
  localStorage.setItem('invoiceSystemCompanies', JSON.stringify(this.companies));

  // IndexedDB (persistent, asynchronous)
  if (window.invoiceDB && window.invoiceDB.db) {
    this.companies.forEach(company => {
      window.invoiceDB.saveData('companies', company);
    });
  }
}
```

### 9. **KEYBOARD SHORTCUTS**
```javascript
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+I - Nová faktúra
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      this.openModal('invoiceModal');
    }

    // Ctrl+K - Nový klient
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      this.openModal('clientModal');
    }

    // Ctrl+P - Nový produkt
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      this.openModal('productModal');
    }

    // Escape - Zavrieť modal
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.active');
      if (openModal) this.closeModal(openModal.id);
    }

    // / (slash) - Focus na search
    if (e.key === '/' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      const searchInput = document.getElementById('invoiceSearch') ||
                         document.getElementById('clientSearch') ||
                         document.getElementById('productSearch');
      searchInput?.focus();
    }
  });
}
```

### 10. **DYNAMIC DASHBOARD STATISTICS**
```javascript
function updateDashboard() {
  const currentYear = new Date().getFullYear();

  // Celkový obrat
  const yearlyRevenue = this.mockInvoices
    .filter(inv => inv.status === 'paid' && inv.issueDate.startsWith(currentYear))
    .reduce((sum, inv) => sum + inv.total, 0);

  document.getElementById('dashTotalRevenue').textContent = '€' + yearlyRevenue.toLocaleString('sk-SK');

  // Neuhradené faktúry
  const unpaidCount = this.mockInvoices.filter(inv => inv.status === 'issued').length;
  document.getElementById('dashUnpaidCount').textContent = unpaidCount + ' neuhradených';

  // Po splatnosti
  const today = new Date().toISOString().split('T')[0];
  const overdue = this.mockInvoices.filter(inv =>
    inv.status === 'issued' && inv.dueDate < today
  );
  document.getElementById('dashOverdueCount').textContent = overdue.length;
  document.getElementById('dashOverdueAmount').textContent =
    '€' + overdue.reduce((sum, inv) => sum + inv.total, 0).toLocaleString('sk-SK') + ' celkom';

  // Noví klienti tento mesiac
  const thisMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const newClients = this.mockClients.filter(c => c.createdDate?.startsWith(thisMonth)).length;
  document.getElementById('dashNewClients').textContent = '+' + newClients + ' tento mesiac';
}
```

### 11. **STATISTICS & CHARTS (Clients/Products pages)**
```javascript
function initClientRevenueChart() {
  const ctx = document.getElementById('clientRevenueChart');
  if (!ctx) return;

  // TOP 10 klientov podľa obratu
  const topClients = [...this.mockClients]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  this.charts.clientRevenue = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: topClients.map(c => c.name),
      datasets: [{
        label: 'Obrat (€)',
        data: topClients.map(c => c.totalRevenue),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function updateClientStatistics() {
  const totalClients = this.mockClients.length;
  const totalRevenue = this.mockClients.reduce((sum, c) => sum + c.totalRevenue, 0);
  const avgRevenue = totalRevenue / totalClients;
  const topClient = [...this.mockClients].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];

  document.getElementById('clientsStatTotal').textContent = totalClients;
  document.getElementById('clientsStatRevenue').textContent = '€' + totalRevenue.toLocaleString('sk-SK');
  document.getElementById('clientsStatAverage').textContent = '€' + avgRevenue.toLocaleString('sk-SK');
  document.getElementById('clientsStatTop').textContent = topClient?.name || '-';
}
```

### 12. **TOAST NOTIFICATIONS**
```javascript
function showNotification(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-header">
      <strong>${title}</strong>
      <button class="toast-close">&times;</button>
    </div>
    <div class="toast-body">${message}</div>
  `;

  document.getElementById('toastContainer').appendChild(toast);

  // Auto-hide po 5 sekundách
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 5000);

  // Close button
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  });
}
```

---

## 🎨 CSS POŽIADAVKY

### Color Scheme:
```css
:root {
  --primary: #3498db;
  --success: #2ecc71;
  --warning: #f39c12;
  --danger: #e74c3c;
  --dark: #2c3e50;
  --light: #ecf0f1;
  --gray: #95a5a6;

  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --border: #dee2e6;
}

/* Dark mode */
body.dark-mode {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #eee;
  --text-secondary: #aaa;
  --border: #0f3460;
}
```

### Responsive Design:
```css
/* Mobile first */
@media (max-width: 768px) {
  .stats { flex-direction: column; }
  .charts-section { grid-template-columns: 1fr; }
  .nav-menu { flex-wrap: wrap; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .charts-section { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1025px) {
  .charts-section { grid-template-columns: repeat(2, 1fr); }
  .container { max-width: 1400px; }
}
```

### Status Badges:
```css
.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-paid { background: #d4edda; color: #155724; }
.badge-issued { background: #fff3cd; color: #856404; }
.badge-overdue { background: #f8d7da; color: #721c24; }
.badge-draft { background: #e2e3e5; color: #383d41; }
.badge-cancelled { background: #d6d8db; color: #1b1e21; }
```

---

## 🔧 MOCK DATA

### Vytvor realistické mock dáta:
```javascript
initMockClients() {
  return [
    {
      id: 1,
      name: 'ACME s.r.o.',
      ico: '12345678', // Validné s checksumom
      dic: '1234567890',
      icdph: 'SK1234567890',
      email: 'info@acme.sk',
      phone: '+421 900 123 456',
      address: 'Hlavná 1, 811 01 Bratislava',
      iban: 'SK3112000000198742637541', // Validný IBAN
      invoiceCount: 24,
      totalRevenue: 18450.00,
      createdDate: '2024-01-15'
    },
    // ... minimálne 20 klientov
  ];
}

initMockInvoices() {
  return [
    {
      id: 1,
      number: '2025-0001',
      type: 'invoice',
      clientId: 1,
      companyId: 1,
      issueDate: '2025-01-05',
      dueDate: '2025-01-19',
      deliveryDate: '2025-01-05',
      paymentMethod: 'transfer',
      variableSymbol: '20250001',
      items: [
        {
          productId: 1,
          name: 'Vývoj webstránky',
          quantity: 40,
          unit: 'hod',
          pricePerUnit: 25.00,
          vatRate: 20,
          discount: 0,
          total: 1200.00
        }
      ],
      subtotal: 1000.00,
      totalVat: 200.00,
      total: 1200.00,
      status: 'paid',
      notes: '',
      created: '2025-01-05T10:30:00Z'
    },
    // ... minimálne 50 faktúr s rôznymi statusmi
  ];
}
```

---

## ⚡ PERFORMANCE OPTIMALIZÁCIE

### 1. Event Delegation:
```javascript
// ZLÝÉ (N listenerov):
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', () => deleteItem(btn.dataset.id));
});

// DOBRÉ (1 listener):
document.getElementById('clientsTable').addEventListener('click', (e) => {
  if (e.target.closest('.delete-btn')) {
    const id = e.target.closest('.delete-btn').dataset.id;
    this.deleteClient(id);
  }
});
```

### 2. Lazy Chart Initialization:
```javascript
navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(page).classList.add('active');

  this.currentPage = page;

  // Inicializuj charts len keď sú potrebné + delay pre DOM ready
  if (page === 'clients') {
    setTimeout(() => {
      if (!this.charts.clientRevenue) {
        this.initClientRevenueChart();
      }
      this.updateClientStatistics();
    }, 100);
  }
}
```

### 3. Debouncing pre search:
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Použitie:
const debouncedSearch = debounce((searchTerm) => {
  this.renderProducts(this.filterProducts(searchTerm));
}, 300);

searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
```

---

## 🐛 ERROR HANDLING

### Global error handling:
```javascript
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  this.showNotification('Chyba', 'Vyskytla sa neočakávaná chyba. Skúste obnoviť stránku.', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  this.showNotification('Chyba', 'Problém s načítaním dát.', 'error');
});
```

### Try-catch v kritických funkciách:
```javascript
async initDatabase() {
  if (!window.indexedDB) {
    console.warn('IndexedDB not available, using localStorage fallback');
    return;
  }

  try {
    await window.invoiceDB.init();
    console.log('IndexedDB initialized successfully');

    const migrated = localStorage.getItem('dbMigrated');
    if (!migrated) {
      await window.invoiceDB.migrateFromLocalStorage();
      localStorage.setItem('dbMigrated', 'true');
    }

    await this.loadCompaniesFromDB();
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    this.showNotification('Upozornenie', 'Používa sa záložné úložisko localStorage', 'warning');
  }
}
```

---

## ✅ CHECKLIST PRE IMPLEMENTÁCIU

### HTML:
- [ ] Sémantický markup (nav, main, section, article)
- [ ] Všetky formuláre majú správne ID
- [ ] Všetky buttony majú správne event attributes/IDs
- [ ] Všetky inputy majú label a placeholder
- [ ] Toast container na konci body
- [ ] Chart.js a jsPDF CDN linky pred script.js
- [ ] **DÔLEŽITÉ: Neimportuj duplicitné skripty (database.js, translations.js)**

### JavaScript:
- [ ] InvoiceDB trieda s 10+ metódami
- [ ] InvoiceSystem trieda s 200+ metódami
- [ ] window.invoiceDB = new InvoiceDB()
- [ ] DOMContentLoaded -> new InvoiceSystem()
- [ ] Všetky event listenery v initEventListeners()
- [ ] Lazy chart initialization v navigateTo()
- [ ] Mock dáta minimálne: 20 klientov, 30 produktov, 50 faktúr
- [ ] IČO a IBAN validácie s checksumom
- [ ] CSV export s UTF-8 BOM
- [ ] PDF export s jsPDF
- [ ] Toast notifications system
- [ ] Dark mode toggle

### CSS:
- [ ] CSS variables pre colors
- [ ] Dark mode CSS (.dark-mode class)
- [ ] Responsive breakpoints (768px, 1024px)
- [ ] Status badge colors
- [ ] Modal styles
- [ ] Toast notification animations
- [ ] Chart container sizing
- [ ] Print styles pre faktúry

### Testovanie:
- [ ] Aplikácia sa načíta bez JS chýb
- [ ] Všetky stránky navigácia funguje
- [ ] CRUD operácie pre všetky entity
- [ ] Export CSV funguje a otvára sa v Excel
- [ ] Import CSV parsuje správne slovenské znaky
- [ ] PDF generovanie funguje
- [ ] Grafy sa zobrazujú správne
- [ ] Validácie IČO/IBAN odmietajú neplatné hodnoty
- [ ] Dark mode prepína farby
- [ ] IndexedDB sa inicializuje
- [ ] localStorage fallback funguje
- [ ] Bulk delete funguje
- [ ] Search real-time filtering funguje
- [ ] Keyboard shortcuts fungujú
- [ ] Live invoice calculator prepočítava správne

---

## 🚀 SPUSTENIE

Aplikácia musí byť spustiteľná cez HTTP server (nie file://):
```bash
python3 -m http.server 8000
# Otvor: http://localhost:8000
```

Alebo:
```bash
npx http-server -p 8000
```

---

## 📝 POZNÁMKY

1. **Nevytváraj backend** - čisto client-side aplikácia
2. **Nepoužívaj frameworky** - vanilla JS only
3. **Mock dáta musia byť realistické** - validné IČO, IBAN, datumy
4. **Slovenčina** - všetky texty v SK, formáty dátumov DD.MM.YYYY
5. **Performance** - event delegation, lazy loading, debouncing
6. **Accessibility** - aria labels, keyboard navigation
7. **Error handling** - try-catch, global error handlers
8. **Code organization** - komentáre v slovenčine, logické sekcie
9. **Git-friendly** - rozumné commit messages po každom feature

---

## 🎯 FINÁLNY VÝSTUP

Po dokončení by mal mať používateľ:
```
project/
├── index.html          (2,900+ lines)
├── script.js           (3,800+ lines)
├── style.css           (1,400+ lines)
└── README.md           (dokumentácia)
```

**Celkom: ~6,700+ riadkov kódu**
**Funkcionalita: 99%+**
**Production ready: ✅**

---

## 📞 SUPPORT DOKUMENTY

Vytvor aj tieto súbory:
- `NAVOD_NA_SPUSTENIE.md` - návod na spustenie
- `KOMPLETNA_DOKUMENTACIA.md` - technická dokumentácia všetkých funkcií
- `KONTROLA_A_OPRAVY.md` - checklist pre testovanie

---

**Tento prompt vytvorí plne funkčný faktúračný systém identický s mojou implementáciou.**

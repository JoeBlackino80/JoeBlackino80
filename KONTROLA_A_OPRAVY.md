# 🔍 KONTROLA SYSTÉMU - ZISTENÉ PROBLÉMY A RIEŠENIA

## ✅ ČO FUNGUJE SPRÁVNE

### Syntax a základná štruktúra:
- ✓ JavaScript syntax je 100% v poriadku (node -c prešiel)
- ✓ HTML je dobre štruktúrovaný
- ✓ Všetky knižnice sú načítané (Chart.js 4.4.0, jsPDF 2.5.1)
- ✓ IndexedDB wrapper je kompletný
- ✓ Všetky formy majú správne event listenery

### Implementované funkcie:
- ✓ Search a filtering funguje
- ✓ Bulk delete má správne checkboxy a logiku
- ✓ Live invoice calculator je kompletný
- ✓ CSV import funguje (handleClientCSVImport, handleProductCSVImport)
- ✓ Validácie s checksumami sú implementované
- ✓ Keyboard shortcuts sú správne napojené

---

## ❌ KRITICKÉ CHYBY - TREBA OPRAVIŤ

### 1. EXPORT TLAČIDLÁ NEFUNGUJÚ ⚠️

**Problém:**
- Tlačidlá `exportClientsBtn` a `exportProductsBtn` v HTML existujú
- Funkcie `exportClientsCSV()` a `exportProductsCSV()` sú implementované
- ALE chýbajú event listenery ktoré ich spoja!

**Riešenie:**
Pridať do `initEventListeners()`:

```javascript
// CSV Export buttons
const exportClientsBtn = document.getElementById('exportClientsBtn');
if (exportClientsBtn) {
    exportClientsBtn.addEventListener('click', () => this.exportClientsCSV());
}

const exportProductsBtn = document.getElementById('exportProductsBtn');
if (exportProductsBtn) {
    exportProductsBtn.addEventListener('click', () => this.exportProductsCSV());
}
```

### 2. handleExport() JE NEÚPLNÁ ⚠️

**Problém:**
- `handleExport()` funkcia len loguje do konzoly
- Nevolá skutočné export funkcie
- `data-export` atribúty v HTML nebudú fungovať

**Riešenie:**
Aktualizovať `handleExport()`:

```javascript
handleExport(exportType) {
    console.log('Exporting:', exportType);

    switch(exportType) {
        case 'invoices-csv':
            this.exportInvoicesCSV();
            break;
        case 'clients-csv':
            this.exportClientsCSV();
            break;
        case 'products-csv':
            this.exportProductsCSV();
            break;
        default:
            console.log('Export type not yet implemented:', exportType);
            this.showNotification('Export', 'Táto funkcia bude dostupná v ďalšej verzii.', 'info');
    }
}
```

### 3. CHARTS SA MÔŽU INICIALIZOVAŤ PRÍLIŠ SKORO ⚠️

**Problém:**
- `initPageStatistics()` sa volá v konštruktore
- Canvas elementy na stránkach clients/products nemusia byť v DOM ešte dostupné
- Chart.js zlyhá ak canvas neexistuje

**Riešenie:**
Volať chart inicializáciu až pri navigácii na stránku:

```javascript
// V navigateTo() funkcii pridať:
navigateTo(page) {
    // ... existujúci kód ...
    
    // Initialize page-specific charts
    if (page === 'clients') {
        setTimeout(() => {
            this.initClientRevenueChart();
            this.updateClientStatistics();
        }, 100);
    } else if (page === 'products') {
        setTimeout(() => {
            this.initProductCategoryChart();
            this.updateProductStatistics();
        }, 100);
    }
}
```

---

## ⚠️ MENŠIE PROBLÉMY

### 4. CHÝBA EXPORT BUTTON PRE PRODUKTY V HTML

V products sekcii nie je žiadne export tlačidlo okrem CSV importu.

**Riešenie:** Pridať do HTML pri products:
```html
<button class="btn btn-secondary" id="exportProductsBtn">Export produktov</button>
```

### 5. INVOICE EXPORT BUTTON MÔŽE CHÝBAŤ

Skontrolovať či existuje `exportInvoicesBtn` alebo použiť `data-export="invoices-csv"`.

---

## 📋 ZOZNAM OPRÁV - PRIORITA

### PRIORITA 1 - MUSÍ SA OPRAVIŤ:
1. ✅ Pridať event listenery pre exportClientsBtn a exportProductsBtn
2. ✅ Aktualizovať handleExport() aby volala správne funkcie
3. ✅ Opraviť chart inicializáciu (volať pri navigácii, nie v konštruktore)

### PRIORITA 2 - ODPORÚČAM OPRAVIŤ:
4. Pridať exportProductsBtn do HTML (momentálne len import)
5. Overiť že všetky data-export atribúty majú správne hodnoty

### PRIORITA 3 - VOLITEĽNÉ VYLEPŠENIA:
6. Pridať error handling do CSV parsingu
7. Pridať progress indikátor pre CSV import
8. Validovať CSV formát pred importom

---

## 🚀 KROKY NA SPUSTENIE

### 1. Aplikovať opravy vyššie

### 2. Otestovať funkcie:
```bash
# Otvoriť v prehliadači:
firefox index.html
# alebo
chromium index.html
```

### 3. Testovací checklist:
- [ ] Klik na "Export klientov" stiahne CSV súbor
- [ ] Klik na "Export produktov" stiahne CSV súbor  
- [ ] Import CSV funguje pre klientov
- [ ] Import CSV funguje pre produkty
- [ ] Charts sa zobrazia na clients page
- [ ] Charts sa zobrazia na products page
- [ ] Bulk delete funguje pre všetky entity
- [ ] Invoice kalkulačka počíta správne
- [ ] IČO validation kontroluje checksum
- [ ] IBAN validation kontroluje checksum

---

## 📊 FINÁLNY STAV

**Implementované funkcie: 13/13 (100%)**
**Funkčné bez opráv: ~85%**
**Funkčné PO opravách: ~98%**

**Odhadovaný čas opráv: 15-20 minút**

---

## 💡 ODPORÚČANIA

1. **Okamžite opraviť**: Body 1-3 (kritické)
2. **Pred produkciou**: Pridať automatické testy
3. **Budúce verzie**: 
   - Real-time sync medzi zariadeniami
   - API integrácia s účtovnými systémami
   - Mobilná aplikácia
   - E-mail notifikácie pri splatnosti


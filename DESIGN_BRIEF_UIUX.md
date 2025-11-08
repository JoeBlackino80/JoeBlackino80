# 🎨 DESIGN BRIEF - SLOVENSKÝ FAKTÚRAČNÝ SYSTÉM PRE SZČO

## 📋 INFORMÁCIE O PROJEKTE

**Názov projektu:** Fakturačný systém - SZČO Dashboard
**Typ:** Webová aplikácia (Single Page Application)
**Jazyk:** Slovenčina (primárne), s možnosťou prepnutia na češtinu/angličtinu
**Platforma:** Desktop-first, ale musí byť plne responzívna (desktop, tablet, mobil)
**Odvetvie:** Fintech / Business Software
**Cieľová skupina:** Slovenskí živnostníci (SZČO), malé firmy (do 10 zamestnancov), freelanceri

---

## 🎯 CIEĽ DIZAJNU

Vytvoriť **moderný, profesionálny a intuitívny** dizajn pre fakturačný systém, ktorý bude:

✅ **Prehľadný** - Používateľ nájde čo potrebuje do 3 kliknutí
✅ **Dôveryhodný** - Vizuálne komunikuje serióznosť a bezpečnosť (ide o peniaze!)
✅ **Slovenský** - Prispôsobený slovenskému trhu (slovenské dáta, formáty, jazyk)
✅ **Moderný** - Aktuálne trendy v UI dizajne 2024/2025
✅ **Efektívny** - Rýchla orientácia, minimálne klikanie, jasné vizuálne hierarchy

---

## 👥 CIEĽOVÁ SKUPINA - PERSÓNY

### Persóna 1: **Martin (35 rokov) - IT freelancer**
- Technicky zdatný
- Chce rýchlosť a efektivitu
- Uprednostňuje tmavý režim
- Používa keyboard shortcuts
- Pracuje na 2-3 monitoroch
- Očakáva moderný dizajn podobný Slack/Notion

### Persóna 2: **Jana (42 rokov) - Účtovníčka malej firmy**
- Stredná digitálna gramotnosť
- Potrebuje jasné a prehľadné rozloženie
- Čítateľné veľké písmo
- Logické zoradenie funkcií
- Obáva sa zložitých rozhraní
- Preferuje svetlý režim

### Persóna 3: **Peter (28 rokov) - Grafický dizajnér**
- Vysoké nároky na vizuál
- Očakáva pekný dizajn
- Detailista
- Chce možnosť personalizácie
- Používa mobilnú aplikáciu často

---

## 🎨 VIZUÁLNY ŠTÝL A FEEL

### Celkový dojem:
**Profesionálny | Moderný | Čistý | Dôveryhodný | Efektívny**

### Inšpirácia (podobné aplikácie):
- **Stripe Dashboard** - čistota, prehľadnosť grafov, moderná typografia
- **Linear** - minimalizmus, plynulé animácie, dobrá farebnosť
- **Notion** - jednoduchosť, hierachia, svetlý/tmavý režim
- **Revolut Business** - fintech feel, dôveryhodnosť, grafy
- **Figma** - moderné UI komponenty, responzivita

### Čo SA NEMÁ podobať:
❌ Zastaraným účtovným programom (Money S3, Pohoda - staršie verzie)
❌ Preplneným dashboardom s 50 grafmi naraz
❌ Výrazným farbám ako gaming aplikácie
❌ Príliš "hravému" dizajnu (nie je to sociálna sieť)

---

## 🎨 FAREBNÁ PALETA

### Primárna farba:
**Modrá** - dôveryhodnosť, profesionalita, fintech

**Odporúčané odtiene:**
- **Svetlý režim:** `#3498db` (jasná modrá) alebo `#2563eb` (moderná modrá)
- **Tmavý režim:** `#60a5fa` (jemnejšia modrá pre tmavé pozadie)

Alternatívy ak chcete odlíšiť sa:
- Tmavomodrá/navy: `#1e3a8a` - serióznejšia
- Zelená: `#10b981` - rast, peniaze (ale môže pôsobiť ako ekológia)

### Sekundárne farby (stavy, akcie):
- **Úspech (zaplatené, aktívne):** Zelená `#10b981` alebo `#22c55e`
- **Upozornenie (po splatnosti, čakajúce):** Oranžová `#f59e0b` alebo jantárová `#f97316`
- **Chyba (zrušené, zamietnuté):** Červená `#ef4444` alebo `#dc2626`
- **Info (koncepty, neutrálne):** Modrá (primárna) alebo šedá

### Neutrálne farby:

**Svetlý režim:**
- Pozadie hlavné: `#ffffff` (čistá biela)
- Pozadie sekundárne: `#f8f9fa` alebo `#f3f4f6` (jemná šedá)
- Text primárny: `#1f2937` (takmer čierna)
- Text sekundárny: `#6b7280` (strednešedá)
- Borders: `#e5e7eb` (svetlošedá)

**Tmavý režim:**
- Pozadie hlavné: `#0f172a` alebo `#1e293b` (tmavo modrá/šedá)
- Pozadie sekundárne: `#1e293b` (o odtieň svetlejšia)
- Text primárny: `#f1f5f9` (takmer biela)
- Text sekundárny: `#94a3b8` (svetlošedá)
- Borders: `#334155` (tmavá)

### Gradienty (voliteľne):
Pre vizuálne vylepšenie môžete použiť jemné gradienty:
- Modrá → Fialová (moderný tech feel)
- Modrá → Azúrová (clean corporate feel)
**Len jemne! Nie výrazné pestré gradienty.**

---

## ✍️ TYPOGRAFIA

### Primárne písmo (UI text):
**Inter** alebo **Poppins** alebo **DM Sans**

Prečo:
- Moderné, čisté, čitelné
- Výborná čitateľnosť v malých veľkostiach
- Dobre funguje v tabuľkách s číslami
- Web safe, open-source

### Sekundárne písmo (nadpisy - voliteľné):
Môžete použiť rovnaké ako primárne (jednoduchosť) alebo:
**Montserrat** / **Outfit** pre nadpisy (modernejší feel)

### Veľkosti textu:

**Desktop:**
- Nadpis H1: 32px, Bold (600-700)
- Nadpis H2: 24px, Semi-bold (600)
- Nadpis H3: 20px, Semi-bold (600)
- Nadpis H4: 18px, Medium (500)
- Body text: 16px, Regular (400)
- Malý text (popisky): 14px, Regular (400)
- Extra malý (metadata): 12px, Regular (400)

**Tablet/Mobile:**
- Všetky o 1-2px menšie
- H1: 28px
- Body: 15px

### Číselné údaje (sumy, faktúry):
Použite **monospace font** alebo **tabular numbers**:
- `font-variant-numeric: tabular-nums;` (v CSS)
- Vďaka tomu sa čísla zarovnávajú pekne v stĺpcoch

---

## 📐 LAYOUT A ŠTRUKTÚRA

### Celková štruktúra aplikácie:

```
┌─────────────────────────────────────────────────────────────┐
│  HORNÁ NAVIGÁCIA (navbar)                                   │
│  [Logo] [Názov firmy ▼] [...menu položky...] [🌙] [👤]     │
└─────────────────────────────────────────────────────────────┘
│                                                               │
│  OBSAH STRÁNKY (dynamicky sa mení)                          │
│  - Dashboard / Faktúry / Klienti / atď.                     │
│                                                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### NAVBAR (Horná navigácia):

**Rozmery:**
- Výška: 64px (desktop), 56px (mobile)
- Pozícia: Fixed top (zostáva pri scrollovaní)

**Obsah zľava doprava:**
1. **Logo + názov aplikácie** (vľavo)
   - Logo: max 40px × 40px
   - Názov: "Fakturačný Systém" alebo custom názov

2. **Dropdown výber firmy** (ak má user viac firiem)
   - "Moja SZČO ▼"
   - Vizuálne výrazné, ľahko klikateľné

3. **Menu položky** (horizontálne):
   - Dashboard | Faktúry | Klienti | Produkty | Projekty | DPH | Banka | Kalkulátor | Reporty | Nastavenia
   - Aktívna položka: **modrá farba + hrubší bottom border (3px)**
   - Hover efekt: jemná zmena farby alebo podčiarknutie

4. **Pravá časť** (vpravo):
   - **Tlačidlo Dark Mode:** 🌙 / ☀️ (prepínač)
   - **User menu:** Avatar + meno ▼ (dropdown: Profil, Odhlásiť sa)

**Štýl:**
- Pozadie: Biele (svetlý režim) / Tmavé (tmavý režim)
- Jemný tieň pod navbar (subtle shadow)
- Border-bottom: 1px solid (jemná hranica)

---

## 📄 JEDNOTLIVÉ STRÁNKY - DETAILNÝ POPIS

### 1️⃣ DASHBOARD (Hlavná stránka)

**Účel:** Prehľad celkového stavu podnikania na prvý pohľad

**Layout:**

**Sekcia A: Štatistiky (4 karty vedľa seba)**

Rozmiestnenie: Grid 4 stĺpce (desktop), 2 stĺpce (tablet), 1 stĺpec (mobile)

Každá karta obsahuje:
- **Ikona** (vľavo hore alebo celá ako background v nízkej opacity)
- **Nadpis** (napr. "Celkový obrat 2025")
- **Hlavné číslo** (veľké, bold, napr. "€45,230")
- **Podtext** (menší, zmena oproti minulému obdobiu, napr. "+12.5% oproti minulému roku" - zelená ak nárast, červená ak pokles)

**4 karty:**
1. **Celkový obrat** (modrá ikona 💰)
2. **Vystavené faktúry** (oranžová ikona 📄)
3. **Po splatnosti** (červená ikona ⚠️)
4. **Klienti** (zelená ikona 👥)

**Dizajn kariet:**
- Pozadie: Biele (svetlé) / Tmavé (dark mode)
- Border-radius: 12px (zaoblené rohy)
- Padding: 24px
- Jemný tieň: `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- Hover efekt: Mierne zvýraznenie (napr. tieň sa zintenzívni)

---

**Sekcia B: Grafy (2×2 grid)**

4 grafy rozložené v mriežke:

**Graf 1: Obrat v čase** (Line chart)
- Os X: Mesiace (Jan, Feb, Mar...)
- Os Y: Sumy v eurách
- Vizualizácia trendu príjmov

**Graf 2: Príjmy vs Výdavky** (Bar chart)
- Porovnanie mesačných príjmov a výdavkov
- Zelené stĺpce (príjmy), červené (výdavky)

**Graf 3: TOP 5 klientov** (Horizontal bar chart)
- Ktorí klienti priniesli najviac peňazí
- Zoradené od najväčšieho

**Graf 4: Kategórie nákladov** (Doughnut/Pie chart)
- Rozdelenie výdavkov podľa kategórií
- Farebne odlíšené segmenty

**Dizajn grafov:**
- Použite knižnicu Chart.js alebo podobnú
- Moderné, clean grafy (nie 3D efekty!)
- Farby zodpovedajúce celkovej palete
- Tooltips pri hover
- Responsive (na mobile môžu byť pod sebou)

**Rozloženie grafov:**
- Desktop: 2×2 grid
- Tablet: 2×2 alebo 1×4
- Mobile: 1×4 (pod sebou)

---

**Sekcia C: Nedávne faktúry (Tabuľka)**

Prehľad 5 posledných faktúr

**Stĺpce tabuľky:**
- Číslo faktúry (napr. "2025-0042")
- Klient (napr. "ACME s.r.o.")
- Dátum vystavenia
- Suma (€1,250.00)
- Status (badge - farebný štítok)

**Status badges:**
- **Zaplatené:** Zelený badge, text "Zaplatené"
- **Vystavené:** Oranžový badge, "Vystavené"
- **Po splatnosti:** Červený badge, "Po splatnosti"
- **Koncept:** Šedý badge, "Koncept"

**Dizajn tabuľky:**
- Header: Semi-bold, sivý text, jemné pozadie
- Riadky: Striedavo farby (zebra striping - jemne) alebo čisté biele s border
- Hover na riadok: Jemné zvýraznenie pozadia
- Zarovnanie: Čísla a sumy vpravo, text vľavo
- Padding v bunkách: 12-16px vertikálne

**Tlačidlo na konci:**
"Zobraziť všetky faktúry →" (link na stránku Faktúry)

---

**Sekcia D: Nedávne aktivity (Timeline)**

Log posledných 10 akcií:
- "Faktúra 2025-0042 bola zaplatená" (6 minút dozadu)
- "Nový klient: Tech Solutions s.r.o." (2 hodiny dozadu)
- "Export DPH výkazu za Q4" (včera)

**Dizajn:**
- Vertikálny timeline s ikonami
- Ikona vľavo (✓, +, 📥, atď.)
- Text akcie
- Timestamp (relatívny čas: "pred 5 minútami")

---

### 2️⃣ FAKTÚRY (Hlavná stránka pre faktúry)

**Layout:**

**Horná sekcia (toolbar):**

Rozloženie: Flexbox, položky horizontálne

**Vľavo:**
- **Tlačidlo:** "+ Nová faktúra" (primárna modrá farba, výrazné)
- **Tlačidlo:** "📥 Import CSV" (sekundárne)
- **Dropdown:** "📤 Export ▼" (možnosti: CSV, PDF, Backup)

**Stred:**
- **Search bar:** Textové pole "🔍 Hľadať faktúru..." (šírka min. 300px)

**Vpravo:**
- **Dropdown filter:** "Stav: Všetky ▼" (možnosti: Všetky, Zaplatené, Vystavené, Po splatnosti, Koncepty)
- **Dropdown filter:** "Rok: 2025 ▼"

---

**Hlavná tabuľka:**

**Stĺpce:**
1. **Checkbox** (☐) - pre bulk selection
2. **Číslo faktúry** (2025-0042)
3. **Klient** (ACME s.r.o.)
4. **Dátum vystavenia** (01.11.2025)
5. **Dátum splatnosti** (15.11.2025)
6. **Suma** (€1,250.00)
7. **Status** (badge - farebný)
8. **Akcie** (ikony: 👁 Náhľad | ✏️ Upraviť | 📄 PDF | ✉️ Email | 🗑 Zmazať)

**Dizajn:**
- Header sticky (zostáva pri scrolle)
- Sortovanie kliknutím na header (▲▼ ikony)
- Hover na riadok: Jemné zvýraznenie
- Akcie sa zobrazia až pri hover (aby nebola tabuľka preplnená)

**Bulk akcie:**
Ak je niečo vybraté (checkboxy), zobrazí sa nad tabuľkou:
- "Vybraných: 3"
- Tlačidlá: [Zmazať vybrané] [Export vybraných] [Označiť ako zaplatené]

**Pagination (stránkovanie):**
- Na spodku: "← Predošlá | 1 2 3 ... 10 | Ďalšia →"
- Alebo infinite scroll

---

### 3️⃣ KLIENTI

**Layout podobný ako Faktúry, ale:**

**Horná sekcia:**
- Štatistiky (4 menšie karty):
  - Celkový počet klientov
  - Celkový obrat od všetkých
  - Priemerný obrat na klienta
  - TOP klient

**Graf:**
- Bar chart: Obrat podľa TOP 10 klientov

**Toolbar:**
- "+ Nový klient"
- "📥 Import CSV"
- "📤 Export CSV"
- Search: "🔍 Hľadať klienta..."

**Tabuľka:**
Stĺpce:
- ☐ | Názov | IČO | Email | Počet faktúr | Celkový obrat | Akcie

**Akcie na riadku:**
- 👁 Detail (otvorí detail klienta)
- ✏️ Upraviť
- 📧 Email
- 🗑 Zmazať

---

**DETAIL KLIENTA (nová stránka/modal):**

Po kliknutí na klienta sa otvorí detail:

**Sekcia 1: Hlavička**
- Názov klienta (veľký, H1)
- Ikona firmy (placeholder ak nemá logo)

**Sekcia 2: Tabs (záložky)**

**Tab 1: Základné údaje**
- Karta s údajmi:
  - Názov, IČO, DIČ, IČ DPH
  - Adresa, Email, Telefón, IBAN
- Vizuálne: Label (sivý, malý) + Value (čierny, väčší)

**Tab 2: Faktúry**
- Tabuľka všetkých faktúr pre tohto klienta
- Filtrovateľné, sortovaťteľné

**Tab 3: Štatistiky**
- Štatistiky o klientovi:
  - Celkový obrat
  - Počet faktúr
  - Priemerná suma faktúry
  - Dátum poslednej faktúry
- Graf: Obrat v čase pre tohto klienta

**Tlačidlá v hornej časti:**
- "✏️ Upraviť"
- "+ Nová faktúra pre tohto klienta"
- "🗑 Zmazať klienta"

---

### 4️⃣ PRODUKTY / SLUŽBY

Layout podobný ako Klienti:

**Štatistiky + Graf:**
- Počet produktov
- Najpredávanejší produkt
- Kategórie produktov (Pie chart)

**Tabuľka:**
Stĺpce:
- ☐ | Názov | Cena | DPH | Jednotka | Kategória | Sklad | Akcie

**Filters:**
- Kategória: Všetky / Služby / Tovar
- Search

---

### 5️⃣ PROJEKTY

**Tabuľka:**
Stĺpce:
- ☐ | Názov projektu | Klient | Rozpočet | Odpracované hodiny / Odhadované | Deadline | Status | Akcie

**Status badges:**
- **Aktívny:** Modrý
- **Dokončený:** Zelený
- **Pozastavený:** Oranžový

**Vizuálny prvok:**
- Progress bar pre každý projekt (odpracované / celkom hodín)

---

### 6️⃣ DPH (Výpočet DPH)

**Layout:**

**Horná sekcia: Formular**
- Dva date pickery: "Od" - "Do"
- Tlačidlo: "Vypočítať DPH"

**Výsledková karta (po vypočítaní):**

Veľká karta s rozdelením:
- **DPH na výstupe** (z vašich faktúr): €8,460 (zelená)
- **DPH na vstupe** (z vašich nákladov): €2,340 (červená)
- **DPH na úhradu:** €6,120 (modrá, bold, veľké)

**Tlačidlo:**
"📄 Export výkazu DPH (PDF)"

**Pod kartou:**
- Tabuľka rozkladu (voliteľné): Detailný rozpis všetkých faktúr zahrnutých do výpočtu

---

### 7️⃣ BANKA (Párovanie platieb)

**Toolbar:**
- "📥 Import bankového výpisu (CSV)"

**Tabuľka transakcií:**

Stĺpce:
- Dátum | Suma | Variabilný symbol | Párovanie | Faktúra | Akcia

**Funkcia:**
- Automaticky spárované transakcie: Zelený check ✓
- Nespárované: Červený krížik ✗ + dropdown "Priradiť k faktúre ▼"
- Po spárovaní: Faktúra sa označí ako zaplatená

**Vizuálny hint:**
- Zelené riadky = spárované
- Žlté = čakajúce na párovanie

---

### 8️⃣ KALKULÁTOR DANE

**Layout: Formulár v centrálnej karte**

**Sekcia 1: Vstupy**
- **Príjem za rok:** [Input pole] €
- **Výdavky:**
  - ( ) Paušál 60%
  - ( ) Skutočné výdavky: [Input pole] €

**Sekcia 2: Výsledky (automatický prepočet)**

Karta s výsledkami:
- **Základ dane:** €XX,XXX
- **Daň z príjmu (19%):** €X,XXX (červená)
- **Zdravotné poistenie:** €X,XXX (červená)
- **Sociálne poistenie:** €X,XXX (červená)
- **Celkové odvody:** €XX,XXX (veľké, červené)
- **Čistý zisk:** €XX,XXX (veľké, zelené)

**Vizualizácia:**
- Pie chart: Rozdelenie kde idú peniaze (daň, zdravotné, sociálne, čistý zisk)

---

### 9️⃣ REPORTY

**Layout:**

**Filters:**
- Obdobie: [Rok 2025 ▼] alebo custom range
- Typ reportu: [Finančný prehľad ▼]

**Zobrazenie:**

**Karta 1: Finančný prehľad**
- Celkový príjem: €XXX,XXX
- Celkové výdavky: €XX,XXX
- Zisk: €XX,XXX
- Marža: XX%

**Graf 1:** Line chart - Príjmy a výdavky v čase
**Graf 2:** Bar chart - Mesačné porovnanie
**Graf 3:** Pie chart - Rozdelenie výdavkov podľa kategórií

**Export:**
- "📄 Exportovať report (PDF)"

---

### 🔟 NASTAVENIA

**Layout: Sidebar + Content**

**Sidebar (vľavo):**
Menu položky:
- Profil firmy
- Nastavenia aplikácie
- Používatelia (ak viacero)
- Fakturačné údaje
- Platobné metódy
- Notifikácie
- Zálohovanie
- API prístup

**Content (vpravo):**

**Sekcia: Profil firmy**
- Možnosť nahrať logo (drag & drop area)
- Formulár: Názov, IČO, DIČ, IČ DPH, Adresa, IBAN...
- Tlačidlo "Uložiť zmeny"

**Sekcia: Nastavenia aplikácie**
- **Jazyk:** [Slovenčina ▼]
- **Tmavý režim:** [Prepínač ON/OFF]
- **Formát dátumu:** [DD.MM.YYYY ▼]
- **Mena:** [EUR (€) ▼]

**Sekcia: Zálohovanie**
- Tlačidlo: "📥 Exportovať všetky dáta (JSON)"
- Tlačidlo: "📤 Importovať dáta (JSON)"
- Tlačidlo (červené): "🗑 Vymazať všetky dáta" (s potvrdením!)

---

## 🎭 MODÁLY (Pop-up okná)

### MODAL: Nová faktúra

**Dizajn:**
- Šírka: 800px (desktop), 100% (mobile)
- Pozadie: Semi-transparent dark overlay (rgba(0,0,0,0.5))
- Karta: Biela, zaoblené rohy (16px), tieň

**Štruktúra:**

**Header:**
- Nadpis: "Nová faktúra" (vľavo)
- Ikona × (vpravo) - zavrieť

**Body (scrollovateľný):**

**Sekcia 1: Základné údaje**
- Číslo faktúry: [Auto-generované, šedé, read-only]
- Klient: [Dropdown - vyhľadávač klientov]
- Dátum vystavenia: [Date picker]
- Dátum splatnosti: [Date picker] (auto = +14 dní)
- Spôsob platby: [Dropdown: Bankový prevod / Hotovosť / Karta]

**Sekcia 2: Položky faktúry**

Tabuľka položiek:
- Produkt/služba | Množstvo | Jednotka | Cena | DPH | Suma
- Každý riadok editovateľný
- Tlačidlo "+ Pridať položku"

**Live kalkulačka (vpravo alebo dole):**
Karta s výpočtom:
- Medzisúčet: €1,000.00
- DPH 20%: €200.00
- **CELKOM: €1,200.00** (veľké, bold)

**Sekcia 3: Poznámka**
- Textarea: "Poznámka k faktúre" (voliteľné)

**Footer (sticky):**
- [Zrušiť] [Uložiť koncept] [Vystaviť faktúru] - tlačidlá

---

### MODAL: Platba faktúry (NOVÝ - s platobnou bránou)

**Header:**
"💳 Zaplatiť faktúru"

**Body:**

**Sekcia 1: Prehľad faktúry**
- Číslo faktúry: **2025-0042**
- Klient: ACME s.r.o.
- Suma k úhrade: **€1,200.00** (veľké, zelené)

**Sekcia 2: Platobné metódy (tabs alebo buttony)**

3 možnosti vedľa seba:
- [💳 Karta] (vybrané - modré)
- [🏦 SEPA prevod]
- [₿ Crypto]

**Ak je vybraté "Karta":**
- Stripe Elements (iframe) - formulár na kartu
- Bezpečnostná ikona: 🔒 "Zabezpečené 256-bit SSL šifrovaním"
- Podporované karty: [Visa] [Mastercard] [Apple Pay] [Google Pay] - ikonky

**Tlačidlo (veľké):**
"🔒 Zaplatiť €1,200.00" (zelené, výrazné)

**Pod tlačidlom:**
Malý text (sivý): "Platba je spracovaná cez Stripe. Vaše údaje sú v bezpečí."

---

## 📱 RESPONZIVITA (Mobile / Tablet)

### Desktop (1920px+):
- 2-3 stĺpcový layout
- Bočné panely
- Všetky grafy vedľa seba

### Tablet (768px - 1024px):
- Navbar zrúti sa do hamburgeru (☰)
- Grafy 2×2 alebo 1×4
- Tabuľky scrollovateľné horizontálne

### Mobile (< 768px):
- Všetko pod sebou (1 stĺpec)
- Burger menu
- Tlačidlá full-width
- Tabuľky: Zmeniť na karty (card layout namiesto table)
  - Každý riadok tabuľky = jedna karta
- Sticky tlačidlá na spodku (napr. "+ Nová faktúra" fixed bottom)

---

## 🎬 ANIMÁCIE A INTERAKCIE

### Micro-interakcie:
- **Hover na tlačidlo:** Jemné svetlejšie / tmavšie
- **Hover na kartu:** Mierne zvýšenie tieňa (elevation)
- **Kliknutie:** Ripple efekt (ako Material Design)
- **Loading:** Skeleton screens (šedé placeholdery namiesto spinnerov)
- **Transitions:** Všetky prechody 200-300ms (smooth, nie instant)

### Page transitions:
- Fade in pri načítaní stránky (opacity 0 → 1, 300ms)
- Modály: Scale + fade (z 0.9 → 1.0 scale)

### Toasty (notifikácie):
- Slide in sprava hore (pravý horný roh)
- Auto-hide po 5 sekundách
- 3 typy:
  - ✅ Success (zelená)
  - ⚠️ Warning (oranžová)
  - ❌ Error (červená)

### Loading states:
- Skeleton screens pre tabuľky (šedé animované boxy)
- Progress bar pri nahrávaní súborov
- Spinner len pri crítickom loadingu (login, atď.)

---

## 🧩 UI KOMPONENTY - DETAIL

### Tlačidlá (Buttons):

**Primárne (hlavná akcia):**
- Pozadie: Modrá (primárna farba)
- Text: Biely
- Border-radius: 8px
- Padding: 12px 24px
- Hover: O odtieň tmavšia
- Shadow: Jemný

**Sekundárne:**
- Pozadie: Transparentné alebo svetlošedé
- Text: Modrá (primárna farba)
- Border: 1px solid modrá
- Hover: Svetlé modré pozadie

**Destruktívne (zmazať, zrušiť):**
- Pozadie: Červená
- Text: Biely
- Hover: Tmavšie červená

**Veľkosti:**
- Small: 10px 16px, font 14px
- Medium (default): 12px 24px, font 16px
- Large: 16px 32px, font 18px

---

### Input fieldy (Text inputs):

**Dizajn:**
- Border: 1px solid šedá
- Border-radius: 8px
- Padding: 12px 16px
- Font-size: 16px
- Focus state: Modrý border (2px), jemný modrý tieň (glow)

**States:**
- Default: Šedý border
- Focus: Modrý border
- Error: Červený border + červená chybová hláška pod
- Disabled: Sivé pozadie, text sivý

**Label:**
- Nad inputom
- Font-size: 14px, font-weight: 500
- Farba: Sivá

**Placeholder:**
- Svetlošedá, kurzíva (voliteľne)

---

### Dropdowny (Select):

**Dizajn podobný ako input, ale:**
- Ikona ▼ vpravo
- Kliknutie otvorí menu pod
- Menu: Biela karta, tieň, scrollovateľné
- Hover na položke: Svetlomodré pozadie
- Vybraná položka: Check ✓ vpravo

**Search v dropdowne (pre klienty, produkty):**
- Input pole na vrchu menu
- Live filter pri písaní

---

### Checkboxy:

**Dizajn:**
- 20px × 20px
- Border: 2px solid sivá
- Border-radius: 4px
- Checked: Modré pozadie, biely check ✓
- Hover: Svetlomodré pozadie

---

### Badges (Status labels):

**Dizajn:**
- Padding: 4px 12px
- Border-radius: 12px (pill shape)
- Font-size: 12px, font-weight: 600
- Text: Uppercase (voliteľne) alebo Capitalize

**Farby:**
- Zaplatené: Zelené pozadie (#d4edda), tmavo zelený text
- Vystavené: Oranžové pozadie (#fff3cd), tmavo oranžový text
- Po splatnosti: Červené pozadie (#f8d7da), tmavo červený text
- Koncept: Sivé pozadie (#e2e3e5), tmavo sivý text

---

### Karty (Cards):

**Dizajn:**
- Pozadie: Biele (svetlý) / Tmavé (dark mode)
- Border: 1px solid alebo bez (len tieň)
- Border-radius: 12px
- Padding: 24px (desktop), 16px (mobile)
- Shadow: `0 1px 3px rgba(0,0,0,0.1)` (jemný)
- Hover: Shadow zvýrazniť (elevation)

---

### Tabuľky (Tables):

**Dizajn:**
- Border: Nie okolo celej tabuľky, len horizontálne medzi riadkami
- Header:
  - Pozadie: Jemné sivé
  - Text: Semi-bold, sivý
  - Sticky (pri scrolle zostáva hore)
- Rows:
  - Padding: 12-16px vertikálne
  - Hover: Jemné sivé pozadie
  - Klikateľné riadky: Cursor pointer
- Borders: 1px solid svetlošedá (len medzi riadkami, nie vertikálne)

**Responzíva:**
- Mobile: Zmeniť tabuľku na karty (každý riadok = card)

---

### Grafy (Charts):

**Dizajn:**
- Použite Chart.js alebo podobnú knižnicu
- Farby: Z primárnej palety
- Gridlines: Jemné, nenápadné (sivé, tenké)
- Tooltips: Pri hover ukázať hodnoty
- Legends: Vpravo alebo dole od grafu
- Responsive: Grafy sa prispôsobia šírke

**Typy grafov:**
- Line chart: Trendy v čase
- Bar chart: Porovnanie hodnôt
- Doughnut/Pie chart: Proporcie
- Horizontal bar: Pre rebríčky (TOP klienti)

---

### Modály (Dialogs):

**Dizajn:**
- Overlay: rgba(0,0,0,0.5) (polopriehľadné tmavé pozadie)
- Karta: Biela, centrovená
- Border-radius: 16px
- Max-width: 600px (malý modal), 800px (stredný), 1200px (veľký)
- Shadow: Výraznejší (elevation)
- Header: Sticky, s tlačidlom × (zavrieť)
- Footer: Sticky (ak je dlhý obsah)

**Animácia:**
- Fade in overlay
- Scale + fade in karta (0.9 → 1.0)
- 300ms duration

---

## 🔍 IKONY

**Štýl ikón:**
- **Outline** (nie filled) - modernejšie, clean
- Veľkosť: 20px (default), 24px (väčšie tlačidlá)
- Stroke width: 2px
- Farba: Sivá (default), modrá (aktívne), farebné (podľa kontextu)

**Doporučená ikonová knižnica:**
- **Heroicons** (outline set) - od tvorcov Tailwind CSS
- Alebo **Lucide Icons** / **Feather Icons**

**Príklady použitia:**
- 📄 Faktúry
- 👥 Klienti
- 📦 Produkty
- 💰 Platby
- 📊 Reporty
- ⚙️ Nastavenia
- 🔍 Hľadať
- ✏️ Upraviť
- 🗑 Zmazať
- ✓ Zatvoriť/Potvrdiť
- × Zavrieť

---

## 📐 SPACING (Rozostupy)

Použite konzistentný spacing system (8px grid):

- **xs:** 4px (jemné rozostupy)
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **2xl:** 48px
- **3xl:** 64px

**Použitie:**
- Padding v kartách: 24px (lg)
- Margin medzi sekciami: 32px (xl)
- Gap medzi buttonmi: 8px (sm)
- Margin medzi tabuľkovými bunkami: 12-16px

---

## 🎯 PRIORITA STRÁNOK (Čo navrhnúť ako prvé)

Ak grafik nemôže navrhnúť všetko naraz, priorita:

### Fáza 1 (MUSÍ MAŤ):
1. **Dashboard** (najdôležitejšie)
2. **Faktúry** (hlavná funkcia)
3. **Modal: Nová faktúra** (kritické)
4. **Klienti**
5. **Navbar + základné komponenty** (tlačidlá, inputy, karty)

### Fáza 2:
6. Produkty
7. Detail klienta
8. DPH kalkulačka
9. Nastavenia

### Fáza 3:
10. Projekty
11. Banka
12. Reporty
13. Daňový kalkulačtor
14. Platobný modal (integrácia)

---

## 📦 DELIVERABLES (Čo od grafika očakávame)

### 1. **Figma súbor** (alebo Adobe XD / Sketch)

Obsahuje:
- Všetky stránky (minimálne fáza 1)
- Desktop + Mobile views
- Svetlý + Tmavý režim
- Interactive prototype (klikateľné linky medzi stránkami)

### 2. **Design System / Style Guide**

Dokument obsahujúci:
- Farebná paleta (hex kódy)
- Typografia (fonty, veľkosti, weights)
- Spacing system
- Komponenty (tlačidlá, inputy, karty, badges, atď.)
- Ikony
- Shadows, borders, border-radius

### 3. **Assets**

- Logo (SVG + PNG, rôzne veľkosti)
- Ikony (SVG)
- Mockup príklady (napr. screenshot dashboardu)

### 4. **Developer Handoff**

- Figma s Dev Mode (inspect mode)
- Export CSS variables (farby, spacing)
- Annotácie pre vývojára (ak potrebné)

---

## ✅ CHECKLIST PRE GRAFIKA

Pred odovzdaním skontrolujte:

**Dizajn:**
- [ ] Všetky stránky majú konzistentný štýl
- [ ] Svetlý + Tmavý režim navrhnutý
- [ ] Mobile + Desktop views
- [ ] Všetky stavy komponentov (default, hover, active, disabled, error)
- [ ] Čitateľnosť textu (kontrast podľa WCAG AA)
- [ ] Farebnosť je príjemná a profesionálna

**Technické:**
- [ ] Fonty sú web-safe alebo Google Fonts
- [ ] Všetky farby v hex/RGB formáte
- [ ] Spacing konzistentný (8px grid)
- [ ] Ikony v SVG formáte
- [ ] Exportovateľné assets

**UX:**
- [ ] Jasná vizuálna hierarchia (čo je hlavné, čo sekundárne)
- [ ] Tlačidlá dosť veľké na kliknutie (min 44px výška)
- [ ] Formuláre majú jasné labels a error states
- [ ] Loading states navrhnuté
- [ ] Empty states navrhnuté (prázdne tabuľky, žiadne dáta)

---

## 💡 DODATOČNÉ POZNÁMKY

### Prístupnosť (Accessibility):
- **Kontrast:** Text vs pozadie minimálne 4.5:1 (WCAG AA)
- **Focus states:** Jasné modrý border pri klávesovej navigácii
- **Labels:** Všetky inputy majú labels
- **Alt texty:** Všetky ikony majú popisný text (pre screen readers)

### Performance hints:
- **Optimalizované obrázky:** WebP formát
- **Lazy loading:** Obrázky a grafy sa načítajú len keď sú viditeľné
- **Skeleton screens:** Namiesto spinnerov

### Trendy dizajnu 2024/2025:
- **Glassmorphism:** Jemné (nie prehrané) - polopriehľadné karty s blur efektom
- **Subtle shadows:** Nie výrazné, ale jemné elevation
- **Zaoblené rohy:** 8-16px (nie ostré)
- **Clean minimalizmus:** Veľa whitespace
- **Micro-animácie:** Jemné, nenápadné

---

## 🎨 VIZUÁLNE PRÍKLADY / INŠPIRÁCIA

**Odporúčam grafikovi pozrieť:**

1. **Stripe Dashboard** - https://dashboard.stripe.com
   - Perfektný príklad fintech dizajnu
   - Čisté tabuľky, grafy, moderná typografia

2. **Linear** - https://linear.app
   - Minimalistický, rýchly, elegantný
   - Výborné použitie farieb a spacing

3. **Notion** - https://notion.so
   - Dobrá hierarchia, clean UI
   - Svetlý/tmavý režim well done

4. **Revolut Business** - https://business.revolut.com
   - Fintech feel, dôveryhodnosť
   - Pekné grafy a dashboard

5. **Dribbble hľadanie:** "Invoice dashboard" / "Finance dashboard"
   - https://dribbble.com/search/invoice-dashboard

---

## 📞 KONTAKT A FEEDBACK

**Po vytvorení prvej verzie:**
- Prezentujem dizajn stakeholderom
- Zbieranie feedbacku
- Iterácia dizajnu (1-2 koly revízií)
- Finálne schválenie

**Očakávaný timeline:**
- Fáza 1 (Dashboard, Faktúry, Komponenty): **1-2 týždne**
- Revízie: **3-5 dní**
- Fáza 2 (zvyšné stránky): **1 týždeň**
- Finálny handoff vývojárom: **2-3 dni**

**Celkom: 3-4 týždne** pre kompletný dizajn systém

---

## 🎯 ZÁVER

Tento brief by mal grafikovi poskytnúť **všetko potrebné** na vytvorenie moderného, profesionálneho a užívateľsky príjemného dizajnu fakturačného systému.

**Kľúčové body na zapamätanie:**
✅ Profesionálny, nie hravý dizajn
✅ Modrá farba = dôveryhodnosť
✅ Čistota a prehľadnosť
✅ Responzivita (desktop, tablet, mobile)
✅ Svetlý + Tmavý režim
✅ Konzistencia v celej aplikácii

Ak má grafik akékoľvek otázky, môže sa spýtať pre ďalšie detaily!

**Veľa úspechov pri tvorbe! 🚀**

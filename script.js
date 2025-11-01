// Invoice System Application
class InvoiceSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.mockClients = this.initMockClients();
        this.mockInvoices = this.initMockInvoices();

        this.initEventListeners();
        this.initValidation();
        this.initNavigation();
        console.log('Fakturačný systém inicializovaný');
        console.log('API Dokumentácia: faktury-api-spec.yaml');
        console.log('Offline režim: AKTÍVNY');
        console.log('Dáta uložené lokálne v SQLite databáze');
    }

    // Initialize mock data
    initMockClients() {
        return [
            { id: 1, name: 'ACME s.r.o.', ico: '12345678', dic: '1234567890', icdph: 'SK1234567890', email: 'info@acme.sk', address: 'Hlavná 123, 811 01 Bratislava', iban: 'SK3112000000198742637541', invoiceCount: 8, totalRevenue: 4200 },
            { id: 2, name: 'Tech Solutions s.r.o.', ico: '23456789', dic: '2345678901', icdph: 'SK2345678901', email: 'contact@techsol.sk', address: 'Nová 45, 821 05 Bratislava', iban: 'SK4212000000198742637542', invoiceCount: 5, totalRevenue: 8750 },
            { id: 3, name: 'Digital Marketing s.r.o.', ico: '34567890', dic: '3456789012', icdph: 'SK3456789012', email: 'hello@digmarketing.sk', address: 'Moderná 78, 811 03 Bratislava', iban: 'SK5312000000198742637543', invoiceCount: 3, totalRevenue: 2500 },
            { id: 4, name: 'StartUp XYZ', ico: '45678901', dic: '4567890123', icdph: '-', email: 'info@startupxyz.sk', address: 'Inovatívna 90, 821 09 Bratislava', iban: 'SK6412000000198742637544', invoiceCount: 1, totalRevenue: 5200 }
        ];
    }

    initMockInvoices() {
        return [
            { id: 1, number: '2025-0042', clientId: 1, date: '27.10.2025', amount: 1200, status: 'paid', base: 1000, vat: 200 },
            { id: 2, number: '2025-0041', clientId: 2, date: '25.10.2025', amount: 3500, status: 'issued', base: 2916.67, vat: 583.33 },
            { id: 3, number: '2025-0040', clientId: 3, date: '20.10.2025', amount: 850, status: 'overdue', base: 708.33, vat: 141.67 }
        ];
    }

    // Initialize navigation
    initNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    }

    // Navigate between pages
    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // Show selected page
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            }
        });

        this.currentPage = page;
        console.log('Navigated to:', page);
    }

    // Initialize all event listeners
    initEventListeners() {
        // Modal triggers
        document.querySelectorAll('[data-modal]').forEach(button => {
            button.addEventListener('click', (e) => {
                const modalId = e.currentTarget.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });

        // Close buttons
        document.querySelectorAll('[data-close]').forEach(button => {
            button.addEventListener('click', (e) => {
                const modalId = e.currentTarget.getAttribute('data-close');
                this.closeModal(modalId);
            });
        });

        // Close modal on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabGroup = e.currentTarget.closest('.tabs') || e.currentTarget.closest('.client-detail-tabs');
                if (tabGroup) {
                    this.switchTab(e.currentTarget, tabGroup);
                }
            });
        });

        // Document actions
        document.querySelectorAll('[data-action="view"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const docNumber = e.currentTarget.getAttribute('data-doc');
                this.viewDocument(docNumber);
            });
        });

        document.querySelectorAll('[data-action="convert"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const docNumber = e.currentTarget.getAttribute('data-doc');
                this.convertOffer(docNumber);
            });
        });

        // Client actions
        document.querySelectorAll('[data-action="viewClient"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const clientId = parseInt(e.currentTarget.getAttribute('data-client-id'));
                this.viewClientDetail(clientId);
            });
        });

        // Report action
        document.querySelectorAll('[data-action="report"]').forEach(button => {
            button.addEventListener('click', () => {
                this.navigateTo('reports');
            });
        });

        // Export actions
        document.querySelectorAll('[data-export]').forEach(button => {
            button.addEventListener('click', (e) => {
                const exportType = e.currentTarget.getAttribute('data-export');
                this.handleExport(exportType);
            });
        });

        // Form submissions
        const invoiceForm = document.getElementById('invoiceForm');
        if (invoiceForm) {
            invoiceForm.addEventListener('submit', (e) => this.createInvoice(e));
        }

        const clientForm = document.getElementById('clientForm');
        if (clientForm) {
            clientForm.addEventListener('submit', (e) => this.createClient(e));
        }

        const itemForm = document.getElementById('itemForm');
        if (itemForm) {
            itemForm.addEventListener('submit', (e) => this.createItem(e));
        }

        const expenseForm = document.getElementById('expenseForm');
        if (expenseForm) {
            expenseForm.addEventListener('submit', (e) => this.createExpense(e));
        }

        // Issue invoice button
        const issueBtn = document.getElementById('issueInvoiceBtn');
        if (issueBtn) {
            issueBtn.addEventListener('click', () => this.issueInvoice());
        }

        // Add item button
        const addItemBtn = document.getElementById('addItemBtn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => this.addInvoiceItem());
        }

        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                e.currentTarget.closest('.item-row').remove();
                this.recalculateInvoice();
            });
        });

        // Track stock checkbox
        const trackStock = document.getElementById('trackStock');
        if (trackStock) {
            trackStock.addEventListener('change', (e) => {
                const stockGroup = document.getElementById('stockGroup');
                stockGroup.style.display = e.target.checked ? 'block' : 'none';
            });
        }

        // Client search
        const clientSearch = document.getElementById('clientSearch');
        if (clientSearch) {
            clientSearch.addEventListener('input', (e) => this.searchClients(e.target.value));
        }

        // VAT calculations
        const calculateVatBtn = document.getElementById('calculateVatBtn');
        if (calculateVatBtn) {
            calculateVatBtn.addEventListener('click', () => this.calculateVAT());
        }

        const exportVatBtn = document.getElementById('exportVatBtn');
        if (exportVatBtn) {
            exportVatBtn.addEventListener('click', () => this.exportVATReport());
        }

        // PDF actions
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');
        if (downloadPdfBtn) {
            downloadPdfBtn.addEventListener('click', () => this.downloadPDF());
        }

        const printPdfBtn = document.getElementById('printPdfBtn');
        if (printPdfBtn) {
            printPdfBtn.addEventListener('click', () => this.printPDF());
        }

        // Client detail tabs
        document.querySelectorAll('[data-client-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-client-tab');
                this.switchClientTab(tabName);
            });
        });
    }

    // Initialize validation
    initValidation() {
        // Slovak ICO validation (8 digits)
        document.querySelectorAll('input[name="ico"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                const value = e.target.value;
                if (value && !/^\d{8}$/.test(value)) {
                    this.showValidationError(e.target, 'IČO musí obsahovať 8 číslic');
                } else {
                    this.clearValidationError(e.target);
                }
            });
        });

        // Slovak DIC validation (10 digits)
        document.querySelectorAll('input[name="dic"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                const value = e.target.value;
                if (value && !/^\d{10}$/.test(value)) {
                    this.showValidationError(e.target, 'DIČ musí obsahovať 10 číslic');
                } else {
                    this.clearValidationError(e.target);
                }
            });
        });

        // Slovak IC DPH validation (SK + 10 digits)
        document.querySelectorAll('input[name="icdph"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                const value = e.target.value;
                if (value && !/^SK\d{10}$/.test(value)) {
                    this.showValidationError(e.target, 'IČ DPH musí byť vo formáte SK1234567890');
                } else {
                    this.clearValidationError(e.target);
                }
            });
        });

        // Slovak IBAN validation (SK + 22 digits)
        document.querySelectorAll('input[name="iban"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                const value = e.target.value;
                if (value && !/^SK\d{22}$/.test(value)) {
                    this.showValidationError(e.target, 'IBAN musí byť vo formáte SK + 22 číslic');
                } else {
                    this.clearValidationError(e.target);
                }
            });
        });

        // ZIP code validation (###  ## or #####)
        document.querySelectorAll('input[name="zip"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                const value = e.target.value;
                if (value && !/^\d{3}\s?\d{2}$/.test(value)) {
                    this.showValidationError(e.target, 'PSČ musí byť vo formáte 811 01');
                } else {
                    this.clearValidationError(e.target);
                }
            });
        });
    }

    // Show validation error
    showValidationError(input, message) {
        input.style.borderColor = '#f44336';
        let errorEl = input.parentElement.querySelector('.validation-error');
        if (!errorEl) {
            errorEl = document.createElement('small');
            errorEl.className = 'validation-error';
            errorEl.style.color = '#f44336';
            errorEl.style.display = 'block';
            errorEl.style.marginTop = '5px';
            input.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    // Clear validation error
    clearValidationError(input) {
        input.style.borderColor = '#e0e0e0';
        const errorEl = input.parentElement.querySelector('.validation-error');
        if (errorEl) {
            errorEl.remove();
        }
    }

    // Modal functions
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Tab switching
    switchTab(tabElement, tabGroup) {
        const tabs = tabGroup.querySelectorAll('.tab');
        tabs.forEach(t => t.classList.remove('active'));
        tabElement.classList.add('active');

        const tabName = tabElement.getAttribute('data-tab');
        if (tabName) {
            console.log('Prepínanie na záložku:', tabName);
            this.filterDocuments(tabName);
        }
    }

    // Filter documents by tab
    filterDocuments(filter) {
        const rows = document.querySelectorAll('#documentsBody tr');

        rows.forEach(row => {
            const badge = row.querySelector('.badge');
            if (!badge) return;

            const badgeText = badge.textContent.toLowerCase();

            switch(filter) {
                case 'all':
                    row.style.display = '';
                    break;
                case 'invoices':
                    row.style.display = badgeText.includes('uhradená') || badgeText.includes('vystavená') || badgeText.includes('po splatnosti') ? '' : 'none';
                    break;
                case 'overdue':
                    row.style.display = badgeText.includes('po splatnosti') ? '' : 'none';
                    break;
                case 'paid':
                    row.style.display = badgeText.includes('uhradená') ? '' : 'none';
                    break;
                default:
                    row.style.display = '';
            }
        });
    }

    // Search clients
    searchClients(query) {
        const rows = document.querySelectorAll('#clientsBody tr');
        const lowerQuery = query.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(lowerQuery) ? '' : 'none';
        });
    }

    // View client detail
    viewClientDetail(clientId) {
        const client = this.mockClients.find(c => c.id === clientId);
        if (!client) return;

        // Fill client info
        document.getElementById('clientDetailName').textContent = client.name;
        document.getElementById('clientInfoName').textContent = client.name;
        document.getElementById('clientInfoIco').textContent = client.ico;
        document.getElementById('clientInfoDic').textContent = client.dic;
        document.getElementById('clientInfoIcdph').textContent = client.icdph;
        document.getElementById('clientInfoAddress').textContent = client.address;
        document.getElementById('clientInfoEmail').textContent = client.email;
        document.getElementById('clientInfoIban').textContent = client.iban;

        // Fill stats
        document.getElementById('clientStatRevenue').textContent = '€' + client.totalRevenue.toFixed(2);
        document.getElementById('clientStatInvoices').textContent = client.invoiceCount;
        document.getElementById('clientStatAverage').textContent = '€' + (client.totalRevenue / client.invoiceCount).toFixed(2);
        document.getElementById('clientStatLast').textContent = '27.10.2025';

        // Fill invoices
        const clientInvoices = this.mockInvoices.filter(inv => inv.clientId === clientId);
        const invoicesBody = document.getElementById('clientInvoicesBody');
        invoicesBody.innerHTML = clientInvoices.map(inv => `
            <tr>
                <td>${inv.number}</td>
                <td>${inv.date}</td>
                <td>€${inv.amount.toFixed(2)}</td>
                <td><span class="badge badge-${inv.status === 'paid' ? 'success' : 'warning'}">${inv.status === 'paid' ? 'Uhradená' : 'Vystavená'}</span></td>
                <td><button class="btn btn-secondary btn-small" onclick="invoiceSystem.viewDocument('${inv.number}')">Zobraziť</button></td>
            </tr>
        `).join('');

        this.openModal('clientDetailModal');
    }

    // Switch client detail tabs
    switchClientTab(tabName) {
        document.querySelectorAll('[data-client-tab]').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-client-tab') === tabName) {
                tab.classList.add('active');
            }
        });

        document.querySelectorAll('.client-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetTab = document.getElementById('client' + tabName.charAt(0).toUpperCase() + tabName.slice(1) + 'Tab');
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    // Form submissions
    createInvoice(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        console.log('Faktúra vytvorená');
        console.log('API Endpoint: POST /api/v1/documents/create');

        this.showNotification('Faktúra vytvorená!', 'Doklad bol uložený ako koncept a je pripravený na vystavenie.', 'success');
        this.closeModal('invoiceModal');
        e.target.reset();
    }

    createClient(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        console.log('Klient úspešne pridaný');
        console.log('API Endpoint: POST /api/v1/clients');

        this.showNotification('Klient úspešne pridaný!', 'Nový klient bol uložený do databázy.', 'success');
        this.closeModal('clientModal');
        e.target.reset();
    }

    createItem(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        console.log('Položka úspešne pridaná');
        console.log('API Endpoint: POST /api/v1/items');

        this.showNotification('Položka úspešne pridaná!', 'Nová položka bola pridaná do cenníka.', 'success');
        this.closeModal('itemModal');
        e.target.reset();
    }

    createExpense(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        console.log('Náklad zaznamenaný');
        console.log('API Endpoint: POST /api/v1/expenses');

        this.showNotification('Náklad zaznamenaný!', 'Výdavok bol uložený pre účtovné účely.', 'success');
        this.closeModal('expenseModal');
        e.target.reset();
    }

    // Validate form
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                this.showValidationError(input, 'Toto pole je povinné');
                isValid = false;
            }
        });

        return isValid;
    }

    // Issue invoice
    issueInvoice() {
        if (confirm('Naozaj chcete vystaviť túto faktúru?\n\nPo vystavení bude pridelené číslo faktúry a nebude ju možné zmazať, len stornovať.')) {
            console.log('Faktúra vystavená');
            console.log('Pridelené číslo: 2025-0043');
            console.log('API Endpoint: PUT /api/v1/documents/{id}/update');
            console.log('Status: KONCEPT → VYSTAVENA');

            this.showNotification('Faktúra vystavená!', 'Pridelené číslo: 2025-0043', 'success');
            this.closeModal('invoiceModal');
        }
    }

    // Add invoice item
    addInvoiceItem() {
        const container = document.getElementById('invoiceItems');
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <select name="item[]">
                <option>Vývoj webovej aplikácie</option>
                <option>Grafický dizajn</option>
                <option>Konzultácie</option>
            </select>
            <input type="number" name="quantity[]" placeholder="Množstvo" value="1" min="0">
            <input type="number" name="price[]" placeholder="Cena/j" value="0.00" step="0.01" min="0">
            <select name="vat[]">
                <option value="20">20% DPH</option>
                <option value="10">10% DPH</option>
                <option value="0">0% DPH</option>
            </select>
            <input type="text" class="item-total" readonly value="0.00 €">
            <button type="button" class="btn btn-danger btn-small remove-item">Odstrániť</button>
        `;

        container.appendChild(itemRow);

        // Add event listener to remove button
        itemRow.querySelector('.remove-item').addEventListener('click', (e) => {
            e.currentTarget.closest('.item-row').remove();
            this.recalculateInvoice();
        });

        // Add event listeners for recalculation
        itemRow.querySelectorAll('input[name="quantity[]"], input[name="price[]"], select[name="vat[]"]').forEach(input => {
            input.addEventListener('input', () => this.recalculateInvoice());
        });
    }

    // Recalculate invoice totals
    recalculateInvoice() {
        const rows = document.querySelectorAll('#invoiceItems .item-row');
        let totalWithoutVat = 0;
        let totalVat = 0;

        rows.forEach(row => {
            const quantity = parseFloat(row.querySelector('input[name="quantity[]"]').value) || 0;
            const price = parseFloat(row.querySelector('input[name="price[]"]').value) || 0;
            const vatRate = parseFloat(row.querySelector('select[name="vat[]"]').value) || 0;

            const itemTotal = quantity * price;
            const itemVat = itemTotal * (vatRate / 100);

            row.querySelector('.item-total').value = itemTotal.toFixed(2) + ' €';

            totalWithoutVat += itemTotal;
            totalVat += itemVat;
        });

        const totalWithVat = totalWithoutVat + totalVat;

        document.getElementById('totalWithoutVat').textContent = '€' + totalWithoutVat.toFixed(2);
        document.getElementById('totalVat').textContent = '€' + totalVat.toFixed(2);
        document.getElementById('totalWithVat').textContent = '€' + totalWithVat.toFixed(2);
    }

    // View document
    viewDocument(docNumber) {
        console.log('Zobrazenie dokladu:', docNumber);
        console.log('API Endpoints:');
        console.log('GET /api/v1/documents/{id}');
        console.log('GET /api/v1/documents/{id}/pdf');

        // Open PDF preview modal
        this.openModal('pdfPreviewModal');
    }

    // Convert offer to invoice
    convertOffer(offerNumber) {
        if (confirm('Chcete konvertovať ' + offerNumber + ' na faktúru?')) {
            console.log('Cenová ponuka konvertovaná na faktúru');
            console.log('API Endpoint: POST /api/v1/documents/{id}/convert');
            console.log('Nová faktúra: 2025-0044');

            this.showNotification('Ponuka konvertovaná!', 'Nová faktúra: 2025-0044', 'success');
        }
    }

    // Calculate VAT
    calculateVAT() {
        const period = document.getElementById('vatPeriod').value;
        console.log('Calculating VAT for period:', period);
        console.log('API Endpoint: GET /api/v1/vat/calculate?period=' + period);

        this.showNotification('DPH vypočítané', 'Výpočet DPH pre obdobie ' + period + ' bol dokončený.', 'success');
    }

    // Export VAT report
    exportVATReport() {
        const period = document.getElementById('vatPeriod').value;
        console.log('Exporting VAT report for period:', period);
        console.log('API Endpoint: GET /api/v1/vat/export?period=' + period);

        this.showNotification('Export DPH výkazu', 'Výkaz DPH bol exportovaný.', 'success');
    }

    // Handle exports
    handleExport(exportType) {
        console.log('Exporting:', exportType);

        const exportMap = {
            'invoices-csv': { api: 'GET /api/v1/exports/invoices/csv', file: 'faktury.csv' },
            'invoices-xlsx': { api: 'GET /api/v1/exports/invoices/xlsx', file: 'faktury.xlsx' },
            'clients-csv': { api: 'GET /api/v1/exports/clients/csv', file: 'klienti.csv' },
            'vat-report': { api: 'GET /api/v1/exports/vat/report', file: 'dph-vykaz.pdf' },
            'expenses-csv': { api: 'GET /api/v1/exports/expenses/csv', file: 'naklady.csv' },
            'yearly-report': { api: 'GET /api/v1/exports/yearly/report', file: 'rocny-prehled.pdf' },
            'backup': { api: 'GET /api/v1/exports/backup', file: 'backup.json' }
        };

        const exportInfo = exportMap[exportType];
        if (exportInfo) {
            console.log('API Endpoint:', exportInfo.api);
            this.showNotification('Export úspešný', 'Súbor ' + exportInfo.file + ' bol stiahnutý.', 'success');

            // In a real app, trigger actual download
            // this.downloadFile(exportInfo.file, data);
        }
    }

    // Download PDF
    downloadPDF() {
        console.log('Downloading PDF...');
        console.log('API Endpoint: GET /api/v1/documents/{id}/pdf');
        this.showNotification('PDF stiahnuté', 'Faktúra bola stiahnutá ako PDF.', 'success');
    }

    // Print PDF
    printPDF() {
        console.log('Printing PDF...');
        window.print();
    }

    // Show notification (custom implementation instead of alert)
    showNotification(title, message, type = 'info') {
        // For now, use console and alert
        // In production, you would create a custom toast notification
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        alert(title + '\n\n' + message);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.invoiceSystem = new InvoiceSystem();
});

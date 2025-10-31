// Invoice System Application
class InvoiceSystem {
    constructor() {
        this.initEventListeners();
        this.initValidation();
        console.log('Fakturačný systém inicializovaný');
        console.log('API Dokumentácia: faktury-api-spec.yaml');
        console.log('Offline režim: AKTÍVNY');
        console.log('Dáta uložené lokálne v SQLite databáze');
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
                this.switchTab(e.currentTarget);
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

        // Report action
        document.querySelectorAll('[data-action="report"]').forEach(button => {
            button.addEventListener('click', () => {
                this.generateReport();
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
    switchTab(tabElement) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tabElement.classList.add('active');

        const tabName = tabElement.getAttribute('data-tab');
        console.log('Prepínanie na záložku:', tabName);

        // Here you would filter the documents table based on the tab
        this.filterDocuments(tabName);
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

        this.showNotification(
            'Zobrazenie dokladu: ' + docNumber,
            'Môžete zobraziť detail, stiahnuť PDF, duplikovať alebo označiť ako uhradenú.',
            'info'
        );
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

    // Generate report
    generateReport() {
        const reportType = prompt('Vyberte typ reportu:\n\n1 - Faktúry po splatnosti\n2 - Prehľad obratu\n3 - Sumár DPH\n4 - Export do CSV\n\nZadajte číslo (1-4):');

        const reports = {
            '1': 'GET /api/v1/reports/overdue',
            '2': 'GET /api/v1/reports/revenue',
            '3': 'GET /api/v1/reports/vat-summary',
            '4': 'GET /api/v1/reports/export-csv'
        };

        if (reports[reportType]) {
            console.log('Generovanie reportu...');
            console.log('API Endpoint:', reports[reportType]);

            this.showNotification('Generovanie reportu...', 'Report bude vygenerovaný a pripravený na export.', 'info');
        }
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

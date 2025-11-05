// Invoice System Application

// IndexedDB Database Wrapper
class InvoiceDB {
    constructor() {
        this.dbName = 'InvoiceSystemDB';
        this.version = 1;
        this.db = null;
    }

    // Initialize database with object stores
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores if they don't exist
                const storeNames = ['companies', 'clients', 'products', 'projects', 'invoices', 'offers', 'proformas', 'settings'];

                storeNames.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                        // Add indexes for common queries
                        if (storeName === 'invoices') {
                            store.createIndex('number', 'number', { unique: true });
                            store.createIndex('clientId', 'clientId', { unique: false });
                            store.createIndex('status', 'status', { unique: false });
                        } else if (storeName === 'clients') {
                            store.createIndex('ico', 'ico', { unique: false });
                        }
                    }
                });

                console.log('IndexedDB object stores created');
            };
        });
    }

    // Generic method to save data to a store
    async saveData(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic method to get all data from a store
    async getAllData(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Get data by ID
    async getData(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Delete data by ID
    async deleteData(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Clear all data from a store
    async clearStore(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Migrate data from localStorage to IndexedDB
    async migrateFromLocalStorage() {
        try {
            // Migrate companies
            const companies = localStorage.getItem('invoiceSystemCompanies');
            if (companies) {
                const companiesArray = JSON.parse(companies);
                for (const company of companiesArray) {
                    await this.saveData('companies', company);
                }
                console.log('Migrated', companiesArray.length, 'companies to IndexedDB');
            }

            // Migrate settings
            const currentCompanyId = localStorage.getItem('currentCompanyId');
            if (currentCompanyId) {
                await this.saveData('settings', { id: 'currentCompanyId', value: currentCompanyId });
            }

            const darkMode = localStorage.getItem('darkMode');
            if (darkMode) {
                await this.saveData('settings', { id: 'darkMode', value: darkMode });
            }

            const language = localStorage.getItem('language');
            if (language) {
                await this.saveData('settings', { id: 'language', value: language });
            }

            console.log('Migration from localStorage complete');
        } catch (error) {
            console.error('Migration error:', error);
            throw error;
        }
    }

    // Save companies (batch operation)
    async saveCompanies(companies) {
        try {
            await this.clearStore('companies');
            for (const company of companies) {
                await this.saveData('companies', company);
            }
            return true;
        } catch (error) {
            console.error('Error saving companies:', error);
            return false;
        }
    }

    // Get all companies
    async getCompanies() {
        try {
            return await this.getAllData('companies');
        } catch (error) {
            console.error('Error loading companies:', error);
            return [];
        }
    }

    // Get setting by key
    async getSetting(key) {
        try {
            const setting = await this.getData('settings', key);
            return setting ? setting.value : null;
        } catch (error) {
            console.error('Error loading setting:', error);
            return null;
        }
    }

    // Save setting
    async saveSetting(key, value) {
        try {
            await this.saveData('settings', { id: key, value: value });
            return true;
        } catch (error) {
            console.error('Error saving setting:', error);
            return false;
        }
    }
}

// Initialize global database instance
window.invoiceDB = new InvoiceDB();

class InvoiceSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.mockClients = this.initMockClients();
        this.mockInvoices = this.initMockInvoices();
        this.mockProducts = this.initMockProducts();
        this.mockProjects = this.initMockProjects();
        this.charts = {};
        this.filteredInvoices = [];

        // Load companies from localStorage or initialize with defaults
        this.loadCompanies();
        this.currentCompanyId = this.getCurrentCompanyId();

        this.initEventListeners();
        this.initValidation();
        this.initNavigation();
        this.initCompanySelector();
        this.initCharts();
        this.initInvoicesPage();
        this.initTaxCalculator();
        this.renderCompanyCards();
        this.updateCompanySelector();
        this.initDarkMode();
        this.initDatabase();
        this.initEmailFunctions();
        this.updateDashboard();
        this.initKeyboardShortcuts();
        this.initBulkDelete();

        console.log('Fakturačný systém inicializovaný');
        console.log('API Dokumentácia: faktury-api-spec.yaml');
        console.log('Offline režim: AKTÍVNY');
        console.log('Dáta uložené lokálne v localStorage');
        console.log('Multi-firma systém: AKTÍVNY');
        console.log('Počet firiem:', this.companies.length);
    }

    // Load companies from localStorage or create defaults
    loadCompanies() {
        const stored = localStorage.getItem('invoiceSystemCompanies');
        if (stored) {
            this.companies = JSON.parse(stored);
        } else {
            // Initialize with default companies
            this.companies = [
                {
                    id: 1,
                    name: 'Moja SZČO',
                    type: 'SZCO',
                    ico: '12345678',
                    dic: '1234567890',
                    icdph: 'SK1234567890',
                    street: 'Hlavná 123',
                    city: 'Bratislava',
                    zip: '811 01',
                    address: 'Hlavná 123, 811 01 Bratislava',
                    iban: 'SK3112000000198742637541',
                    email: 'info@mojaszco.sk',
                    phone: '+421 900 123 456',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Moja s.r.o.',
                    type: 'SRO',
                    ico: '23456789',
                    dic: '2345678901',
                    icdph: 'SK2345678901',
                    street: 'Nová 45',
                    city: 'Bratislava',
                    zip: '821 05',
                    address: 'Nová 45, 821 05 Bratislava',
                    iban: 'SK4212000000198742637542',
                    email: 'info@mojasro.sk',
                    phone: '+421 900 654 321',
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveCompanies();
        }
    }

    // Load companies from IndexedDB
    async loadCompaniesFromDB() {
        try {
            const companies = await window.invoiceDB.getCompanies();
            if (companies && companies.length > 0) {
                this.companies = companies;
                console.log('Loaded', companies.length, 'companies from IndexedDB');
            }

            // Also load current company ID from IndexedDB
            const companyId = await window.invoiceDB.getSetting('currentCompanyId');
            if (companyId) {
                this.currentCompanyId = parseInt(companyId);
            }
        } catch (error) {
            console.error('Error loading from IndexedDB:', error);
        }
    }

    // Save companies to localStorage and IndexedDB
    saveCompanies() {
        // Save to localStorage as fallback
        localStorage.setItem('invoiceSystemCompanies', JSON.stringify(this.companies));
        console.log('Companies saved to localStorage:', this.companies.length);

        // Auto-save to IndexedDB if available
        if (window.invoiceDB && window.invoiceDB.db) {
            window.invoiceDB.saveCompanies(this.companies)
                .then(() => console.log('Companies auto-saved to IndexedDB'))
                .catch(err => console.error('Auto-save error:', err));
        }
    }

    // Get current company ID from localStorage or default to first company
    getCurrentCompanyId() {
        const stored = localStorage.getItem('currentCompanyId');
        if (stored) {
            const id = parseInt(stored);
            // Verify company exists
            if (this.companies.find(c => c.id === id)) {
                return id;
            }
        }
        return this.companies.length > 0 ? this.companies[0].id : 1;
    }

    // Set current company ID
    setCurrentCompanyId(companyId) {
        localStorage.setItem('currentCompanyId', companyId.toString());

        // Auto-save to IndexedDB if available
        if (window.invoiceDB && window.invoiceDB.db) {
            window.invoiceDB.saveSetting('currentCompanyId', companyId.toString())
                .catch(err => console.error('Error saving currentCompanyId to IndexedDB:', err));
        }
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

    initMockProducts() {
        return [
            { id: 1, name: 'Vývoj webovej aplikácie', category: 'service', unit: 'hod', price: 50.00, vat: 20 },
            { id: 2, name: 'Grafický dizajn', category: 'service', unit: 'hod', price: 40.00, vat: 20 },
            { id: 3, name: 'Marketingová konzultácia', category: 'service', unit: 'hod', price: 60.00, vat: 20 }
        ];
    }

    initMockProjects() {
        return [
            { id: 1, name: 'Redesign webstránky', clientId: 1, clientName: 'ACME s.r.o.', status: 'in_progress', budget: 5000, workedHours: 45, estimatedHours: 80, deadline: '2025-12-15' },
            { id: 2, name: 'Mobilná aplikácia', clientId: 2, clientName: 'Tech Solutions s.r.o.', status: 'in_progress', budget: 12000, workedHours: 120, estimatedHours: 200, deadline: '2026-01-31' },
            { id: 3, name: 'SEO optimalizácia', clientId: 3, clientName: 'Digital Marketing s.r.o.', status: 'completed', budget: 2500, workedHours: 50, estimatedHours: 50, deadline: '2025-11-30' }
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

        const recurringInvoiceForm = document.getElementById('recurringInvoiceForm');
        if (recurringInvoiceForm) {
            recurringInvoiceForm.addEventListener('submit', (e) => this.createRecurringInvoice(e));
        }

        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.createProduct(e));
        }

        const projectForm = document.getElementById('projectForm');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => this.createProject(e));
        }

        const proformaForm = document.getElementById('proformaForm');
        if (proformaForm) {
            proformaForm.addEventListener('submit', (e) => this.createProforma(e));
        }

        const offerForm = document.getElementById('offerForm');
        if (offerForm) {
            offerForm.addEventListener('submit', (e) => this.createOffer(e));
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

        // Product search and filter
        const productSearch = document.getElementById('productSearch');
        if (productSearch) {
            productSearch.addEventListener('input', (e) => this.filterProducts());
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => this.filterProducts());
        }

        // Project search and filter
        const projectSearch = document.getElementById('projectSearch');
        if (projectSearch) {
            projectSearch.addEventListener('input', (e) => this.filterProjects());
        }

        const projectStatusFilter = document.getElementById('projectStatusFilter');
        if (projectStatusFilter) {
            projectStatusFilter.addEventListener('change', (e) => this.filterProjects());
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

        const formData = new FormData(e.target);

        // Create new invoice object
        const newInvoice = {
            id: Math.max(...this.mockInvoices.map(i => i.id), 0) + 1,
            number: '2025-' + String(Math.max(...this.mockInvoices.map(i => parseInt(i.number.split('-')[1])), 41) + 1).padStart(4, '0'),
            clientId: parseInt(formData.get('clientId')),
            date: new Date(formData.get('issueDate')).toLocaleDateString('sk-SK'),
            dueDate: new Date(formData.get('dueDate')).toLocaleDateString('sk-SK'),
            amount: 1200, // Would calculate from items
            base: 1000,
            vat: 200,
            total: 1200,
            status: 'draft',
            type: 'Faktúra'
        };

        // Add to mock data
        this.mockInvoices.push(newInvoice);

        console.log('Faktúra vytvorená:', newInvoice);
        console.log('API Endpoint: POST /api/v1/documents/create');

        this.showNotification('Faktúra vytvorená!', 'Doklad bol uložený ako koncept a je pripravený na vystavenie.', 'success');
        this.closeModal('invoiceModal');
        e.target.reset();

        // Refresh UI if on invoices page
        if (this.currentPage === 'invoices') {
            this.loadInvoices();
        }

        // Update dashboard
        this.updateDashboard();
    }

    createClient(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);

        // Create new client object
        const newClient = {
            id: Math.max(...this.mockClients.map(c => c.id), 0) + 1,
            name: formData.get('name'),
            ico: formData.get('ico'),
            dic: formData.get('dic'),
            icdph: formData.get('icdph') || '-',
            email: formData.get('email'),
            address: (formData.get('street') || '') + (formData.get('city') ? ', ' + formData.get('zip') + ' ' + formData.get('city') : ''),
            iban: formData.get('iban'),
            invoiceCount: 0,
            totalRevenue: 0
        };

        // Add to mock data
        this.mockClients.push(newClient);

        console.log('Klient úspešne pridaný:', newClient);
        console.log('API Endpoint: POST /api/v1/clients');

        this.showNotification('Klient úspešne pridaný!', 'Nový klient bol uložený do databázy.', 'success');
        this.closeModal('clientModal');
        e.target.reset();

        // Refresh UI if on clients page
        if (this.currentPage === 'clients') {
            this.renderClients();
        }

        // Update dashboard
        this.updateDashboard();
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

    createRecurringInvoice(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const recurringInvoice = {
            clientId: formData.get('clientId'),
            amount: parseFloat(formData.get('amount')),
            frequency: formData.get('frequency'),
            startDate: formData.get('startDate'),
            companyId: this.currentCompanyId,
            active: true
        };

        console.log('Opakujúca sa faktúra vytvorená:', recurringInvoice);
        console.log('API Endpoint: POST /api/v1/recurring-invoices');

        this.showNotification('Opakujúca faktúra vytvorená!', 'Automatické fakturácie bola nastavená.', 'success');
        this.closeModal('recurringInvoiceModal');
        e.target.reset();
    }

    createProduct(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const product = {
            id: Math.max(...this.mockProducts.map(p => p.id), 0) + 1,
            name: formData.get('name'),
            category: formData.get('category'),
            unit: formData.get('unit') || 'ks',
            price: parseFloat(formData.get('price')),
            vat: parseInt(formData.get('vat')),
            companyId: this.currentCompanyId
        };

        // Add to mock data
        this.mockProducts.push(product);

        console.log('Produkt vytvorený:', product);
        console.log('API Endpoint: POST /api/v1/products');

        this.showNotification('Produkt pridaný!', 'Položka bola pridaná do cenníka.', 'success');
        this.closeModal('productModal');
        e.target.reset();

        // Refresh UI if on products page
        if (this.currentPage === 'products') {
            this.renderProducts();
        }
    }

    createProject(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const clientId = parseInt(formData.get('clientId'));
        const client = this.mockClients.find(c => c.id === clientId);

        const project = {
            id: Math.max(...this.mockProjects.map(p => p.id), 0) + 1,
            name: formData.get('name'),
            clientId: clientId,
            clientName: client ? client.name : 'Neznámy klient',
            budget: parseFloat(formData.get('budget')) || 0,
            estimatedHours: parseInt(formData.get('estimatedHours')) || 0,
            workedHours: 0,
            deadline: formData.get('deadline'),
            description: formData.get('description'),
            companyId: this.currentCompanyId,
            status: 'in_progress'
        };

        // Add to mock data
        this.mockProjects.push(project);

        console.log('Projekt vytvorený:', project);
        console.log('API Endpoint: POST /api/v1/projects');

        this.showNotification('Projekt vytvorený!', 'Nový projekt bol pridaný do systému.', 'success');
        this.closeModal('projectModal');
        e.target.reset();

        // Refresh UI if on projects page
        if (this.currentPage === 'projects') {
            this.renderProjects();
        }
    }

    createProforma(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const proforma = {
            clientId: formData.get('clientId'),
            issueDate: formData.get('issueDate'),
            validUntil: formData.get('validUntil'),
            items: [
                {
                    name: formData.get('itemName[]'),
                    quantity: parseInt(formData.get('quantity[]')),
                    price: parseFloat(formData.get('price[]')),
                    vat: parseInt(formData.get('vat[]'))
                }
            ],
            note: formData.get('note'),
            companyId: this.currentCompanyId,
            type: 'proforma'
        };

        console.log('Proforma faktúra vytvorená:', proforma);
        console.log('API Endpoint: POST /api/v1/documents/proforma');

        this.showNotification('Proforma faktúra vytvorená!', 'Predbežná faktúra bola úspešne vytvorená.', 'success');
        this.closeModal('proformaModal');
        e.target.reset();
    }

    createOffer(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const offer = {
            clientId: formData.get('clientId'),
            subject: formData.get('subject'),
            issueDate: formData.get('issueDate'),
            validityDays: parseInt(formData.get('validityDays')),
            items: [
                {
                    name: formData.get('itemName[]'),
                    quantity: parseInt(formData.get('quantity[]')),
                    price: parseFloat(formData.get('price[]')),
                    vat: parseInt(formData.get('vat[]'))
                }
            ],
            paymentTerms: formData.get('paymentTerms'),
            deliveryTime: formData.get('deliveryTime'),
            description: formData.get('description'),
            terms: formData.get('terms'),
            companyId: this.currentCompanyId,
            type: 'offer',
            status: 'pending'
        };

        console.log('Cenová ponuka vytvorená:', offer);
        console.log('API Endpoint: POST /api/v1/documents/offer');

        this.showNotification('Cenová ponuka vytvorená!', 'Ponuka bola odoslaná klientovi.', 'success');
        this.closeModal('offerModal');
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
        // Check if jsPDF is loaded
        if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
            this.showNotification('Chyba', 'jsPDF knižnica nie je načítaná', 'error');
            console.log('API Endpoint: GET /api/v1/documents/{id}/pdf');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Get current company
            const company = this.companies.find(c => c.id === this.currentCompanyId);

            // Add content
            doc.setFontSize(20);
            doc.text('FAKTÚRA', 105, 20, { align: 'center' });

            doc.setFontSize(10);
            doc.text('Dodávateľ:', 20, 40);
            doc.setFontSize(12);
            doc.text(company.name, 20, 46);
            doc.setFontSize(10);
            doc.text(company.street + ', ' + company.zip + ' ' + company.city, 20, 52);
            doc.text('IČO: ' + company.ico, 20, 58);
            if (company.dic) doc.text('DIČ: ' + company.dic, 20, 64);
            if (company.icdph) doc.text('IČ DPH: ' + company.icdph, 20, 70);

            doc.text('Číslo faktúry: 2025-0001', 120, 46);
            doc.text('Dátum vystavenia: ' + new Date().toLocaleDateString('sk-SK'), 120, 52);
            doc.text('Dátum splatnosti: ' + new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK'), 120, 58);

            doc.setFontSize(10);
            doc.text('Položky:', 20, 90);

            doc.setFontSize(12);
            doc.text('CELKOM: €1,200.00', 120, 120);

            // Download
            doc.save('faktura-' + Date.now() + '.pdf');

            this.showNotification('PDF stiahnuté', 'Faktúra bola úspešne stiahnutá ako PDF.', 'success');
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showNotification('Chyba', 'Nepodarilo sa vygenerovať PDF', 'error');
        }
    }

    // Export to CSV
    exportToCSV(data, filename, headers) {
        const csvContent = [
            headers.join(';'),
            ...data.map(row => headers.map(h => row[h] || '').join(';'))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename + '-' + new Date().toISOString().split('T')[0] + '.csv';
        link.click();

        this.showNotification('Export CSV', 'Dáta boli exportované do CSV súboru.', 'success');
    }

    // Export invoices to CSV
    exportInvoicesCSV() {
        const headers = ['number', 'date', 'dueDate', 'clientName', 'base', 'vat', 'total', 'status'];
        const data = this.filteredInvoices.length > 0 ? this.filteredInvoices : this.mockInvoices;
        this.exportToCSV(data, 'faktury', headers);
    }

    // Export clients to CSV
    exportClientsCSV() {
        const headers = ['name', 'ico', 'dic', 'icdph', 'email', 'address', 'iban', 'invoiceCount', 'totalRevenue'];
        this.exportToCSV(this.mockClients, 'klienti', headers);
    }

    // Export products to CSV
    exportProductsCSV() {
        const headers = ['name', 'category', 'unit', 'price', 'vat'];
        this.exportToCSV(this.mockProducts, 'produkty', headers);
    }

    // Print PDF
    printPDF() {
        console.log('Printing PDF...');
        window.print();
    }

    // Initialize company selector
    initCompanySelector() {
        const selector = document.getElementById('activeCompanySelector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.switchCompany(parseInt(e.target.value));
            });
        }

        // Company actions
        document.querySelectorAll('[data-action="switchCompany"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const companyId = parseInt(e.currentTarget.getAttribute('data-company-id'));
                this.switchCompany(companyId);
            });
        });

        document.querySelectorAll('[data-action="editCompany"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const companyId = parseInt(e.currentTarget.getAttribute('data-company-id'));
                this.editCompany(companyId);
            });
        });

        document.querySelectorAll('[data-action="uploadLogo"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const companyId = parseInt(e.currentTarget.getAttribute('data-company-id'));
                this.uploadLogo(companyId);
            });
        });

        // Add company form
        const addCompanyForm = document.getElementById('addCompanyForm');
        if (addCompanyForm) {
            addCompanyForm.addEventListener('submit', (e) => this.addCompany(e));
        }

        // Edit company form
        const editCompanyForm = document.getElementById('editCompanyForm');
        if (editCompanyForm) {
            editCompanyForm.addEventListener('submit', (e) => this.updateCompany(e));
        }

        // Settings forms
        const invoiceSettingsForm = document.getElementById('invoiceSettingsForm');
        if (invoiceSettingsForm) {
            invoiceSettingsForm.addEventListener('submit', (e) => this.saveInvoiceSettings(e));
        }

        const paymentSettingsForm = document.getElementById('paymentSettingsForm');
        if (paymentSettingsForm) {
            paymentSettingsForm.addEventListener('submit', (e) => this.savePaymentSettings(e));
        }

        const signatureSettingsForm = document.getElementById('signatureSettingsForm');
        if (signatureSettingsForm) {
            signatureSettingsForm.addEventListener('submit', (e) => this.saveSignatureSettings(e));
        }

        const systemSettingsForm = document.getElementById('systemSettingsForm');
        if (systemSettingsForm) {
            systemSettingsForm.addEventListener('submit', (e) => this.saveSystemSettings(e));
        }
    }

    // Switch active company
    switchCompany(companyId) {
        this.currentCompanyId = companyId;
        this.setCurrentCompanyId(companyId);
        const company = this.companies.find(c => c.id === companyId);

        if (!company) {
            this.showNotification('Chyba', 'Firma nebola nájdená', 'error');
            return;
        }

        console.log('Switching to company:', company.name);
        console.log('API Endpoint: POST /api/v1/companies/switch', { companyId });

        // Update selector
        this.updateCompanySelector();

        // Update company cards active state
        this.renderCompanyCards();

        this.showNotification('Firma zmenená', `Prepli ste sa na: ${company.name}`, 'success');

        // Reload data for this company
        this.loadCompanyData(companyId);
    }

    // Load company data
    loadCompanyData(companyId) {
        console.log('Loading data for company:', companyId);
        console.log('API Endpoint: GET /api/v1/companies/' + companyId + '/data');

        // In a real app, you would fetch company-specific data here
        // and update the dashboard, invoices, clients, etc.
    }

    // Edit company
    editCompany(companyId) {
        const company = this.companies.find(c => c.id === companyId);
        if (!company) return;

        console.log('Editing company:', company);

        // Fill edit form
        document.getElementById('editCompanyId').value = company.id;
        document.getElementById('editCompanyName').value = company.name;
        document.getElementById('editCompanyType').value = company.type;
        document.getElementById('editCompanyIco').value = company.ico;
        document.getElementById('editCompanyDic').value = company.dic || '';
        document.getElementById('editCompanyIcdph').value = company.icdph || '';
        document.getElementById('editCompanyStreet').value = company.street;
        document.getElementById('editCompanyCity').value = company.city;
        document.getElementById('editCompanyZip').value = company.zip;
        document.getElementById('editCompanyEmail').value = company.email || '';
        document.getElementById('editCompanyPhone').value = company.phone || '';
        document.getElementById('editCompanyIban').value = company.iban || '';

        this.openModal('editCompanyModal');
    }

    // Upload logo
    uploadLogo(companyId) {
        console.log('Upload logo for company:', companyId);
        console.log('API Endpoint: POST /api/v1/companies/' + companyId + '/logo');
        this.showNotification('Nahrávanie loga', 'Funkcia v príprave', 'info');
    }

    // Add company
    addCompany(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);

        // Generate new ID
        const newId = this.companies.length > 0
            ? Math.max(...this.companies.map(c => c.id)) + 1
            : 1;

        const newCompany = {
            id: newId,
            name: formData.get('companyName'),
            type: formData.get('companyType'),
            ico: formData.get('ico'),
            dic: formData.get('dic') || '',
            icdph: formData.get('icdph') || '',
            street: formData.get('street'),
            city: formData.get('city'),
            zip: formData.get('zip'),
            address: `${formData.get('street')}, ${formData.get('zip')} ${formData.get('city')}`,
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            iban: formData.get('iban') || '',
            createdAt: new Date().toISOString()
        };

        this.companies.push(newCompany);
        this.saveCompanies();

        console.log('Adding new company:', newCompany);
        console.log('API Endpoint: POST /api/v1/companies');

        // Update UI
        this.renderCompanyCards();
        this.updateCompanySelector();

        this.showNotification('Firma pridaná!', `${newCompany.name} bola úspešne pridaná.`, 'success');
        this.closeModal('addCompanyModal');
        e.target.reset();
    }

    // Update company
    updateCompany(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const companyId = parseInt(formData.get('companyId'));

        const company = this.companies.find(c => c.id === companyId);
        if (!company) {
            this.showNotification('Chyba', 'Firma nebola nájdená', 'error');
            return;
        }

        // Update company data
        company.name = formData.get('companyName');
        company.type = formData.get('companyType');
        company.ico = formData.get('ico');
        company.dic = formData.get('dic') || '';
        company.icdph = formData.get('icdph') || '';
        company.street = formData.get('street');
        company.city = formData.get('city');
        company.zip = formData.get('zip');
        company.address = `${formData.get('street')}, ${formData.get('zip')} ${formData.get('city')}`;
        company.email = formData.get('email') || '';
        company.phone = formData.get('phone') || '';
        company.iban = formData.get('iban') || '';
        company.updatedAt = new Date().toISOString();

        this.saveCompanies();

        console.log('Updating company:', company);
        console.log('API Endpoint: PUT /api/v1/companies/' + companyId);

        // Update UI
        this.renderCompanyCards();
        this.updateCompanySelector();

        this.showNotification('Firma aktualizovaná!', `${company.name} bola úspešne aktualizovaná.`, 'success');
        this.closeModal('editCompanyModal');
    }

    // Delete company
    deleteCompany(companyId) {
        const company = this.companies.find(c => c.id === companyId);
        if (!company) return;

        // Don't allow deleting the last company
        if (this.companies.length === 1) {
            this.showNotification('Nie je možné zmazať', 'Musíte mať aspoň jednu firmu v systéme.', 'warning');
            return;
        }

        // Don't allow deleting active company
        if (companyId === this.currentCompanyId) {
            this.showNotification('Nie je možné zmazať', 'Nemôžete zmazať aktívnu firmu. Najprv prepnite na inú firmu.', 'warning');
            return;
        }

        if (confirm(`Naozaj chcete zmazať firmu "${company.name}"?\n\nTáto akcia je nevratná a zmaže všetky súvisiace dáta (faktúry, klientov, atď.)`)) {
            this.companies = this.companies.filter(c => c.id !== companyId);
            this.saveCompanies();

            console.log('Deleting company:', companyId);
            console.log('API Endpoint: DELETE /api/v1/companies/' + companyId);

            // Update UI
            this.renderCompanyCards();
            this.updateCompanySelector();

            this.showNotification('Firma zmazaná', `${company.name} bola úspešne zmazaná.`, 'success');
        }
    }

    // Render company cards in settings page
    renderCompanyCards() {
        const container = document.querySelector('.companies-grid');
        if (!container) return;

        container.innerHTML = this.companies.map(company => `
            <div class="company-card ${company.id === this.currentCompanyId ? 'active' : ''}" data-company-id="${company.id}">
                <div class="company-logo-placeholder">
                    <span>${company.type}</span>
                </div>
                <div class="company-info">
                    <h3>${company.name}</h3>
                    <p><strong>IČO:</strong> ${company.ico}</p>
                    ${company.dic ? `<p><strong>DIČ:</strong> ${company.dic}</p>` : ''}
                    ${company.icdph ? `<p><strong>IČ DPH:</strong> ${company.icdph}</p>` : ''}
                    <p><strong>Adresa:</strong> ${company.address}</p>
                    ${company.iban ? `<p><strong>IBAN:</strong> ${company.iban}</p>` : ''}
                    ${company.email ? `<p><strong>Email:</strong> ${company.email}</p>` : ''}
                    ${company.phone ? `<p><strong>Tel:</strong> ${company.phone}</p>` : ''}
                </div>
                <div class="company-actions">
                    <button class="btn btn-secondary" data-action="editCompany" data-company-id="${company.id}">Upraviť</button>
                    ${company.id !== this.currentCompanyId ? `
                        <button class="btn btn-primary btn-small" data-action="switchCompany" data-company-id="${company.id}">Prepnúť</button>
                        <button class="btn btn-danger btn-small" data-action="deleteCompany" data-company-id="${company.id}">Zmazať</button>
                    ` : `
                        <span class="badge badge-success">Aktívna</span>
                    `}
                </div>
            </div>
        `).join('');

        // Re-attach event listeners
        this.attachCompanyCardListeners();
    }

    // Attach event listeners to company cards
    attachCompanyCardListeners() {
        document.querySelectorAll('[data-action="switchCompany"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const companyId = parseInt(e.currentTarget.getAttribute('data-company-id'));
                this.switchCompany(companyId);
            });
        });

        document.querySelectorAll('[data-action="editCompany"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const companyId = parseInt(e.currentTarget.getAttribute('data-company-id'));
                this.editCompany(companyId);
            });
        });

        document.querySelectorAll('[data-action="deleteCompany"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const companyId = parseInt(e.currentTarget.getAttribute('data-company-id'));
                this.deleteCompany(companyId);
            });
        });
    }

    // Update company selector in navbar
    updateCompanySelector() {
        const selector = document.getElementById('activeCompanySelector');
        if (!selector) return;

        selector.innerHTML = this.companies.map(company => `
            <option value="${company.id}" ${company.id === this.currentCompanyId ? 'selected' : ''}>
                ${company.name}
            </option>
        `).join('');
    }

    // Save invoice settings
    saveInvoiceSettings(e) {
        e.preventDefault();
        console.log('Saving invoice settings');
        console.log('API Endpoint: PUT /api/v1/settings/invoices');
        this.showNotification('Nastavenia uložené', 'Nastavenia faktúr boli úspešne uložené.', 'success');
    }

    // Save payment settings
    savePaymentSettings(e) {
        e.preventDefault();
        console.log('Saving payment settings');
        console.log('API Endpoint: PUT /api/v1/settings/payment');
        this.showNotification('Nastavenia uložené', 'Platobné údaje boli úspešne uložené.', 'success');
    }

    // Save signature settings
    saveSignatureSettings(e) {
        e.preventDefault();
        console.log('Saving signature settings');
        console.log('API Endpoint: PUT /api/v1/settings/signature');
        this.showNotification('Nastavenia uložené', 'Podpis a pečiatka boli úspešne uložené.', 'success');
    }

    // Save system settings
    saveSystemSettings(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const language = formData.get('language');

        // Save language preference
        if (language) {
            localStorage.setItem('language', language);
            this.currentLanguage = language;

            // Auto-save to IndexedDB if available
            if (window.invoiceDB && window.invoiceDB.db) {
                window.invoiceDB.saveSetting('language', language)
                    .catch(err => console.error('Error saving language to IndexedDB:', err));
            }

            this.showNotification(
                t('msg.saved', language),
                'Jazyk bol zmenený na ' + (language === 'sk' ? 'Slovenčinu' : language === 'cz' ? 'Češtinu' : 'English'),
                'success'
            );
        }

        console.log('Saving system settings');
        console.log('API Endpoint: PUT /api/v1/settings/system');
        this.showNotification('Nastavenia uložené', 'Systémové nastavenia boli úspešne uložené.', 'success');
    }

    // Initialize charts
    initCharts() {
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }

        // Revenue over time chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            this.charts.revenue = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt'],
                    datasets: [{
                        label: 'Obrat (€)',
                        data: [850, 1200, 1100, 1400, 1300, 1500, 1450, 1600, 1550, 1700],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '€' + value;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Income vs Expense chart
        const incomeExpenseCtx = document.getElementById('incomeExpenseChart');
        if (incomeExpenseCtx) {
            this.charts.incomeExpense = new Chart(incomeExpenseCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt'],
                    datasets: [
                        {
                            label: 'Príjmy',
                            data: [850, 1200, 1100, 1400, 1300, 1500, 1450, 1600, 1550, 1700],
                            backgroundColor: '#4CAF50'
                        },
                        {
                            label: 'Výdavky',
                            data: [300, 250, 400, 350, 300, 400, 350, 450, 400, 380],
                            backgroundColor: '#f44336'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '€' + value;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Top clients chart
        const topClientsCtx = document.getElementById('topClientsChart');
        if (topClientsCtx) {
            this.charts.topClients = new Chart(topClientsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['ACME s.r.o.', 'Tech Solutions', 'Digital Marketing', 'StartUp XYZ', 'Ostatní'],
                    datasets: [{
                        data: [4200, 8750, 2500, 5200, 1800],
                        backgroundColor: [
                            '#667eea',
                            '#764ba2',
                            '#f093fb',
                            '#4facfe',
                            '#43e97b'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }
                }
            });
        }

        // Expense categories chart
        const expenseCategoriesCtx = document.getElementById('expenseCategoriesChart');
        if (expenseCategoriesCtx) {
            this.charts.expenseCategories = new Chart(expenseCategoriesCtx, {
                type: 'pie',
                data: {
                    labels: ['Materiál', 'Energia', 'Služby', 'Nájom', 'Doprava', 'Marketing'],
                    datasets: [{
                        data: [450, 200, 850, 600, 300, 400],
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }
                }
            });
        }

        // Cashflow chart (Reports page)
        const cashflowCtx = document.getElementById('cashflowChart');
        if (cashflowCtx) {
            this.charts.cashflow = new Chart(cashflowCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Príjmy',
                            data: [850, 1200, 1100, 1400, 1300, 1500, 1450, 1600, 1550, 1700, 1650, 1800],
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Výdavky',
                            data: [300, 250, 400, 350, 300, 400, 350, 450, 400, 380, 420, 390],
                            borderColor: '#f44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Cashflow',
                            data: [550, 950, 700, 1050, 1000, 1100, 1100, 1150, 1150, 1320, 1230, 1410],
                            borderColor: '#667eea',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Cashflow Analysis'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '€' + value;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Monthly breakdown chart (Reports page)
        const monthlyBreakdownCtx = document.getElementById('monthlyBreakdownChart');
        if (monthlyBreakdownCtx) {
            this.charts.monthlyBreakdown = new Chart(monthlyBreakdownCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Faktúry vystavené',
                            data: [12, 15, 13, 18, 16, 20, 19, 21, 20, 23, 22, 24],
                            backgroundColor: '#667eea',
                            yAxisID: 'y'
                        },
                        {
                            label: 'Obrat (€)',
                            data: [850, 1200, 1100, 1400, 1300, 1500, 1450, 1600, 1550, 1700, 1650, 1800],
                            backgroundColor: '#4CAF50',
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Mesačné štatistiky'
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Počet faktúr'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Obrat (€)'
                            },
                            grid: {
                                drawOnChartArea: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return '€' + value;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Prediction chart (Reports page)
        const predictionCtx = document.getElementById('predictionChart');
        if (predictionCtx) {
            this.charts.prediction = new Chart(predictionCtx, {
                type: 'line',
                data: {
                    labels: ['Okt', 'Nov', 'Dec', 'Jan (P)', 'Feb (P)', 'Mar (P)', 'Apr (P)', 'Máj (P)', 'Jún (P)'],
                    datasets: [
                        {
                            label: 'Skutočné príjmy',
                            data: [1700, 1650, 1800, null, null, null, null, null, null],
                            borderColor: '#667eea',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 2
                        },
                        {
                            label: 'Predikcia príjmov',
                            data: [null, null, 1800, 1850, 1900, 1950, 2000, 2050, 2100],
                            borderColor: '#ff6384',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            borderDash: [5, 5],
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Optimistický scenár',
                            data: [null, null, 1800, 1950, 2100, 2200, 2300, 2400, 2500],
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.05)',
                            borderDash: [2, 2],
                            tension: 0.4,
                            fill: false
                        },
                        {
                            label: 'Pesimistický scenár',
                            data: [null, null, 1800, 1750, 1700, 1700, 1650, 1700, 1750],
                            borderColor: '#f44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.05)',
                            borderDash: [2, 2],
                            tension: 0.4,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Predikcia príjmov na nasledujúcich 6 mesiacov'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '€' + value;
                                }
                            }
                        }
                    }
                }
            });
        }

        console.log('Charts initialized');
    }

    // Show toast notification (modern replacement for alert)
    showNotification(title, message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) {
            console.error('Toast container not found');
            return;
        }

        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Auto dismiss after 4 seconds
        const dismissTimer = setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 4000);

        // Close button handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(dismissTimer);
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        });

        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    }

    // Initialize invoices page
    initInvoicesPage() {
        // Apply filters button
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyInvoiceFilters());
        }

        // Reset filters button
        const resetFiltersBtn = document.getElementById('resetFiltersBtn');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.resetInvoiceFilters());
        }

        // Bulk actions
        const selectAllCheckbox = document.getElementById('selectAllInvoices');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                document.querySelectorAll('.invoice-checkbox').forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
            });
        }

        const bulkMarkPaidBtn = document.getElementById('bulkMarkPaid');
        if (bulkMarkPaidBtn) {
            bulkMarkPaidBtn.addEventListener('click', () => this.bulkMarkAsPaid());
        }

        const bulkExportBtn = document.getElementById('bulkExport');
        if (bulkExportBtn) {
            bulkExportBtn.addEventListener('click', () => this.bulkExportInvoices());
        }

        // Load initial invoices
        this.loadInvoices();
    }

    // Load and display invoices
    loadInvoices() {
        // Generate more mock invoices for demonstration
        const allInvoices = [
            { id: 1, number: '2025-0042', type: 'Faktúra', clientId: 1, clientName: 'ACME s.r.o.', date: '27.10.2025', dueDate: '10.11.2025', base: 1000, vat: 200, total: 1200, status: 'paid' },
            { id: 2, number: '2025-0041', type: 'Faktúra', clientId: 2, clientName: 'Tech Solutions s.r.o.', date: '25.10.2025', dueDate: '08.11.2025', base: 2916.67, vat: 583.33, total: 3500, status: 'issued' },
            { id: 3, number: '2025-0040', type: 'Faktúra', clientId: 3, clientName: 'Digital Marketing s.r.o.', date: '20.10.2025', dueDate: '03.11.2025', base: 708.33, vat: 141.67, total: 850, status: 'overdue' },
            { id: 4, number: '2025-0039', type: 'Faktúra', clientId: 4, clientName: 'StartUp XYZ', date: '15.10.2025', dueDate: '29.10.2025', base: 4333.33, vat: 866.67, total: 5200, status: 'paid' },
            { id: 5, number: '2025-0038', type: 'Zálohová faktúra', clientId: 1, clientName: 'ACME s.r.o.', date: '10.10.2025', dueDate: '24.10.2025', base: 1666.67, vat: 333.33, total: 2000, status: 'paid' },
            { id: 6, number: '2025-0037', type: 'Faktúra', clientId: 2, clientName: 'Tech Solutions s.r.o.', date: '05.10.2025', dueDate: '19.10.2025', base: 2083.33, vat: 416.67, total: 2500, status: 'issued' },
            { id: 7, number: '2025-0036', type: 'Dobropis', clientId: 3, clientName: 'Digital Marketing s.r.o.', date: '01.10.2025', dueDate: '15.10.2025', base: 416.67, vat: 83.33, total: 500, status: 'cancelled' },
            { id: 8, number: '2025-0035', type: 'Faktúra', clientId: 1, clientName: 'ACME s.r.o.', date: '28.09.2025', dueDate: '12.10.2025', base: 833.33, vat: 166.67, total: 1000, status: 'paid' }
        ];

        this.filteredInvoices = allInvoices;
        this.renderInvoices(allInvoices);
        this.updateInvoiceStats(allInvoices);
    }

    // Render invoices table
    renderInvoices(invoices) {
        const tbody = document.getElementById('invoicesTableBody');
        if (!tbody) return;

        if (invoices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 40px;">Žiadne faktúry neboli nájdené</td></tr>';
            return;
        }

        tbody.innerHTML = invoices.map(inv => `
            <tr>
                <td><input type="checkbox" class="invoice-checkbox" data-invoice-id="${inv.id}"></td>
                <td><strong>${inv.number}</strong></td>
                <td>${inv.type}</td>
                <td>${inv.clientName}</td>
                <td>${inv.date}</td>
                <td>${inv.dueDate}</td>
                <td>€${inv.base.toFixed(2)}</td>
                <td>€${inv.vat.toFixed(2)}</td>
                <td><strong>€${inv.total.toFixed(2)}</strong></td>
                <td><span class="badge badge-${this.getStatusClass(inv.status)}">${this.getStatusLabel(inv.status)}</span></td>
                <td>
                    <button class="btn btn-secondary btn-small" onclick="invoiceSystem.viewDocument('${inv.number}')">Zobraziť</button>
                    <button class="btn btn-secondary btn-small" onclick="invoiceSystem.downloadInvoice(${inv.id})">PDF</button>
                </td>
            </tr>
        `).join('');
    }

    // Update invoice statistics
    updateInvoiceStats(invoices) {
        const totalInvoices = invoices.length;
        const unpaidInvoices = invoices.filter(i => i.status === 'issued' || i.status === 'overdue').length;
        const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
        const thisMonthRevenue = invoices
            .filter(i => i.date.includes('10.2025') && i.status !== 'cancelled')
            .reduce((sum, i) => sum + i.total, 0);

        document.getElementById('totalInvoicesCount').textContent = totalInvoices;
        document.getElementById('unpaidInvoicesCount').textContent = unpaidInvoices;
        document.getElementById('overdueInvoicesCount').textContent = overdueInvoices;
        document.getElementById('thisMonthRevenue').textContent = '€' + thisMonthRevenue.toFixed(2);
    }

    // Render clients table
    renderClients() {
        const tbody = document.getElementById('clientsBody');
        if (!tbody) return;

        if (this.mockClients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">Žiadni klienti neboli nájdení</td></tr>';
            return;
        }

        tbody.innerHTML = this.mockClients.map(client => `
            <tr>
                <td><input type="checkbox" class="client-checkbox" data-id="${client.id}"></td>
                <td><strong>${client.name}</strong></td>
                <td>${client.ico}</td>
                <td>${client.icdph}</td>
                <td>${client.email}</td>
                <td>${client.invoiceCount}</td>
                <td>€${client.totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                <td>
                    <button class="btn btn-secondary btn-small" data-action="viewClient" data-client-id="${client.id}">Detail</button>
                </td>
            </tr>
        `).join('');

        // Add event listeners for checkboxes
        this.updateBulkDeleteButton('clients');
    }

    // Render products table
    renderProducts(products = null) {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        const productsToRender = products || this.mockProducts;

        if (productsToRender.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">Žiadne produkty neboli nájdené</td></tr>';
            return;
        }

        tbody.innerHTML = productsToRender.map(product => {
            const priceWithVat = product.price * (1 + product.vat / 100);
            const categoryLabel = product.category === 'service' ? 'Služba' : 'Tovar';
            return `
                <tr>
                    <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
                    <td><strong>${product.name}</strong></td>
                    <td><span class="badge badge-info">${categoryLabel}</span></td>
                    <td>${product.unit}</td>
                    <td>€${product.price.toFixed(2)}</td>
                    <td>${product.vat}%</td>
                    <td><strong>€${priceWithVat.toFixed(2)}</strong></td>
                    <td>-</td>
                    <td>
                        <button class="btn btn-secondary btn-small">Upraviť</button>
                        <button class="btn btn-danger btn-small">Zmazať</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Add event listeners for checkboxes
        this.updateBulkDeleteButton('products');
    }

    // Filter products
    filterProducts() {
        const search = document.getElementById('productSearch')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || '';

        let filtered = this.mockProducts.filter(product => {
            // Search filter
            if (search && !product.name.toLowerCase().includes(search)) {
                return false;
            }

            // Category filter
            if (category && product.category !== category) {
                return false;
            }

            return true;
        });

        this.renderProducts(filtered);
    }

    // Render projects table
    renderProjects(projects = null) {
        const tbody = document.getElementById('projectsTableBody');
        if (!tbody) return;

        const projectsToRender = projects || this.mockProjects;

        if (projectsToRender.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">Žiadne projekty neboli nájdené</td></tr>';
            return;
        }

        tbody.innerHTML = projectsToRender.map(project => {
            const statusLabel = project.status === 'in_progress' ? 'V procese' :
                               project.status === 'completed' ? 'Dokončený' : 'Aktívny';
            const statusClass = project.status === 'in_progress' ? 'warning' :
                               project.status === 'completed' ? 'success' : 'info';
            const deadline = new Date(project.deadline).toLocaleDateString('sk-SK');

            return `
                <tr>
                    <td><input type="checkbox" class="project-checkbox" data-id="${project.id}"></td>
                    <td><strong>${project.name}</strong></td>
                    <td>${project.clientName}</td>
                    <td><span class="badge badge-${statusClass}">${statusLabel}</span></td>
                    <td>€${project.budget.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                    <td>${project.workedHours}h / ${project.estimatedHours}h</td>
                    <td>${deadline}</td>
                    <td>
                        <button class="btn btn-secondary btn-small">Detail</button>
                        <button class="btn btn-primary btn-small">+ Čas</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Add event listeners for checkboxes
        this.updateBulkDeleteButton('projects');
    }

    // Filter projects
    filterProjects() {
        const search = document.getElementById('projectSearch')?.value.toLowerCase() || '';
        const status = document.getElementById('projectStatusFilter')?.value || '';

        let filtered = this.mockProjects.filter(project => {
            // Search filter
            if (search && !project.name.toLowerCase().includes(search) &&
                !project.clientName.toLowerCase().includes(search)) {
                return false;
            }

            // Status filter
            if (status && project.status !== status) {
                return false;
            }

            return true;
        });

        this.renderProjects(filtered);
    }

    // Update bulk delete button visibility
    updateBulkDeleteButton(type) {
        setTimeout(() => {
            const checkboxes = document.querySelectorAll(`.${type}-checkbox:checked`);
            const deleteBtn = document.getElementById(`bulkDelete${type.charAt(0).toUpperCase() + type.slice(1)}Btn`);
            if (deleteBtn) {
                deleteBtn.style.display = checkboxes.length > 0 ? 'inline-block' : 'none';
            }
        }, 50);
    }

    // Initialize bulk delete event listeners
    initBulkDelete() {
        // Products
        const selectAllProducts = document.getElementById('selectAllProducts');
        if (selectAllProducts) {
            selectAllProducts.addEventListener('change', (e) => {
                document.querySelectorAll('.product-checkbox').forEach(cb => {
                    cb.checked = e.target.checked;
                });
                this.updateBulkDeleteButton('products');
            });
        }

        const bulkDeleteProductsBtn = document.getElementById('bulkDeleteProductsBtn');
        if (bulkDeleteProductsBtn) {
            bulkDeleteProductsBtn.addEventListener('click', () => this.bulkDeleteProducts());
        }

        // Clients
        const selectAllClients = document.getElementById('selectAllClients');
        if (selectAllClients) {
            selectAllClients.addEventListener('change', (e) => {
                document.querySelectorAll('.client-checkbox').forEach(cb => {
                    cb.checked = e.target.checked;
                });
                this.updateBulkDeleteButton('clients');
            });
        }

        const bulkDeleteClientsBtn = document.getElementById('bulkDeleteClientsBtn');
        if (bulkDeleteClientsBtn) {
            bulkDeleteClientsBtn.addEventListener('click', () => this.bulkDeleteClients());
        }

        // Projects
        const selectAllProjects = document.getElementById('selectAllProjects');
        if (selectAllProjects) {
            selectAllProjects.addEventListener('change', (e) => {
                document.querySelectorAll('.project-checkbox').forEach(cb => {
                    cb.checked = e.target.checked;
                });
                this.updateBulkDeleteButton('projects');
            });
        }

        const bulkDeleteProjectsBtn = document.getElementById('bulkDeleteProjectsBtn');
        if (bulkDeleteProjectsBtn) {
            bulkDeleteProjectsBtn.addEventListener('click', () => this.bulkDeleteProjects());
        }

        // Add event delegation for individual checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('product-checkbox')) {
                this.updateBulkDeleteButton('products');
            } else if (e.target.classList.contains('client-checkbox')) {
                this.updateBulkDeleteButton('clients');
            } else if (e.target.classList.contains('project-checkbox')) {
                this.updateBulkDeleteButton('projects');
            }
        });
    }

    // Bulk delete products
    bulkDeleteProducts() {
        const selectedIds = Array.from(document.querySelectorAll('.product-checkbox:checked'))
            .map(cb => parseInt(cb.getAttribute('data-id')));

        if (selectedIds.length === 0) return;

        if (confirm(`Naozaj chcete zmazať ${selectedIds.length} produkt(ov)?`)) {
            this.mockProducts = this.mockProducts.filter(p => !selectedIds.includes(p.id));
            this.renderProducts();
            this.showNotification('Produkty zmazané', `${selectedIds.length} produkt(ov) bolo úspešne zmazaných.`, 'success');

            // Uncheck select all
            const selectAll = document.getElementById('selectAllProducts');
            if (selectAll) selectAll.checked = false;
        }
    }

    // Bulk delete clients
    bulkDeleteClients() {
        const selectedIds = Array.from(document.querySelectorAll('.client-checkbox:checked'))
            .map(cb => parseInt(cb.getAttribute('data-id')));

        if (selectedIds.length === 0) return;

        if (confirm(`Naozaj chcete zmazať ${selectedIds.length} klient(ov)?`)) {
            this.mockClients = this.mockClients.filter(c => !selectedIds.includes(c.id));
            this.renderClients();
            this.updateDashboard();
            this.showNotification('Klienti zmazaní', `${selectedIds.length} klient(ov) bolo úspešne zmazaných.`, 'success');

            // Uncheck select all
            const selectAll = document.getElementById('selectAllClients');
            if (selectAll) selectAll.checked = false;
        }
    }

    // Bulk delete projects
    bulkDeleteProjects() {
        const selectedIds = Array.from(document.querySelectorAll('.project-checkbox:checked'))
            .map(cb => parseInt(cb.getAttribute('data-id')));

        if (selectedIds.length === 0) return;

        if (confirm(`Naozaj chcete zmazať ${selectedIds.length} projekt(ov)?`)) {
            this.mockProjects = this.mockProjects.filter(p => !selectedIds.includes(p.id));
            this.renderProjects();
            this.showNotification('Projekty zmazané', `${selectedIds.length} projekt(ov) bolo úspešne zmazaných.`, 'success');

            // Uncheck select all
            const selectAll = document.getElementById('selectAllProjects');
            if (selectAll) selectAll.checked = false;
        }
    }

    // Apply invoice filters
    applyInvoiceFilters() {
        const search = document.getElementById('invoiceSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const clientFilter = document.getElementById('clientFilter')?.value || '';
        const dateFrom = document.getElementById('dateFrom')?.value || '';
        const dateTo = document.getElementById('dateTo')?.value || '';
        const amountFrom = parseFloat(document.getElementById('amountFrom')?.value) || 0;
        const amountTo = parseFloat(document.getElementById('amountTo')?.value) || Infinity;

        // Start with all invoices
        this.loadInvoices();

        let filtered = this.filteredInvoices.filter(invoice => {
            // Search filter
            if (search && !invoice.number.toLowerCase().includes(search) &&
                !invoice.clientName.toLowerCase().includes(search) &&
                !invoice.total.toString().includes(search)) {
                return false;
            }

            // Status filter
            if (statusFilter && invoice.status !== statusFilter) {
                return false;
            }

            // Client filter
            if (clientFilter && invoice.clientId.toString() !== clientFilter) {
                return false;
            }

            // Date range filter
            if (dateFrom && this.compareDates(invoice.date, dateFrom) < 0) {
                return false;
            }
            if (dateTo && this.compareDates(invoice.date, dateTo) > 0) {
                return false;
            }

            // Amount range filter
            if (invoice.total < amountFrom || invoice.total > amountTo) {
                return false;
            }

            return true;
        });

        this.filteredInvoices = filtered;
        this.renderInvoices(filtered);
        this.updateInvoiceStats(filtered);
        this.showNotification('Filtre aplikované', `Nájdených ${filtered.length} faktúr`, 'success');
    }

    // Reset invoice filters
    resetInvoiceFilters() {
        document.getElementById('invoiceSearch').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('clientFilter').value = '';
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('amountFrom').value = '';
        document.getElementById('amountTo').value = '';

        this.loadInvoices();
        this.showNotification('Filtre resetované', 'Všetky filtre boli zrušené', 'info');
    }

    // Helper: Compare dates in DD.MM.YYYY format
    compareDates(date1, date2) {
        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('.');
            return new Date(year, month - 1, day);
        };

        const d1 = parseDate(date1);
        const d2 = typeof date2 === 'string' && date2.includes('.') ? parseDate(date2) : new Date(date2);

        return d1 - d2;
    }

    // Get status CSS class
    getStatusClass(status) {
        const classes = {
            'draft': 'secondary',
            'issued': 'warning',
            'paid': 'success',
            'overdue': 'danger',
            'cancelled': 'secondary'
        };
        return classes[status] || 'secondary';
    }

    // Get status label
    getStatusLabel(status) {
        const labels = {
            'draft': 'Koncept',
            'issued': 'Vystavená',
            'paid': 'Uhradená',
            'overdue': 'Po splatnosti',
            'cancelled': 'Stornovaná'
        };
        return labels[status] || status;
    }

    // Bulk mark as paid
    bulkMarkAsPaid() {
        const checked = document.querySelectorAll('.invoice-checkbox:checked');
        if (checked.length === 0) {
            this.showNotification('Žiadny výber', 'Prosím vyberte aspoň jednu faktúru', 'warning');
            return;
        }

        console.log('API Endpoint: POST /api/v1/invoices/bulk-update');
        console.log('Marking as paid:', checked.length, 'invoices');

        this.showNotification('Faktúry označené', `${checked.length} faktúr bolo označených ako uhradené`, 'success');
    }

    // Bulk export invoices
    bulkExportInvoices() {
        const checked = document.querySelectorAll('.invoice-checkbox:checked');
        if (checked.length === 0) {
            this.showNotification('Žiadny výber', 'Prosím vyberte aspoň jednu faktúru', 'warning');
            return;
        }

        console.log('API Endpoint: POST /api/v1/invoices/bulk-export');
        console.log('Exporting:', checked.length, 'invoices');

        this.showNotification('Export faktúr', `${checked.length} faktúr bolo exportovaných`, 'success');
    }

    // Download single invoice
    downloadInvoice(invoiceId) {
        console.log('Downloading invoice:', invoiceId);
        console.log('API Endpoint: GET /api/v1/invoices/' + invoiceId + '/pdf');
        this.showNotification('PDF stiahnuté', 'Faktúra bola stiahnutá ako PDF', 'success');
    }

    // Initialize tax calculator
    initTaxCalculator() {
        const calculateBtn = document.getElementById('calculateTaxBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculateTax();
            });
        }

        // Update real expenses field visibility
        const expenseTypeRadios = document.querySelectorAll('input[name="expenseType"]');
        expenseTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const realExpensesGroup = document.getElementById('realExpensesGroup');
                if (realExpensesGroup) {
                    realExpensesGroup.style.display = e.target.value === 'skutocne' ? 'block' : 'none';
                }
            });
        });
    }

    // Calculate Slovak SZČO taxes
    calculateTax() {
        // Get input values
        const totalIncome = parseFloat(document.getElementById('totalIncome')?.value) || 0;
        const expenseType = document.querySelector('input[name="expenseType"]:checked')?.value || 'pausalne';
        const realExpenses = parseFloat(document.getElementById('realExpenses')?.value) || 0;
        const vatPayer = document.getElementById('vatPayer')?.checked || false;
        const taxBonus = document.getElementById('taxBonus')?.checked || false;
        const childrenCount = parseInt(document.getElementById('childrenCount')?.value) || 0;

        // Calculate expenses
        let expenses;
        if (expenseType === 'pausalne') {
            expenses = totalIncome * 0.40; // 40% paušálne výdavky
        } else {
            expenses = realExpenses;
        }

        // Tax base (income - expenses)
        const taxBase = Math.max(0, totalIncome - expenses);

        // Income tax calculation (19% for SZČO)
        const taxRate = 0.19;
        const nontaxableAmount = 5174.50; // Nezdaniteľná časť základu 2025
        const taxableIncome = Math.max(0, taxBase - nontaxableAmount);
        let incomeTax = taxableIncome * taxRate;

        // Tax bonus (€840/year per child under certain conditions)
        const bonusPerChild = 840;
        let taxBonusAmount = 0;
        if (taxBonus && childrenCount > 0) {
            taxBonusAmount = childrenCount * bonusPerChild;
            incomeTax = Math.max(0, incomeTax - taxBonusAmount);
        }

        // Social insurance (2025 rates for SZČO)
        const socialInsuranceBase = taxBase;
        const oldAgePension = socialInsuranceBase * 0.18; // Starobné poistenie
        const disabilityPension = socialInsuranceBase * 0.06; // Invalidné poistenie
        const guaranteeFund = socialInsuranceBase * 0.0025; // Garančné poistenie
        const reserveFund = socialInsuranceBase * 0.0475; // Rezervný fond solidarity
        const unemploymentInsurance = 0; // SZČO neplatí poistenie v nezamestnanosti
        const accidentInsurance = 0; // SZČO neplatí úrazové poistenie

        const totalSocialInsurance = oldAgePension + disabilityPension + guaranteeFund + reserveFund;

        // Health insurance (14% for SZČO)
        const healthInsurance = socialInsuranceBase * 0.14;

        // Total taxes and insurance
        const totalTaxes = incomeTax + totalSocialInsurance + healthInsurance;

        // Net income
        const netIncome = totalIncome - expenses - totalTaxes;
        const monthlyNet = netIncome / 12;

        // Display results
        this.displayTaxResults({
            totalIncome,
            expenses,
            expenseType,
            taxBase,
            taxRate,
            nontaxableAmount,
            taxableIncome,
            incomeTax,
            taxBonusAmount,
            childrenCount,
            oldAgePension,
            disabilityPension,
            guaranteeFund,
            reserveFund,
            totalSocialInsurance,
            healthInsurance,
            totalTaxes,
            netIncome,
            monthlyNet,
            vatPayer
        });

        this.showNotification('Dane vypočítané', 'Výpočet daní bol úspešne dokončený', 'success');
    }

    // Display tax calculation results
    displayTaxResults(data) {
        const resultsDiv = document.getElementById('taxResults');
        if (!resultsDiv) return;

        resultsDiv.innerHTML = `
            <div class="card" style="margin-bottom: 20px;">
                <h3>Základ dane</h3>
                <div style="display: grid; gap: 10px;">
                    <div class="stat-row">
                        <span>Celkové príjmy:</span>
                        <strong>€${data.totalIncome.toFixed(2)}</strong>
                    </div>
                    <div class="stat-row">
                        <span>Výdavky (${data.expenseType === 'pausalne' ? 'paušálne 40%' : 'skutočné'}):</span>
                        <strong>- €${data.expenses.toFixed(2)}</strong>
                    </div>
                    <div class="stat-row" style="border-top: 2px solid #667eea; padding-top: 10px; margin-top: 10px;">
                        <span>Základ dane:</span>
                        <strong style="color: #667eea; font-size: 1.2em;">€${data.taxBase.toFixed(2)}</strong>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <h3>Daň z príjmov (19%)</h3>
                <div style="display: grid; gap: 10px;">
                    <div class="stat-row">
                        <span>Základ dane:</span>
                        <span>€${data.taxBase.toFixed(2)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Nezdaniteľná časť:</span>
                        <span>- €${data.nontaxableAmount.toFixed(2)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Zdaniteľný príjem:</span>
                        <span>€${data.taxableIncome.toFixed(2)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Daň (19%):</span>
                        <span>€${(data.taxableIncome * data.taxRate).toFixed(2)}</span>
                    </div>
                    ${data.taxBonusAmount > 0 ? `
                    <div class="stat-row" style="color: #4CAF50;">
                        <span>Daňový bonus (${data.childrenCount} ${data.childrenCount === 1 ? 'dieťa' : 'deti'}):</span>
                        <span>- €${data.taxBonusAmount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div class="stat-row" style="border-top: 2px solid #667eea; padding-top: 10px; margin-top: 10px;">
                        <span>Daň z príjmov celkom:</span>
                        <strong style="color: #667eea;">€${data.incomeTax.toFixed(2)}</strong>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <h3>Sociálne poistenie</h3>
                <div style="display: grid; gap: 10px;">
                    <div class="stat-row">
                        <span>Starobné poistenie (18%):</span>
                        <span>€${data.oldAgePension.toFixed(2)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Invalidné poistenie (6%):</span>
                        <span>€${data.disabilityPension.toFixed(2)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Garančné poistenie (0.25%):</span>
                        <span>€${data.guaranteeFund.toFixed(2)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Rezervný fond (4.75%):</span>
                        <span>€${data.reserveFund.toFixed(2)}</span>
                    </div>
                    <div class="stat-row" style="border-top: 2px solid #667eea; padding-top: 10px; margin-top: 10px;">
                        <span>Sociálne poistenie celkom:</span>
                        <strong style="color: #667eea;">€${data.totalSocialInsurance.toFixed(2)}</strong>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <h3>Zdravotné poistenie</h3>
                <div style="display: grid; gap: 10px;">
                    <div class="stat-row">
                        <span>Zdravotné poistenie (14%):</span>
                        <strong style="color: #667eea;">€${data.healthInsurance.toFixed(2)}</strong>
                    </div>
                </div>
            </div>

            <div class="tax-summary">
                <h2 style="margin-bottom: 20px; text-align: center;">Celkový prehľad</h2>
                <div class="summary-cards">
                    <div class="summary-card">
                        <div class="summary-label">Celkové príjmy</div>
                        <div class="summary-value">€${data.totalIncome.toFixed(2)}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-label">Celkové dane</div>
                        <div class="summary-value">€${data.totalTaxes.toFixed(2)}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-label">Čistý príjem</div>
                        <div class="summary-value">€${data.netIncome.toFixed(2)}</div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px; font-size: 1.1em;">
                    <strong>Mesačný čistý príjem: €${data.monthlyNet.toFixed(2)}</strong>
                </div>
            </div>

            <div style="margin-top: 30px;">
                <canvas id="taxBreakdownChart" style="max-height: 400px;"></canvas>
            </div>
        `;

        // Create tax breakdown chart
        this.createTaxBreakdownChart(data);

        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Create tax breakdown pie chart
    createTaxBreakdownChart(data) {
        const ctx = document.getElementById('taxBreakdownChart');
        if (!ctx || typeof Chart === 'undefined') return;

        // Destroy existing chart if exists
        if (this.charts.taxBreakdown) {
            this.charts.taxBreakdown.destroy();
        }

        this.charts.taxBreakdown = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Čistý príjem',
                    'Daň z príjmov',
                    'Sociálne poistenie',
                    'Zdravotné poistenie',
                    'Výdavky'
                ],
                datasets: [{
                    data: [
                        data.netIncome,
                        data.incomeTax,
                        data.totalSocialInsurance,
                        data.healthInsurance,
                        data.expenses
                    ],
                    backgroundColor: [
                        '#4CAF50',
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: €${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize dark mode
    initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) return;

        // Load dark mode preference
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            darkModeToggle.textContent = isDark ? '☀️' : '🌙';

            // Auto-save to IndexedDB if available
            if (window.invoiceDB && window.invoiceDB.db) {
                window.invoiceDB.saveSetting('darkMode', isDark.toString())
                    .catch(err => console.error('Error saving darkMode to IndexedDB:', err));
            }

            this.showNotification(
                isDark ? 'Tmavý režim zapnutý' : 'Svetlý režim zapnutý',
                isDark ? 'Prepli ste sa na tmavý režim' : 'Prepli ste sa na svetlý režim',
                'success'
            );
        });

        console.log('Dark mode initialized:', darkMode);
    }

    // Initialize IndexedDB
    async initDatabase() {
        if (!window.indexedDB) {
            console.warn('IndexedDB not available, using localStorage fallback');
            return;
        }

        try {
            await window.invoiceDB.init();
            console.log('IndexedDB initialized successfully');

            // Migrate data from localStorage if needed
            const migrated = localStorage.getItem('dbMigrated');
            if (!migrated) {
                await window.invoiceDB.migrateFromLocalStorage();
                localStorage.setItem('dbMigrated', 'true');
                console.log('Data migrated to IndexedDB');
            }

            // Load companies from IndexedDB
            await this.loadCompaniesFromDB();
        } catch (error) {
            console.error('Failed to initialize IndexedDB:', error);
            console.log('Falling back to localStorage');
        }
    }

    // Send invoice email
    sendInvoiceEmail(invoiceNumber) {
        const invoice = this.filteredInvoices.find(inv => inv.number === invoiceNumber) ||
                       this.mockInvoices.find(inv => inv.number === invoiceNumber);

        if (invoice) {
            const client = this.mockClients.find(c => c.id === invoice.clientId);
            const company = this.companies.find(c => c.id === this.currentCompanyId);

            document.getElementById('emailTo').value = client ? client.email : '';
            document.getElementById('emailSubject').value = 'Faktúra ' + invoiceNumber + ' - ' + (client ? client.name : '');
            document.getElementById('emailBody').value = 'Dobrý deň,\n\nv prílohe Vám zasielame faktúru číslo ' + invoiceNumber + ' s dátumom splatnosti ' + (invoice.dueDate || 'neuvedený') + '.\n\nCelková suma: €' + (invoice.total ? invoice.total.toFixed(2) : (invoice.amount ? invoice.amount.toFixed(2) : '0.00')) + '\n\nĎakujeme za spoluprácu.\n\nS pozdravom,\n' + company.name;
        }

        this.openModal('sendEmailModal');
    }

    // Initialize email functionality
    initEmailFunctions() {
        const sendEmailForm = document.getElementById('sendEmailForm');
        if (sendEmailForm) {
            sendEmailForm.addEventListener('submit', (e) => this.handleSendEmail(e));
        }

        const emailSettingsForm = document.getElementById('emailSettingsForm');
        if (emailSettingsForm) {
            emailSettingsForm.addEventListener('submit', (e) => this.saveEmailSettings(e));
        }
    }

    // Handle send email
    handleSendEmail(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const emailData = {
            to: formData.get('emailTo'),
            cc: formData.get('emailCc'),
            subject: formData.get('emailSubject'),
            body: formData.get('emailBody'),
            attachPdf: formData.get('attachPdf') === 'on',
            sendCopyToSelf: formData.get('sendCopyToSelf') === 'on'
        };

        console.log('Sending email:', emailData);
        console.log('API Endpoint: POST /api/v1/emails/send');

        setTimeout(() => {
            this.showNotification(
                'Email odoslaný',
                'Faktúra bola úspešne odoslaná na ' + emailData.to,
                'success'
            );
            this.closeModal('sendEmailModal');
            e.target.reset();

            console.log('Email saved to history:', {
                ...emailData,
                sentAt: new Date().toISOString(),
                status: 'sent'
            });
        }, 1000);
    }

    // Save email settings
    saveEmailSettings(e) {
        e.preventDefault();
        console.log('Saving email settings');
        console.log('API Endpoint: PUT /api/v1/settings/email');
        this.showNotification('Nastavenia uložené', 'Email nastavenia boli úspešne uložené.', 'success');
    }

    // Send payment reminder
    sendPaymentReminder(invoiceNumber) {
        const invoice = this.filteredInvoices.find(inv => inv.number === invoiceNumber) ||
                       this.mockInvoices.find(inv => inv.number === invoiceNumber);

        if (invoice) {
            const client = this.mockClients.find(c => c.id === invoice.clientId);
            const company = this.companies.find(c => c.id === this.currentCompanyId);

            const dueDate = new Date(invoice.dueDate.split('.').reverse().join('-'));
            const today = new Date();
            const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

            const emailData = {
                to: client ? client.email : '',
                subject: 'Upomienka - Faktúra ' + invoiceNumber + ' po splatnosti',
                body: 'Dobrý deň,\n\nupozorňujeme Vás, že faktúra číslo ' + invoiceNumber + ' so splatnosťou ' + invoice.dueDate + ' je ' + daysOverdue + ' dní po splatnosti.\n\nCelková suma: €' + (invoice.total ? invoice.total.toFixed(2) : (invoice.amount ? invoice.amount.toFixed(2) : '0.00')) + '\n\nProsíme o úhradu v najbližších dňoch.\n\nS pozdravom,\n' + company.name
            };

            console.log('Sending payment reminder:', emailData);
            console.log('API Endpoint: POST /api/v1/emails/send-reminder');

            this.showNotification(
                'Upomienka odoslaná',
                'Upomienka bola odoslaná na ' + emailData.to,
                'success'
            );
        }
    }

    // Match bank transaction with invoice
    matchTransaction(transactionId) {
        console.log('Matching transaction:', transactionId);
        console.log('API Endpoint: POST /api/v1/bank/match-transaction');

        this.showNotification(
            'Transakcia spárovaná',
            'Bankové transakcia bola úspešne spárovaná s faktúrou',
            'success'
        );

        // In production, this would open a modal to select invoice
        // and update the transaction status in the database
    }

    // Update Dashboard Statistics
    updateDashboard() {
        // Calculate total revenue from all invoices
        const totalRevenue = this.mockInvoices.reduce((sum, inv) => sum + (inv.amount || inv.total || 0), 0);

        // Count invoices
        const totalInvoices = this.mockInvoices.length;
        const unpaidInvoices = this.mockInvoices.filter(i => i.status === 'issued' || i.status === 'overdue').length;
        const overdueInvoices = this.mockInvoices.filter(i => i.status === 'overdue').length;

        // Calculate overdue amount
        const overdueAmount = this.mockInvoices
            .filter(i => i.status === 'overdue')
            .reduce((sum, i) => sum + (i.amount || i.total || 0), 0);

        // Client stats
        const totalClients = this.mockClients.length;

        // Update DOM
        const dashTotalRevenue = document.getElementById('dashTotalRevenue');
        if (dashTotalRevenue) dashTotalRevenue.textContent = '€' + totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        const dashTotalInvoices = document.getElementById('dashTotalInvoices');
        if (dashTotalInvoices) dashTotalInvoices.textContent = totalInvoices;

        const dashUnpaidCount = document.getElementById('dashUnpaidCount');
        if (dashUnpaidCount) dashUnpaidCount.textContent = unpaidInvoices + ' neuhradených';

        const dashOverdueCount = document.getElementById('dashOverdueCount');
        if (dashOverdueCount) dashOverdueCount.textContent = overdueInvoices;

        const dashOverdueAmount = document.getElementById('dashOverdueAmount');
        if (dashOverdueAmount) dashOverdueAmount.textContent = '€' + overdueAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' celkom';

        const dashTotalClients = document.getElementById('dashTotalClients');
        if (dashTotalClients) dashTotalClients.textContent = totalClients;

        const dashRevenueChange = document.getElementById('dashRevenueChange');
        if (dashRevenueChange) dashRevenueChange.textContent = 'Aktuálny stav';

        const dashNewClients = document.getElementById('dashNewClients');
        if (dashNewClients) dashNewClients.textContent = 'Celkovo';
    }

    // Initialize Keyboard Shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+N - New Invoice
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openModal('invoiceModal');
            }

            // Ctrl+K - New Client
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.openModal('clientModal');
            }

            // Ctrl+P - New Product
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.openModal('productModal');
            }

            // Ctrl+Shift+P - New Project
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.openModal('projectModal');
            }

            // Escape - Close modal
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.active');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }

            // / (slash) - Focus search
            if (e.key === '/' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                if (this.currentPage === 'invoices') {
                    document.getElementById('invoiceSearch')?.focus();
                } else if (this.currentPage === 'clients') {
                    document.getElementById('clientSearch')?.focus();
                } else if (this.currentPage === 'products') {
                    document.getElementById('productSearch')?.focus();
                } else if (this.currentPage === 'projects') {
                    document.getElementById('projectSearch')?.focus();
                }
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.invoiceSystem = new InvoiceSystem();
});

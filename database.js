// IndexedDB Database Manager
class DatabaseManager {
    constructor() {
        this.dbName = 'InvoiceSystemDB';
        this.version = 1;
        this.db = null;
    }

    // Initialize database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Companies store
                if (!db.objectStoreNames.contains('companies')) {
                    const companyStore = db.createObjectStore('companies', { keyPath: 'id', autoIncrement: true });
                    companyStore.createIndex('name', 'name', { unique: false });
                    companyStore.createIndex('ico', 'ico', { unique: true });
                }

                // Clients store
                if (!db.objectStoreNames.contains('clients')) {
                    const clientStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
                    clientStore.createIndex('companyId', 'companyId', { unique: false });
                    clientStore.createIndex('name', 'name', { unique: false });
                    clientStore.createIndex('ico', 'ico', { unique: false });
                }

                // Invoices store
                if (!db.objectStoreNames.contains('invoices')) {
                    const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id', autoIncrement: true });
                    invoiceStore.createIndex('companyId', 'companyId', { unique: false });
                    invoiceStore.createIndex('clientId', 'clientId', { unique: false });
                    invoiceStore.createIndex('number', 'number', { unique: true });
                    invoiceStore.createIndex('status', 'status', { unique: false });
                    invoiceStore.createIndex('date', 'date', { unique: false });
                }

                // Products/Services store
                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
                    productStore.createIndex('companyId', 'companyId', { unique: false });
                    productStore.createIndex('name', 'name', { unique: false });
                    productStore.createIndex('category', 'category', { unique: false });
                }

                // Expenses store
                if (!db.objectStoreNames.contains('expenses')) {
                    const expenseStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
                    expenseStore.createIndex('companyId', 'companyId', { unique: false });
                    expenseStore.createIndex('date', 'date', { unique: false });
                    expenseStore.createIndex('category', 'category', { unique: false });
                }

                // Recurring invoices store
                if (!db.objectStoreNames.contains('recurringInvoices')) {
                    const recurringStore = db.createObjectStore('recurringInvoices', { keyPath: 'id', autoIncrement: true });
                    recurringStore.createIndex('companyId', 'companyId', { unique: false });
                    recurringStore.createIndex('frequency', 'frequency', { unique: false });
                    recurringStore.createIndex('active', 'active', { unique: false });
                }

                // Projects store
                if (!db.objectStoreNames.contains('projects')) {
                    const projectStore = db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
                    projectStore.createIndex('companyId', 'companyId', { unique: false });
                    projectStore.createIndex('clientId', 'clientId', { unique: false });
                    projectStore.createIndex('status', 'status', { unique: false });
                }

                // Time entries store
                if (!db.objectStoreNames.contains('timeEntries')) {
                    const timeStore = db.createObjectStore('timeEntries', { keyPath: 'id', autoIncrement: true });
                    timeStore.createIndex('projectId', 'projectId', { unique: false });
                    timeStore.createIndex('date', 'date', { unique: false });
                }

                // Bank transactions store
                if (!db.objectStoreNames.contains('bankTransactions')) {
                    const bankStore = db.createObjectStore('bankTransactions', { keyPath: 'id', autoIncrement: true });
                    bankStore.createIndex('companyId', 'companyId', { unique: false });
                    bankStore.createIndex('date', 'date', { unique: false });
                    bankStore.createIndex('matched', 'matched', { unique: false });
                }

                // Settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }

                console.log('Database setup complete');
            };
        });
    }

    // Generic CRUD operations
    async add(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName, id) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, id) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getByIndex(storeName, indexName, value) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const request = index.getAll(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Migrate data from localStorage to IndexedDB
    async migrateFromLocalStorage() {
        console.log('Starting migration from localStorage...');

        // Migrate companies
        const companiesData = localStorage.getItem('invoiceSystemCompanies');
        if (companiesData) {
            const companies = JSON.parse(companiesData);
            for (const company of companies) {
                try {
                    await this.add('companies', company);
                } catch (error) {
                    console.log('Company already exists or error:', error);
                }
            }
            console.log('Companies migrated:', companies.length);
        }

        // Migrate current company ID to settings
        const currentCompanyId = localStorage.getItem('currentCompanyId');
        if (currentCompanyId) {
            await this.update('settings', { key: 'currentCompanyId', value: parseInt(currentCompanyId) });
        }

        console.log('Migration complete');
    }

    // Export database to JSON
    async exportToJSON() {
        const data = {};
        const storeNames = ['companies', 'clients', 'invoices', 'products', 'expenses', 'recurringInvoices', 'projects', 'timeEntries', 'bankTransactions', 'settings'];

        for (const storeName of storeNames) {
            data[storeName] = await this.getAll(storeName);
        }

        return JSON.stringify(data, null, 2);
    }

    // Import database from JSON
    async importFromJSON(jsonData) {
        const data = JSON.parse(jsonData);

        for (const [storeName, items] of Object.entries(data)) {
            if (Array.isArray(items)) {
                for (const item of items) {
                    await this.add(storeName, item);
                }
            }
        }

        console.log('Import complete');
    }
}

// Export singleton instance
window.db = new DatabaseManager();

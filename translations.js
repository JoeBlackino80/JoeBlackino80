// Multi-language translations
const translations = {
    sk: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.invoices': 'Faktúry',
        'nav.clients': 'Klienti',
        'nav.products': 'Produkty',
        'nav.projects': 'Projekty',
        'nav.vat': 'DPH',
        'nav.bank': 'Banka',
        'nav.calculator': 'Kalkulátor',
        'nav.reports': 'Reporty',
        'nav.settings': 'Nastavenia',

        // Common
        'common.save': 'Uložiť',
        'common.cancel': 'Zrušiť',
        'common.delete': 'Zmazať',
        'common.edit': 'Upraviť',
        'common.add': 'Pridať',
        'common.search': 'Hľadať',
        'common.filter': 'Filtrovať',
        'common.export': 'Exportovať',
        'common.import': 'Importovať',
        'common.download': 'Stiahnuť',
        'common.send': 'Odoslať',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.revenue': 'Obrat',
        'dashboard.invoices': 'Faktúry',
        'dashboard.clients': 'Klienti',
        'dashboard.overdue': 'Po splatnosti',

        // Invoices
        'invoices.title': 'Faktúry',
        'invoices.new': 'Nová faktúra',
        'invoices.number': 'Číslo faktúry',
        'invoices.client': 'Klient',
        'invoices.date': 'Dátum',
        'invoices.dueDate': 'Splatnosť',
        'invoices.amount': 'Suma',
        'invoices.status': 'Stav',

        // Settings
        'settings.title': 'Nastavenia',
        'settings.language': 'Jazyk',
        'settings.currency': 'Mena',
        'settings.dateFormat': 'Formát dátumu',
        'settings.darkMode': 'Tmavý režim',

        // Messages
        'msg.saved': 'Uložené',
        'msg.deleted': 'Zmazané',
        'msg.error': 'Chyba',
        'msg.success': 'Úspech'
    },

    cz: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.invoices': 'Faktury',
        'nav.clients': 'Klienti',
        'nav.products': 'Produkty',
        'nav.projects': 'Projekty',
        'nav.vat': 'DPH',
        'nav.bank': 'Banka',
        'nav.calculator': 'Kalkulačka',
        'nav.reports': 'Reporty',
        'nav.settings': 'Nastavení',

        // Common
        'common.save': 'Uložit',
        'common.cancel': 'Zrušit',
        'common.delete': 'Smazat',
        'common.edit': 'Upravit',
        'common.add': 'Přidat',
        'common.search': 'Hledat',
        'common.filter': 'Filtrovat',
        'common.export': 'Exportovat',
        'common.import': 'Importovat',
        'common.download': 'Stáhnout',
        'common.send': 'Odeslat',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.revenue': 'Obrat',
        'dashboard.invoices': 'Faktury',
        'dashboard.clients': 'Klienti',
        'dashboard.overdue': 'Po splatnosti',

        // Invoices
        'invoices.title': 'Faktury',
        'invoices.new': 'Nová faktura',
        'invoices.number': 'Číslo faktury',
        'invoices.client': 'Klient',
        'invoices.date': 'Datum',
        'invoices.dueDate': 'Splatnost',
        'invoices.amount': 'Částka',
        'invoices.status': 'Stav',

        // Settings
        'settings.title': 'Nastavení',
        'settings.language': 'Jazyk',
        'settings.currency': 'Měna',
        'settings.dateFormat': 'Formát data',
        'settings.darkMode': 'Tmavý režim',

        // Messages
        'msg.saved': 'Uloženo',
        'msg.deleted': 'Smazáno',
        'msg.error': 'Chyba',
        'msg.success': 'Úspěch'
    },

    en: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.invoices': 'Invoices',
        'nav.clients': 'Clients',
        'nav.products': 'Products',
        'nav.projects': 'Projects',
        'nav.vat': 'VAT',
        'nav.bank': 'Bank',
        'nav.calculator': 'Calculator',
        'nav.reports': 'Reports',
        'nav.settings': 'Settings',

        // Common
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.export': 'Export',
        'common.import': 'Import',
        'common.download': 'Download',
        'common.send': 'Send',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.revenue': 'Revenue',
        'dashboard.invoices': 'Invoices',
        'dashboard.clients': 'Clients',
        'dashboard.overdue': 'Overdue',

        // Invoices
        'invoices.title': 'Invoices',
        'invoices.new': 'New Invoice',
        'invoices.number': 'Invoice Number',
        'invoices.client': 'Client',
        'invoices.date': 'Date',
        'invoices.dueDate': 'Due Date',
        'invoices.amount': 'Amount',
        'invoices.status': 'Status',

        // Settings
        'settings.title': 'Settings',
        'settings.language': 'Language',
        'settings.currency': 'Currency',
        'settings.dateFormat': 'Date Format',
        'settings.darkMode': 'Dark Mode',

        // Messages
        'msg.saved': 'Saved',
        'msg.deleted': 'Deleted',
        'msg.error': 'Error',
        'msg.success': 'Success'
    }
};

// Translation helper
function t(key, lang = 'sk') {
    const currentLang = localStorage.getItem('language') || lang;
    return translations[currentLang][key] || translations['sk'][key] || key;
}

window.translations = translations;
window.t = t;

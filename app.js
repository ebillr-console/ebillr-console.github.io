// Country and currency data
const countries = [
    { code: 'in', name: 'India', currency: 'INR', symbol: '₹' },
    { code: 'us', name: 'United States', currency: 'USD', symbol: '$' },
    { code: 'gb', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
    { code: 'ca', name: 'Canada', currency: 'CAD', symbol: 'C$' },
    { code: 'au', name: 'Australia', currency: 'AUD', symbol: 'A$' },
    { code: 'de', name: 'Germany', currency: 'EUR', symbol: '€' },
    { code: 'fr', name: 'France', currency: 'EUR', symbol: '€' },
    { code: 'jp', name: 'Japan', currency: 'JPY', symbol: '¥' },
    { code: 'cn', name: 'China', currency: 'CNY', symbol: '¥' },
    { code: 'br', name: 'Brazil', currency: 'BRL', symbol: 'R$' },
    { code: 'mx', name: 'Mexico', currency: 'MXN', symbol: '$' },
    { code: 'ru', name: 'Russia', currency: 'RUB', symbol: '₽' },
    { code: 'kr', name: 'South Korea', currency: 'KRW', symbol: '₩' },
    { code: 'sa', name: 'Saudi Arabia', currency: 'SAR', symbol: 'ر.س' },
    { code: 'ae', name: 'United Arab Emirates', currency: 'AED', symbol: 'د.إ' },
    { code: 'sg', name: 'Singapore', currency: 'SGD', symbol: '$' },
    { code: 'ch', name: 'Switzerland', currency: 'CHF', symbol: 'CHF' },
    { code: 'se', name: 'Sweden', currency: 'SEK', symbol: 'kr' },
    { code: 'no', name: 'Norway', currency: 'NOK', symbol: 'kr' },
    { code: 'dk', name: 'Denmark', currency: 'DKK', symbol: 'kr' }
];

// Data Manager for cross-page communication
class DataManager {
    constructor() {
        this.storageKey = 'ebilir_settings';
        this.defaultSettings = {
            country: 'in',
            currency: 'INR',
            theme: 'light',
            timeRange: '7d',
            axisRange: '1000',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            invoiceFields: {
                name: true,
                price: true,
                weight: true,
                quantity: true
            }
        };
    }

    // Get all settings
    getSettings() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : { ...this.defaultSettings };
    }

    // Save all settings
    saveSettings(settings) {
        localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }

    // Update specific setting
    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.saveSettings(settings);
        return settings;
    }

    // Get specific setting
    getSetting(key) {
        const settings = this.getSettings();
        return settings[key];
    }

    // Get currency symbol for dashboard
    getCurrencySymbol() {
        const country = this.getSetting('country');
        const countryData = countries.find(c => c.code === country);
        return countryData ? countryData.symbol : '₹';
    }

    // Check if invoice field is enabled
    isInvoiceFieldEnabled(fieldName) {
        const invoiceFields = this.getSetting('invoiceFields');
        return invoiceFields[fieldName];
    }
}

// Create global instance
const dataManager = new DataManager();

// Mobile menu functionality
class MobileMenu {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.sidebar = document.getElementById('sidebar');
        this.mobileOverlay = document.getElementById('mobileOverlay');

        this.init();
    }

    init() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMenu());
        }
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => this.closeMenu());
        }
    }

    toggleMenu() {
        this.sidebar.classList.toggle('mobile-open');
        this.mobileOverlay.classList.toggle('mobile-open');
    }

    closeMenu() {
        this.sidebar.classList.remove('mobile-open');
        this.mobileOverlay.classList.remove('mobile-open');
    }
}

// Theme management
class ThemeManager {
    constructor() {
        this.modalThemeToggle = document.getElementById('modalThemeToggle');
        this.modalThemeIcon = document.getElementById('modalThemeIcon');
        this.modalThemeText = document.getElementById('modalThemeText');

        this.init();
    }

    init() {
        // Apply saved theme
        const savedTheme = dataManager.getSetting('theme') || this.detectSystemTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        // Event listeners
        if (this.modalThemeToggle) {
            this.modalThemeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!dataManager.getSetting('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                this.updateThemeIcon(newTheme);
                dataManager.updateSetting('theme', newTheme);
            }
        });
    }

    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        dataManager.updateSetting('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        if (theme === 'dark') {
            this.modalThemeIcon.setAttribute('data-lucide', 'sun');
            this.modalThemeText.textContent = 'Switch To Light Theme';
        } else {
            this.modalThemeIcon.setAttribute('data-lucide', 'moon');
            this.modalThemeText.textContent = 'Switch To Dark Theme';
        }
        lucide.createIcons();
    }
}

// Settings management
class SettingsManager {
    constructor() {
        this.countrySelect = document.getElementById('countrySelect');
        this.currencySelect = document.getElementById('currencySelect');
        this.cancelSettings = document.getElementById('cancelSettings');
        this.saveSettings = document.getElementById('saveSettings');
        this.logoutBtn = document.getElementById('logoutBtn');

        this.init();
    }

    init() {
        this.populateCountrySelect();
        this.loadAllSettings();
        this.setupEventListeners();
    }

    populateCountrySelect() {
        if (this.countrySelect) {
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = country.name;
                this.countrySelect.appendChild(option);
            });
        }
    }

    updateCurrencyOptions(countryCode) {
        if (this.currencySelect) {
            this.currencySelect.innerHTML = '';
            const selectedCountry = countries.find(c => c.code === countryCode);
            if (selectedCountry) {
                const option = document.createElement('option');
                option.value = selectedCountry.currency;
                option.textContent = `${selectedCountry.currency} (${selectedCountry.symbol})`;
                this.currencySelect.appendChild(option);
            }
        }
    }

    setupEventListeners() {
        if (this.countrySelect) {
            this.countrySelect.addEventListener('change', () => {
                const countryCode = this.countrySelect.value;
                this.updateCurrencyOptions(countryCode);
            });
        }

        if (this.cancelSettings) {
            this.cancelSettings.addEventListener('click', () => {
                this.loadAllSettings();
                alert('Changes discarded');
            });
        }

        if (this.saveSettings) {
            this.saveSettings.addEventListener('click', () => {
                this.saveAllSettings();
                alert('Settings saved successfully!');
            });
        }

        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to log out?')) {
                    alert('Logout functionality would be implemented here');
                }
            });
        }
    }

    loadAllSettings() {
        const settings = dataManager.getSettings();

        // Load country and currency
        if (this.countrySelect) {
            this.countrySelect.value = settings.country;
            this.updateCurrencyOptions(settings.country);
        }

        // Load other settings
        const timeRangeSelect = document.getElementById('defaultTimeRange');
        const axisRangeSelect = document.getElementById('defaultAxisRange');
        const dateFormatSelect = document.getElementById('dateFormatSelect');
        const timeFormatSelect = document.getElementById('timeFormatSelect');

        if (timeRangeSelect) timeRangeSelect.value = settings.timeRange;
        if (axisRangeSelect) axisRangeSelect.value = settings.axisRange;
        if (dateFormatSelect) dateFormatSelect.value = settings.dateFormat;
        if (timeFormatSelect) timeFormatSelect.value = settings.timeFormat;

        // Load invoice fields
        const fieldName = document.getElementById('fieldName');
        const fieldPrice = document.getElementById('fieldPrice');
        const fieldWeight = document.getElementById('fieldWeight');
        const fieldQuantity = document.getElementById('fieldQuantity');

        if (fieldName) fieldName.checked = settings.invoiceFields.name;
        if (fieldPrice) fieldPrice.checked = settings.invoiceFields.price;
        if (fieldWeight) fieldWeight.checked = settings.invoiceFields.weight;
        if (fieldQuantity) fieldQuantity.checked = settings.invoiceFields.quantity;

        // Load theme
        document.documentElement.setAttribute('data-theme', settings.theme);
    }

    saveAllSettings() {
        const settings = {
            country: this.countrySelect ? this.countrySelect.value : 'in',
            currency: this.currencySelect ? this.currencySelect.value : 'INR',
            theme: document.documentElement.getAttribute('data-theme'),
            timeRange: document.getElementById('defaultTimeRange') ? document.getElementById('defaultTimeRange').value : '7d',
            axisRange: document.getElementById('defaultAxisRange') ? document.getElementById('defaultAxisRange').value : '1000',
            dateFormat: document.getElementById('dateFormatSelect') ? document.getElementById('dateFormatSelect').value : 'MM/DD/YYYY',
            timeFormat: document.getElementById('timeFormatSelect') ? document.getElementById('timeFormatSelect').value : '12h',
            invoiceFields: {
                name: document.getElementById('fieldName') ? document.getElementById('fieldName').checked : true,
                price: document.getElementById('fieldPrice') ? document.getElementById('fieldPrice').checked : true,
                weight: document.getElementById('fieldWeight') ? document.getElementById('fieldWeight').checked : true,
                quantity: document.getElementById('fieldQuantity') ? document.getElementById('fieldQuantity').checked : true
            }
        };

        dataManager.saveSettings(settings);
    }
}

// Dashboard integration
class DashboardIntegration {
    constructor() {
        this.init();
    }

    init() {
        this.updateCurrencyDisplay();
        this.updateInvoiceFields();
    }

    updateCurrencyDisplay() {
        const totalSalesElement = document.getElementById('totalSales');
        if (totalSalesElement) {
            const currencySymbol = dataManager.getCurrencySymbol();
            // Preserve the existing value, just update the currency symbol
            const currentText = totalSalesElement.textContent;
            if (currentText.includes('-')) {
                totalSalesElement.textContent = `${currencySymbol} -`;
            } else {
                // If there's a value, update the currency symbol but keep the number
                const numberPart = currentText.replace(/[^\d.-]/g, '');
                totalSalesElement.textContent = `${currencySymbol} ${numberPart}`;
            }
        }
    }

    updateInvoiceFields() {
        // This would be used when creating/displaying invoices
        const nameEnabled = dataManager.isInvoiceFieldEnabled('name');
        const priceEnabled = dataManager.isInvoiceFieldEnabled('price');
        const weightEnabled = dataManager.isInvoiceFieldEnabled('weight');
        const quantityEnabled = dataManager.isInvoiceFieldEnabled('quantity');

        console.log('Invoice fields enabled:', { nameEnabled, priceEnabled, weightEnabled, quantityEnabled });

        // Update UI elements based on enabled fields
        // This is where you would show/hide fields in your invoice forms
    }
}

// Main application initialization
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    lucide.createIcons();

    // Initialize all modules
    const mobileMenu = new MobileMenu();
    const themeManager = new ThemeManager();
    const settingsManager = new SettingsManager();

    // Check if we're on the dashboard page and initialize dashboard integration
    if (window.location.pathname.includes('dashboard.html') || document.getElementById('totalSales')) {
        const dashboardIntegration = new DashboardIntegration();
    }

    console.log('EBilir application initialized successfully');
});

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DataManager,
        MobileMenu,
        ThemeManager,
        SettingsManager,
        DashboardIntegration,
        countries,
        dataManager
    };
}

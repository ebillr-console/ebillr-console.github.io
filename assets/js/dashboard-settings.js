// Dashboard Settings specific JavaScript
class SettingsManager {
    constructor() {
        this.commonManager = window.commonManager;
        this.countries = this.getCountries();
        this.currencies = this.getCurrencies();
        this.init();
    }

    init() {
        this.initializeThemeButtons();
        this.initializeCountryCurrency();
        this.initializeFormElements();
        this.initializeEventListeners();
        this.loadUserProfile();
        this.applyCurrentSettings();
    }

    initializeThemeButtons() {
        const lightThemeButton = document.getElementById('lightThemeButton');
        const darkThemeButton = document.getElementById('darkThemeButton');

        if (lightThemeButton) {
            lightThemeButton.addEventListener('click', () => {
                this.commonManager.setTheme('light');
                this.updateThemeButtons('light');
            });
        }

        if (darkThemeButton) {
            darkThemeButton.addEventListener('click', () => {
                this.commonManager.setTheme('dark');
                this.updateThemeButtons('dark');
            });
        }

        // Initialize buttons with current system theme
        this.updateThemeButtons(this.commonManager.currentTheme);
    }

    updateThemeButtons(currentTheme) {
        const lightThemeButton = document.getElementById('lightThemeButton');
        const darkThemeButton = document.getElementById('darkThemeButton');

        if (lightThemeButton && darkThemeButton) {
            if (currentTheme === 'light') {
                lightThemeButton.classList.add('active');
                darkThemeButton.classList.remove('active');
            } else {
                darkThemeButton.classList.add('active');
                lightThemeButton.classList.remove('active');
            }
        }
    }

    initializeCountryCurrency() {
        const countrySelect = document.getElementById('countrySelect');
        const currencySelect = document.getElementById('currencySelect');

        if (countrySelect) {
            countrySelect.innerHTML = Object.entries(this.countries)
                .map(([code, name]) => `<option value="${code}">${name}</option>`)
                .join('');
        }

        if (currencySelect) {
            currencySelect.innerHTML = Object.entries(this.currencies)
                .map(([code, { name, symbol }]) =>
                    `<option value="${code}">${code} - ${name} (${symbol})</option>`
                )
                .join('');
        }
    }

    initializeFormElements() {
        // Initialize all form elements with current settings
        this.updateFormElements();
    }

    initializeEventListeners() {
        const saveButton = document.getElementById('saveSettings');
        const cancelButton = document.getElementById('cancelSettings');
        const logoutButton = document.getElementById('logoutBtn');

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Listen for theme changes from common manager
        document.addEventListener('themeChanged', (event) => {
            this.updateThemeButtons(event.detail);
        });
    }

    loadUserProfile() {
        const skeletonContainer = document.getElementById('skeletonContainer');
        const userProfileContent = document.getElementById('userProfileContent');

        // Show skeleton loading
        if (skeletonContainer) skeletonContainer.classList.add('loading');
        if (userProfileContent) userProfileContent.classList.remove('loaded');

        // Simulate API call delay
        setTimeout(() => {
            const userData = this.commonManager.loadUserData();

            if (skeletonContainer) skeletonContainer.classList.remove('loading');
            if (userProfileContent) userProfileContent.classList.add('loaded');
        }, 1000);
    }

    applyCurrentSettings() {
        const settings = this.commonManager.userSettings;

        // Update form elements
        this.updateSelectValue('countrySelect', settings.country);
        this.updateSelectValue('currencySelect', settings.currency);
        this.updateSelectValue('dateFormatSelect', settings.dateFormat);
        this.updateSelectValue('timeFormatSelect', settings.timeFormat);
        this.updateSelectValue('defaultTimeRange', settings.defaultTimeRange);
        this.updateSelectValue('defaultAxisRange', settings.defaultAxisRange);

        // Update invoice fields
        this.updateCheckbox('fieldName', settings.invoiceFields.name);
        this.updateCheckbox('fieldPrice', settings.invoiceFields.price);
        this.updateCheckbox('fieldWeight', settings.invoiceFields.weight);
        this.updateCheckbox('fieldQuantity', settings.invoiceFields.quantity);
    }

    updateSelectValue(selectId, value) {
        const select = document.getElementById(selectId);
        if (select) {
            select.value = value;
        }
    }

    updateCheckbox(checkboxId, checked) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = checked;
        }
    }

    updateFormElements() {
        // This will be called when settings change to update form elements
        this.applyCurrentSettings();
    }

    saveSettings() {
        const settings = {
            country: document.getElementById('countrySelect').value,
            currency: document.getElementById('currencySelect').value,
            dateFormat: document.getElementById('dateFormatSelect').value,
            timeFormat: document.getElementById('timeFormatSelect').value,
            defaultTimeRange: document.getElementById('defaultTimeRange').value,
            defaultAxisRange: document.getElementById('defaultAxisRange').value,
            invoiceFields: {
                name: document.getElementById('fieldName').checked,
                price: document.getElementById('fieldPrice').checked,
                weight: document.getElementById('fieldWeight').checked,
                quantity: document.getElementById('fieldQuantity').checked
            }
        };

        this.commonManager.saveUserSettings(settings);

        // Show success message or redirect
        alert('Settings saved successfully!');
        window.location.href = 'dashboard.html';
    }

    handleLogout() {
        if (confirm('Are you sure you want to log out?')) {
            // Clear user session and redirect to login
            localStorage.removeItem('userSession');
            window.location.href = '/login.html';
        }
    }

    getCountries() {
        return {
            'IN': 'India',
            'US': 'United States',
            'GB': 'United Kingdom',
            'CA': 'Canada',
            'AU': 'Australia',
            'DE': 'Germany',
            'FR': 'France',
            'JP': 'Japan',
            'SG': 'Singapore',
            'AE': 'United Arab Emirates'
        };
    }

    getCurrencies() {
        return {
            'INR': { name: 'Indian Rupee', symbol: '₹' },
            'USD': { name: 'US Dollar', symbol: '$' },
            'EUR': { name: 'Euro', symbol: '€' },
            'GBP': { name: 'British Pound', symbol: '£' },
            'JPY': { name: 'Japanese Yen', symbol: '¥' },
            'AUD': { name: 'Australian Dollar', symbol: 'A$' },
            'CAD': { name: 'Canadian Dollar', symbol: 'C$' },
            'SGD': { name: 'Singapore Dollar', symbol: 'S$' },
            'AED': { name: 'UAE Dirham', symbol: 'د.إ' }
        };
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Reinitialize lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize settings manager
    window.settingsManager = new SettingsManager();
});
// Common JavaScript for all pages - Refactored Version
class CommonManager {
    constructor() {
        this.config = {
            theme: {
                light: 'light',
                dark: 'dark'
            },
            storage: {
                theme: 'theme',
                settings: 'userSettings',
                userData: 'userData',
                scrollPosition: 'scrollPosition'
            }
        };

        this.currentTheme = this.getSystemTheme();
        this.userSettings = this.loadUserSettings();
        this.scrollPosition = 0;

        this.init();
    }

    init() {
        this.applySystemThemeImmediately();
        this.setupEventListeners();
        this.restoreScrollPosition();
        this.initializeMobileMenu();
        this.loadUserData();

        this.markBodyLoaded();
    }

    setupEventListeners() {
        this.setupSystemThemeListener();
        this.setupScrollPreservation();
    }

    // Theme Management
    applySystemThemeImmediately() {
        const systemTheme = this.getSystemTheme();
        this.setTheme(systemTheme, false);
    }

    getSystemTheme() {
        if (!window.matchMedia) return this.config.theme.light;

        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? this.config.theme.dark
            : this.config.theme.light;
    }

    setupSystemThemeListener() {
        if (!window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            this.handleSystemThemeChange(e.matches);
        };

        // Modern vs legacy event listener
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange);
        }
    }

    handleSystemThemeChange(isDark) {
        const newTheme = isDark ? this.config.theme.dark : this.config.theme.light;
        this.setTheme(newTheme, true);
    }

    setTheme(theme, persist = true) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;

        if (persist) {
            localStorage.setItem(this.config.storage.theme, theme);
        }

        this.updateThemeButtons(theme);
        this.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
    }

    updateThemeButtons(currentTheme) {
        const lightBtn = document.getElementById('lightThemeButton');
        const darkBtn = document.getElementById('darkThemeButton');

        [lightBtn, darkBtn].forEach(btn => btn?.classList.remove('active'));

        const activeBtn = currentTheme === this.config.theme.light ? lightBtn : darkBtn;
        activeBtn?.classList.add('active');
    }

    // Scroll Management
    setupScrollPreservation() {
        const saveScroll = this.debounce(() => this.saveScrollPosition(), 100);
        window.addEventListener('scroll', saveScroll);
        window.addEventListener('beforeunload', () => this.saveScrollPosition());
    }

    saveScrollPosition() {
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        sessionStorage.setItem(this.config.storage.scrollPosition, this.scrollPosition.toString());
    }

    restoreScrollPosition() {
        const savedPosition = sessionStorage.getItem(this.config.storage.scrollPosition);
        if (savedPosition) {
            requestAnimationFrame(() => {
                window.scrollTo(0, parseInt(savedPosition));
                sessionStorage.removeItem(this.config.storage.scrollPosition);
            });
        }
    }

    // Mobile Menu
    initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');

        if (!mobileMenuBtn || !sidebar || !mobileOverlay) return;

        const toggleMenu = () => {
            const isOpen = sidebar.classList.toggle('mobile-open');
            mobileOverlay.classList.toggle('mobile-open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        const closeMenu = () => {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('mobile-open');
            document.body.style.overflow = '';
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', closeMenu);

        // Close menu when clicking menu items
        const menuItems = sidebar.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', closeMenu);
        });
    }

    // User Data Management
    loadUserData() {
        const defaultUserData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: null
        };

        const userData = this.getStoredData(this.config.storage.userData, defaultUserData);

        // Update UI elements
        this.updateUserInfo(userData);

        return userData;
    }

    updateUserInfo(userData) {
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');

        if (userNameElement) userNameElement.textContent = userData.name;
        if (userEmailElement) userEmailElement.textContent = userData.email;
    }

    // Settings Management
    loadUserSettings() {
        const defaultSettings = {
            country: 'IN',
            currency: 'INR',
            dateFormat: 'DD/MM/YY',
            timeFormat: '12h',
            defaultTimeRange: '7d',
            defaultAxisRange: '1000',
            invoiceFields: {
                name: true,
                price: true,
                weight: false,
                quantity: false
            }
        };

        return this.getStoredData(this.config.storage.settings, defaultSettings);
    }

    getStoredData(key, defaultValue) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? { ...defaultValue, ...JSON.parse(stored) } : defaultValue;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return defaultValue;
        }
    }

    saveUserSettings(settings) {
        this.userSettings = { ...this.userSettings, ...settings };
        localStorage.setItem(this.config.storage.settings, JSON.stringify(this.userSettings));
        this.dispatchEvent(new CustomEvent('settingsChanged', { detail: this.userSettings }));
    }

    // Utility Functions
    formatCurrency(amount, currency = this.userSettings.currency) {
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        return formatter.format(amount);
    }

    formatDate(date, format = this.userSettings.dateFormat) {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const shortYear = year.toString().slice(-2);

        const formats = {
            'DD-MM-YYYY': `${day}-${month}-${year}`,
            'DD/MM/YYYY': `${day}/${month}/${year}`,
            'DD/MM/YY': `${day}/${month}/${shortYear}`,
            'DD MMM YYYY': `${day} ${this.getMonthName(d.getMonth())} ${year}`
        };

        return formats[format] || formats['DD/MM/YY'];
    }

    getMonthName(monthIndex) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[monthIndex];
    }

    // Event Management
    addEventListener(event, callback) {
        document.addEventListener(event, callback);
    }

    dispatchEvent(event) {
        document.dispatchEvent(event);
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Implement notification system here
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    debounce(func, wait) {
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

    markBodyLoaded() {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 50);
    }
}

// Initialize common manager
const initializeCommonManager = () => {
    if (!window.commonManager) {
        window.commonManager = new CommonManager();
    }
};

// Initialize based on document state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommonManager);
} else {
    initializeCommonManager();
}
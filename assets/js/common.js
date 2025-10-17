// Common JavaScript for all pages - Optimized
class CommonManager {
    constructor() {
        this.currentTheme = this.getSystemTheme();
        this.userSettings = this.loadUserSettings();
        this.scrollPosition = 0;
        this.init();
    }

    init() {
        this.restoreScrollPosition();
        this.applySystemTheme();
        this.initializeMobileMenu();
        this.initializeLucideIcons();
        this.loadUserData();
        this.setupSystemThemeListener();
        this.setupScrollPreservation();
    }

    // Scroll preservation
    setupScrollPreservation() {
        // Save scroll position before unload
        window.addEventListener('beforeunload', () => {
            this.saveScrollPosition();
        });

        // Restore scroll position after load
        window.addEventListener('load', () => {
            this.restoreScrollPosition();
        });
    }

    saveScrollPosition() {
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        sessionStorage.setItem('scrollPosition', this.scrollPosition.toString());
    }

    restoreScrollPosition() {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
            // Use requestAnimationFrame for smooth restoration
            requestAnimationFrame(() => {
                window.scrollTo(0, parseInt(savedPosition));
                // Clear after restoration
                sessionStorage.removeItem('scrollPosition');
            });
        }
    }

    // Theme Management - Always follow system theme
    getSystemTheme() {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }

    applySystemTheme() {
        const systemTheme = this.getSystemTheme();
        // Apply theme immediately without any delay
        document.documentElement.setAttribute('data-theme', systemTheme);
        this.currentTheme = systemTheme;

        // Update theme buttons to reflect system theme
        this.updateThemeButtons(systemTheme);
    }

    setupSystemThemeListener() {
        // Listen for system theme changes in real-time
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // Use addEventListener for modern browsers
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', (e) => {
                    this.handleSystemThemeChange(e.matches);
                });
            }
            // Fallback for older browsers
            else if (mediaQuery.addListener) {
                mediaQuery.addListener((e) => {
                    this.handleSystemThemeChange(e.matches);
                });
            }
        }
    }

    handleSystemThemeChange(isDark) {
        const newTheme = isDark ? 'dark' : 'light';

        // Apply theme immediately without any animations
        document.documentElement.setAttribute('data-theme', newTheme);
        this.currentTheme = newTheme;

        // Update theme buttons
        this.updateThemeButtons(newTheme);

        // Dispatch event for other components
        this.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));

        // Force re-render of charts and other theme-dependent elements
        this.forceThemeUpdate();
    }

    forceThemeUpdate() {
        // Force re-render of any theme-dependent elements
        if (window.dashboardManager && window.dashboardManager.salesChart) {
            window.dashboardManager.updateChartTheme();
        }

        // Reinitialize lucide icons to ensure proper colors
        this.initializeLucideIcons();
    }

    // Manual theme switching (optional - if you want to keep manual override)
    setTheme(theme) {
        // For manual override, you can store in localStorage
        // But system theme will always take precedence unless manually overridden
        localStorage.setItem('manualTheme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.updateThemeButtons(theme);
        this.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
    }

    updateThemeButtons(currentTheme) {
        const lightThemeButton = document.getElementById('lightThemeButton');
        const darkThemeButton = document.getElementById('darkThemeButton');

        // Remove active class from all buttons
        if (lightThemeButton) lightThemeButton.classList.remove('active');
        if (darkThemeButton) darkThemeButton.classList.remove('active');

        // Add active class to current theme button
        if (currentTheme === 'light' && lightThemeButton) {
            lightThemeButton.classList.add('active');
        } else if (darkThemeButton) {
            darkThemeButton.classList.add('active');
        }
    }

    // Mobile Menu
    initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');

        if (mobileMenuBtn && sidebar && mobileOverlay) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                mobileOverlay.classList.toggle('mobile-open');
                document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
            });

            mobileOverlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                mobileOverlay.classList.remove('mobile-open');
                document.body.style.overflow = '';
            });

            // Close menu when clicking on menu items
            const menuItems = sidebar.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    sidebar.classList.remove('mobile-open');
                    mobileOverlay.classList.remove('mobile-open');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // Lucide Icons - Optimized
    initializeLucideIcons() {
        if (typeof lucide !== 'undefined') {
            // Only create icons for visible elements
            const visibleElements = document.querySelectorAll('[data-lucide]:not(.lucide-initialized)');
            if (visibleElements.length > 0) {
                lucide.createIcons();
                // Mark as initialized to avoid re-processing
                visibleElements.forEach(el => el.classList.add('lucide-initialized'));
            }
        }
    }

    // User Data Management
    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: null
        };

        // Update user info in settings page
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');

        if (userNameElement) userNameElement.textContent = userData.name;
        if (userEmailElement) userEmailElement.textContent = userData.email;

        return userData;
    }

    // Settings Management
    loadUserSettings() {
        const defaultSettings = {
            country: 'IN',
            currency: 'INR',
            dateFormat: 'DD-MM-YYYY',
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

        const savedSettings = JSON.parse(localStorage.getItem('userSettings')) || defaultSettings;
        return { ...defaultSettings, ...savedSettings };
    }

    saveUserSettings(settings) {
        this.userSettings = { ...this.userSettings, ...settings };
        localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
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
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        switch (format) {
            case 'DD-MM-YYYY':
                return `${day}-${month}-${year}`;
            case 'MM/DD/YYYY':
                return `${month}/${day}/${year}`;
            case 'DD/MM/YYYY':
                return `${day}/${month}/${year}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'DD MMM YYYY':
                return `${day} ${monthNames[d.getMonth()]} ${year}`;
            case 'MMM DD, YYYY':
                return `${monthNames[d.getMonth()]} ${day}, ${year}`;
            default:
                return `${day}-${month}-${year}`;
        }
    }

    // Event Management
    addEventListener(event, callback) {
        document.addEventListener(event, callback);
    }

    dispatchEvent(event) {
        document.dispatchEvent(event);
    }
}

// Initialize common manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.commonManager = new CommonManager();
});

// Also initialize immediately for faster theme application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        if (!window.commonManager) {
            window.commonManager = new CommonManager();
        }
    });
} else {
    if (!window.commonManager) {
        window.commonManager = new CommonManager();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommonManager;
}
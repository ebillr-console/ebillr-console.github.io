// Dashboard Settings specific functionality
class DashboardSettings {
    constructor() {
        this.skeletonContainer = document.getElementById('skeletonContainer');
        this.userProfileContent = document.getElementById('userProfileContent');
        this.userName = document.getElementById('userName');
        this.userEmail = document.getElementById('userEmail');
        
        this.init();
    }

    async init() {
        // Set scroll restoration
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
        
        // Wait for app.js to initialize
        setTimeout(() => {
            this.initializeSettingsPage();
        }, 100);
        
        // Initialize user profile
        await this.loadUserProfile();
    }

    async loadUserProfile() {
        try {
            const userData = await this.fetchUserData();
            
            if (userData) {
                this.displayUserProfile(userData);
            } else {
                // No data received, skeleton remains visible
                console.log('Waiting for user data from server...');
            }
        } catch (error) {
            console.error('Failed to load user profile:', error);
            this.showErrorState();
        }
    }

    async fetchUserData() {
        try {
            // Simulate API call - replace with actual fetch to your backend
            const response = await this.mockApiCall();
            
            if (response && response.success) {
                return response.data;
            }
            return null;
        } catch (error) {
            throw new Error(`API call failed: ${error.message}`);
        }
    }

    displayUserProfile(userData) {
        if (this.skeletonContainer && this.userProfileContent && this.userName && this.userEmail) {
            // Hide skeleton
            this.skeletonContainer.classList.add('loaded');
            
            // Populate user data
            this.userName.textContent = userData.name;
            this.userEmail.textContent = userData.email;
            
            // Show actual content
            this.userProfileContent.classList.add('loaded');
            
            // Refresh Lucide icons for the newly shown content
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            console.log('User profile loaded successfully');
        }
    }

    showErrorState() {
        if (this.skeletonContainer) {
            // You can add error styling or message here
            this.skeletonContainer.style.border = '1px solid #ef4444';
            console.error('Failed to load user profile data');
        }
    }

    // Mock API call - replace with actual fetch
    async mockApiCall() {
        // Simulate network delay (2-5 seconds)
        const delay = Math.random() * 3000 + 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Simulate random success/failure
        const shouldSucceed = Math.random() > 0.3; // 70% success rate
        
        if (shouldSucceed) {
            return {
                success: true,
                data: {
                    name: "User Name",
                    email: "user@example.com"
                }
            };
        } else {
            // Return null to simulate no data received
            return null;
        }
    }

    initializeSettingsPage() {
        // Settings page specific initialization
        console.log('Dashboard Settings page initialized');
        
        // Force theme initialization if needed
        if (window.themeManager) {
            const savedTheme = window.dataManager.getSetting('theme') || 'auto';
            window.themeManager.applyTheme(savedTheme);
            window.themeManager.updateActiveButton(savedTheme);
        }
        
        // Force settings initialization if needed
        if (window.settingsManager) {
            window.settingsManager.loadAllSettings();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create instance of DashboardSettings
    const dashboardSettings = new DashboardSettings();
});

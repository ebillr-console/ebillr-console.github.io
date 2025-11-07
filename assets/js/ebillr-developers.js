// Developers page specific JavaScript
class DevelopersManager {
    constructor() {
        this.init();
    }

    init() {
        this.initializeLucideIcons();
        this.initializeGitHubAvatar();
    }

    initializeLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    initializeGitHubAvatar() {
        const avatar = document.querySelector('.github-avatar');
        if (avatar) {
            // Add loading state
            avatar.style.opacity = '0.7';

            // Add error handling for GitHub avatar
            avatar.onerror = function () {
                // Fallback to Lucide user icon if GitHub avatar fails to load
                const avatarContainer = document.querySelector('.developer-avatar');
                avatarContainer.innerHTML = '<i data-lucide="user"></i>';
                lucide.createIcons();
            };

            avatar.onload = function () {
                avatar.style.opacity = '1';
            };
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    window.developersManager = new DevelopersManager();
});
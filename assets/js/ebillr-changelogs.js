// Changelogs Manager - Fixed Version with Scroll Preservation
class ChangelogsManager {
    constructor() {
        this.changelogData = this.initializeChangelogData();
        this.scrollKey = 'changelogScrollPosition';
        this.init();
    }

    init() {
        this.preventFlashOfContent();
        this.renderChangelogs();
        this.initializeEventListeners();
        this.initializeLucideIcons();
        this.restoreScrollPosition();
    }

    preventFlashOfContent() {
        // Hide content until we're ready to show it at the correct scroll position
        document.body.style.visibility = 'hidden';

        // Show content after a short delay to ensure scroll restoration works
        setTimeout(() => {
            document.body.style.visibility = 'visible';
        }, 50);
    }

    initializeEventListeners() {
        this.initializeSocialLinks();
        this.setupScrollPreservation();
    }

    setupScrollPreservation() {
        // Save scroll position before page unload
        window.addEventListener('beforeunload', () => {
            this.saveScrollPosition();
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.saveScrollPosition();
            }
        });
    }

    saveScrollPosition() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        sessionStorage.setItem(this.scrollKey, scrollPosition.toString());
    }

    restoreScrollPosition() {
        const savedPosition = sessionStorage.getItem(this.scrollKey);
        if (savedPosition) {
            // Use multiple methods to ensure scroll restoration
            const restore = () => {
                window.scrollTo(0, parseInt(savedPosition));

                // Double check after a frame
                requestAnimationFrame(() => {
                    const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
                    if (Math.abs(currentPosition - parseInt(savedPosition)) > 50) {
                        window.scrollTo(0, parseInt(savedPosition));
                    }

                    // Clear the saved position after restoration
                    sessionStorage.removeItem(this.scrollKey);
                });
            };

            // Try immediate restoration
            restore();

            // Fallback restoration after DOM is fully ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', restore);
            } else {
                window.addEventListener('load', restore);
            }
        }
    }

    initializeLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    initializeSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('href');
                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            });
        });
    }

    initializeChangelogData() {
        return [
            {
                version: 'V1.0.200',
                date: '17/10/25',
                variant: 'STABLE',
                changes: [
                    { type: 'new', text: 'Added advanced dark mode support with system theme detection' },
                    { type: 'new', text: 'Implemented real-time dashboard with interactive charts' },
                    { type: 'new', text: 'Added cloud storage integration for automatic backups' },
                    { type: 'updated', text: 'Enhanced mobile responsiveness across all devices' },
                    { type: 'updated', text: 'Optimized performance with 40% faster load times' },
                    { type: 'fixed', text: 'Fixed invoice export issues with special characters' },
                    { type: 'fixed', text: 'Resolved chart rendering problems in dark mode' }
                ]
            },
            {
                version: 'V1.0.150',
                date: '15/09/25',
                variant: 'BETA',
                changes: [
                    { type: 'new', text: 'Introduced custom invoice template builder' },
                    { type: 'new', text: 'Added advanced reporting features' },
                    { type: 'updated', text: 'Enhanced data export functionality' },
                    { type: 'updated', text: 'Improved user authentication flow' },
                    { type: 'fixed', text: 'Fixed timezone issues in reporting' },
                    { type: 'fixed', text: 'Resolved data synchronization problems' }
                ]
            }
        ];
    }

    renderChangelogs() {
        const container = document.getElementById('changelogContainer');
        if (!container) {
            console.error('Changelog container not found');
            return;
        }

        let html = '';

        this.changelogData.forEach(version => {
            html += this.renderVersionGroup(version);
        });

        container.innerHTML = html;
    }

    renderVersionGroup(version) {
        return `
            <div class="version-group">
                <div class="version-header">
                    <h3 class="version-title">${version.version}</h3>
                    <div class="version-pills">
                        <span class="version-pill">${version.date}</span>
                        <span class="version-pill">${version.variant}</span>
                    </div>
                </div>
                <div class="changelog-items">
                    ${version.changes.map(change => this.renderChangeItem(change)).join('')}
                </div>
            </div>
        `;
    }

    renderChangeItem(change) {
        const badgeClass = this.getBadgeClass(change.type);
        const badgeText = this.getBadgeText(change.type);

        return `
            <div class="changelog-item">
                <span class="changelog-badge ${badgeClass}">${badgeText}</span>
                <span class="changelog-text">${change.text}</span>
            </div>
        `;
    }

    getBadgeClass(type) {
        const typeMap = {
            'new': 'changelog-badge-new',
            'updated': 'changelog-badge-updated',
            'fixed': 'changelog-badge-fixed'
        };
        return typeMap[type] || 'changelog-badge-updated';
    }

    getBadgeText(type) {
        const textMap = {
            'new': 'NEW',
            'updated': 'UPDATED',
            'fixed': 'FIXED'
        };
        return textMap[type] || 'UPDATED';
    }

    // Public methods for external use
    addVersion(versionData) {
        this.changelogData.unshift(versionData);
        this.renderChangelogs();
    }

    getVersions() {
        return [...this.changelogData];
    }

    getLatestVersion() {
        return this.changelogData[0];
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    window.changelogsManager = new ChangelogsManager();
});
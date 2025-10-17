// Changelogs Manager - Improved Layout
class ChangelogsManager {
    constructor() {
        this.pageData = this.initializePageData();
        this.changelogData = this.initializeChangelogData();
        this.scrollKey = 'changelogScrollPosition';
        this.init();
    }

    init() {
        this.hideContentImmediately();
        this.renderEntirePage();
        this.initializeEventListeners();
        this.initializeLucideIcons();
        this.restoreScrollPosition();
    }

    hideContentImmediately() {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.visibility = 'hidden';
        }
        document.body.style.visibility = 'hidden';
        document.body.style.opacity = '0';
    }

    showContent() {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.visibility = 'visible';
        }
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
    }

    initializePageData() {
        return {
            pageTitle: "Changelogs",
            pageSubtitle: "Latest updates and improvements to EBillr",
            developerSection: {
                title: "Developer",
                subtitle: "The Heros Of Developing EBillr",
                developer: {
                    name: "Laksh Kukreja",
                    role: "Founder & Lead Developer",
                    github: "https://github.com"
                }
            },
            changelogSection: {
                title: "Changelog",
                subtitle: "View All Updates Making EBillr Better Everyday"
            }
        };
    }

    initializeChangelogData() {
        return [
            {
                version: "V1.0.500",
                date: "17 October 2025",
                variant: "Stable",
                changes: [
                    { type: 'new', text: 'Introduced New Changelogs Webpage For Better Tracking Updates.' },
                    { type: 'new', text: 'Automatic Real-Time System Based Theme Switching Support Added.' },
                    { type: 'new', text: 'New Skeleton Loading Animation Effect Is Now Available.' },
                    { type: 'updated', text: 'Improved Website Overall Performance & Smoothness While Scrolling.' },
                    { type: 'fixed', text: 'Fixed Changelog Page Pills Size According To Device Dimensions.' },
                    { type: 'fixed', text: 'Fixed An Issue Where Some Elements Were Animating Randomly While Toggling Theme Switching.' },
                    { type: 'fixed', text: 'Fixed Flash-Bang Issue, Where Content Showed Up On Wrong Elements After Page Is Reloaded.' },
                ]
            },
            {
                version: "V2.0.0",
                date: "December 1, 2023",
                variant: "STABLE",
                changes: [
                    { type: 'new', text: 'Initial release of dynamic changelog system' },
                    { type: 'updated', text: 'Enhanced mobile user experience' },
                    { type: 'fixed', text: 'Fixed all reported UI bugs' },
                    { type: 'new', text: 'Added cloud storage integration' },
                    { type: 'updated', text: 'Optimized database queries' }
                ]
            }
        ];
    }

    renderEntirePage() {
        const container = document.getElementById('changelogPageContent');
        if (!container) {
            console.error('Page container not found');
            return;
        }

        container.innerHTML = this.generatePageHTML();
    }

    generatePageHTML() {
        return `
            <!-- Changelogs Header -->
            <div class="changelogs-header">
                <h1 class="changelogs-title">${this.pageData.pageTitle}</h1>
                <p class="changelogs-subtitle">${this.pageData.pageSubtitle}</p>
            </div>

            <!-- Developer Information Section -->
            <div class="changelogs-section">
                <h2 class="changelogs-section-title">${this.pageData.developerSection.title}</h2>
                <p class="changelogs-section-subtitle">${this.pageData.developerSection.subtitle}</p>
                <div class="card">
                    ${this.generateDeveloperProfile()}
                </div>
            </div>

            <!-- Changelog Information Section -->
            <div class="changelogs-section">
                <h2 class="changelogs-section-title">${this.pageData.changelogSection.title}</h2>
                <p class="changelogs-section-subtitle">${this.pageData.changelogSection.subtitle}</p>
                ${this.generateAllVersions()}
            </div>
        `;
    }

    generateDeveloperProfile() {
        const dev = this.pageData.developerSection.developer;
        return `
            <div class="developer-profile">
                <div class="developer-avatar">
                    <i data-lucide="user"></i>
                </div>
                <div class="developer-details">
                    <h3 class="developer-name">${dev.name}</h3>
                    <p class="developer-role">${dev.role}</p>
                    <div class="developer-social">
                        <a href="${dev.github}" class="social-link" target="_blank">
                            <i data-lucide="github"></i>
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    generateAllVersions() {
        return this.changelogData.map(version => this.generateVersionGroup(version)).join('');
    }

    generateVersionGroup(version) {
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
                    ${version.changes.map(change => this.generateChangeItem(change)).join('')}
                </div>
            </div>
        `;
    }

    generateChangeItem(change) {
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

    initializeEventListeners() {
        this.setupScrollPreservation();
        this.initializeSocialLinks();
    }

    setupScrollPreservation() {
        window.addEventListener('beforeunload', () => {
            this.saveScrollPosition();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.saveScrollPosition();
            }
        });
        window.addEventListener('pagehide', () => {
            this.saveScrollPosition();
        });
    }

    saveScrollPosition() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPosition > 100) {
            sessionStorage.setItem(this.scrollKey, scrollPosition.toString());
        }
    }

    restoreScrollPosition() {
        const savedPosition = sessionStorage.getItem(this.scrollKey);

        if (savedPosition) {
            const targetPosition = parseInt(savedPosition);

            const restoreAttempts = [
                () => this.immediateRestore(targetPosition),
                () => this.delayedRestore(targetPosition, 50),
                () => this.delayedRestore(targetPosition, 100),
                () => this.delayedRestore(targetPosition, 200)
            ];

            restoreAttempts.forEach((attempt, index) => {
                setTimeout(attempt, index * 10);
            });

            setTimeout(() => {
                sessionStorage.removeItem(this.scrollKey);
                this.showContent();
            }, 300);
        } else {
            setTimeout(() => {
                this.showContent();
            }, 50);
        }
    }

    immediateRestore(targetPosition) {
        window.scrollTo(0, targetPosition);
    }

    delayedRestore(targetPosition, delay) {
        setTimeout(() => {
            const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
            if (Math.abs(currentPosition - targetPosition) > 10) {
                window.scrollTo(0, targetPosition);
            }
        }, delay);
    }

    initializeSocialLinks() {
        setTimeout(() => {
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
        }, 500);
    }

    initializeLucideIcons() {
        if (typeof lucide !== 'undefined') {
            setTimeout(() => {
                lucide.createIcons();
            }, 600);
        }
    }

    // Public API methods
    updatePageTitle(newTitle, newSubtitle) {
        this.pageData.pageTitle = newTitle;
        this.pageData.pageSubtitle = newSubtitle;
        this.renderEntirePage();
    }

    updateDeveloperInfo(newName, newRole, newGithub) {
        this.pageData.developerSection.developer.name = newName;
        this.pageData.developerSection.developer.role = newRole;
        this.pageData.developerSection.developer.github = newGithub;
        this.renderEntirePage();
    }

    addNewVersion(versionData) {
        this.changelogData.unshift(versionData);
        this.renderEntirePage();
    }

    getCurrentData() {
        return {
            pageData: { ...this.pageData },
            changelogData: [...this.changelogData]
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    window.changelogsManager = new ChangelogsManager();
});

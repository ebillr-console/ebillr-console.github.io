// Changelogs Manager - Fixed Version
class ChangelogsManager {
    constructor() {
        this.changelogData = this.initializeChangelogData();
        this.init();
    }

    init() {
        this.renderChangelogs();
        this.initializeEventListeners();
        this.initializeLucideIcons();
    }

    initializeEventListeners() {
        this.initializeSocialLinks();
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
                version: 'V1.1.100',
                date: '18 October 2025',
                variant: 'STABLE',
                changes: [
                    { type: 'new', text: 'Introduced New Page, "EBillr Developers" Now Available In Dashboard Settings.' },
                    { type: 'new', text: 'Added Support For New Font Style "Zalando Sans Semi Expanded".' },
                    { type: 'updated', text: 'Improved Functionalities & UI Experience For "EBillr Changelogs" Page.' },
                    { type: 'updated', text: 'Changed Entire UI For Developer Card Element.' },
                    { type: 'updated', text: 'Integrated Support For New Font Style "Jetbrains Mono" Where Required.' },
                    { type: 'fixed', text: 'Fixed An Issue Where Changelogs Was Not Showing In The Release (V1.0.200)' },
                ]
            },
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

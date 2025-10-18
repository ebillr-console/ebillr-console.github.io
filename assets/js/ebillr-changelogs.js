
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
                version: 'V1.7.3',
                date: '18 October 2025',
                variant: 'STABLE',
                changes: [
                    { type: 'n', text: 'Introduced New Page, "EBillr Developers" Now Available In Dashboard Settings.' },
                    { type: 'n', text: 'Added Support For New Font Style "Zalando Sans Semi Expanded".' },
                    { type: 'n', text: 'Skeleton Loading Animation Added For Dynamic Data Types.' },
                    { type: 'n', text: 'Automatic Real Time Theme Switching Available Across iOS, Android, MacOS & Windows.' },
                    { type: 'u', text: 'Improved Functionalities & UI Experience For "EBillr Changelogs" Page.' },
                    { type: 'u', text: 'Changed Entire UI For Developer Card Element.' },
                    { type: 'u', text: 'Integrated Support For New Font Style "Jetbrains Mono" Where Required.' },
                    { type: 'u', text: 'Optimized Scrolling & Smoothness Experience Up To 40%' },
                    { type: 'f', text: 'Fixed Issue Where Website Was Not Automatically Changing Themes For Some Devices In Real Time.' },
                    { type: 'f', text: 'Fixed An Issue Where Changelogs Was Not Showing In The Release (V1.0.200)' },
                    { type: 'f', text: 'Fixed Flash Bang Issue All Over Webpages After Website Is Reloaded.' },
                    { type: 'f', text: 'Critical Security Bug Fixes & Patches.' },
                ]
            },
            {
                version: 'V1.0.200',
                date: '17/10/25',
                variant: 'STABLE',
                changes: [
                    { type: 'n', text: 'Added advanced dark mode support with system theme detection' },
                    { type: 'n', text: 'Implemented real-time dashboard with interactive charts' },
                    { type: 'n', text: 'Added cloud storage integration for automatic backups' },
                    { type: 'u', text: 'Enhanced mobile responsiveness across all devices' },
                    { type: 'u', text: 'Optimized performance with 40% faster load times' },
                    { type: 'f', text: 'Fixed invoice export issues with special characters' },
                    { type: 'f', text: 'Resolved chart rendering problems in dark mode' },
                    { type: 'b', text: 'Patched memory leak in data processing module' },
                    { type: 'i', text: 'Introduced new AI-powered analytics engine' }
                ]
            },
            {
                version: 'V1.0.150',
                date: '15/09/25',
                variant: 'BETA',
                changes: [
                    { type: 'n', text: 'Introduced custom invoice template builder' },
                    { type: 'n', text: 'Added advanced reporting features' },
                    { type: 'u', text: 'Enhanced data export functionality' },
                    { type: 'u', text: 'Improved user authentication flow' },
                    { type: 'f', text: 'Fixed timezone issues in reporting' },
                    { type: 'f', text: 'Resolved data synchronization problems' },
                    { type: 'b', text: 'Fixed database connection pooling bug' },
                    { type: 'i', text: 'Launched new mobile-responsive design system' }
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
        const counts = this.getChangeCounts(version.changes);

        return `
            <div class="version-group">
                <div class="version-header">
                    <h3 class="version-title">${version.version}</h3>
                    <div class="version-pills">
                        <span class="version-pill">${version.date}</span>
                        <span class="version-pill">${version.variant}</span>
                        <span class="count-pill count-pill-new">${counts.n}</span>
                        <span class="count-pill count-pill-updated">${counts.u}</span>
                        <span class="count-pill count-pill-fixed">${counts.f}</span>
                        <span class="count-pill count-pill-bug">${counts.b}</span>
                        <span class="count-pill count-pill-introduced">${counts.i}</span>
                    </div>
                </div>
                <div class="changelog-items">
                    ${version.changes.map(change => this.renderChangeItem(change)).join('')}
                </div>
            </div>
        `;
    }

    getChangeCounts(changes) {
        const counts = { n: 0, u: 0, f: 0, b: 0, i: 0 };
        changes.forEach(change => {
            if (counts.hasOwnProperty(change.type)) {
                counts[change.type]++;
            } else {
                console.warn(`Unknown changelog type: "${change.type}" for text: "${change.text}"`);
            }
        });
        return counts;
    }

    renderChangeItem(change) {
        const badgeClass = this.getBadgeClass(change.type);

        return `
            <div class="changelog-item">
                <span class="changelog-badge ${badgeClass}">${change.text}</span>
            </div>
        `;
    }

    getBadgeClass(type) {
        const typeMap = {
            'n': 'changelog-badge-new',
            'u': 'changelog-badge-updated',
            'f': 'changelog-badge-fixed',
            'b': 'changelog-badge-bug',
            'i': 'changelog-badge-introduced'
        };
        return typeMap[type] || 'changelog-badge-unknown';
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

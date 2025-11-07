
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
                version: '1.7.4.c',
                date: '05/11/25',
                variant: 'Stable',
                changes: [
                    { type: 'n', text: 'Transffered Fonts & Icons Support To Backend For Seamless & Fluid Experience.' },
                    { type: 'n', text: 'New Pop-up Menu Support Added For Region & Localization.' },
                    { type: 'u', text: 'Integrated Blurs For Pop-up Alerts & Locked Scrolling Support.' },
                    { type: 'u', text: 'Added Dynamic Icons For Currency & Time.' },
                    { type: 'i', text: 'Fix Changelog Page When Loaded To Start From Random Position.' },
                    { type: 'i', text: 'Add Support Of Backend Data Fetch & Display User Information In Sidebar.' },
                ]
            },

            {
                version: '1.7.4.b',
                date: '03/11/25',
                variant: 'Hotfix',
                changes: [
                    { type: 'u', text: 'Updated New Loading Animation Across The Website.' },
                    { type: 'u', text: 'New Icons Implementation Across Website.' },
                    { type: 'u', text: 'Fixed General Bugs & Made Improvements.' },
                ]
            },

            {
                version: 'V1.7.4.a',
                date: '02/11/25',
                variant: 'Hotfix',
                changes: [
                    { type: 'n', text: 'Added "Please Connect To Internet" Alert Message For Viewing Live Data For Region & Localizations.' },
                    { type: 'u', text: 'Refined Animation Effects & Coding Logic For Region & Localization.' },
                    { type: 'f', text: 'Fixed Issue Where Changelogs Page Started From Random Location When Loaded.' },
                ]
            },

            {
                version: 'V1.7.4',
                date: '19/10/25',
                variant: 'Stable',
                changes: [
                    { type: 'n', text: 'Added Inverse Text Background Color For Better Readiblity & Aesthetics.' },
                    { type: 'n', text: 'Added Feature To Add More Custom Invoice Fields In Dashboard Settings.' },
                    { type: 'n', text: 'Added Support To Remove Invoice Fields In Dashboard Settings.' },
                    { type: 'n', text: 'New Confirmation Popups Support Across Dashboard Settings.' },
                    { type: 'n', text: 'Added Support To Switch Position Of Invoice Fields.' },
                    { type: 'u', text: 'Removed Support Of Modifying Dashboard Graph Related Settings.' },
                    { type: 'u', text: 'Updated Animations & Design Language Of Region & Localization.' },
                    { type: 'u', text: 'Added Country Support For USA & India.' },
                    { type: 'f', text: 'Fixed Issue Where Changelogs Page Was Opening From Bottom.' },
                    { type: 'f', text: 'Fixed Trash Icon Visibility After New Field Was Added.' },
                    { type: 'b', text: 'Changelogs Page After Loading Does Not Start From Top.' },
                ]
            },
            {
                version: 'V1.7.3',
                date: '18/10/25',
                variant: 'Stable',
                changes: [
                    { type: 'n', text: 'Introduced New Page, "EBillr Developers" Now Available In Dashboard Settings.' },
                    { type: 'n', text: 'Added Support For New Font Style "Zalando Sans Semi Expanded".' },
                    { type: 'n', text: 'Skeleton Loading Animation Added For Dynamic Data Types.' },
                    { type: 'n', text: 'Automatic Real Time Theme Switching Available Across Most Of Devices & Browsers.' },
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
                version: 'V1.5.9',
                date: '17/10/25',
                variant: 'Stable',
                changes: [
                    { type: 'n', text: 'Introduced New Sidebar For Quick Accessing Website Easily.' },
                    { type: 'n', text: 'Added Support For Various Dimensions Devices Like Smartphones.' },
                    { type: 'n', text: 'Added Support Of Light & Dark Mode, Available In Settings.' },
                    { type: 'n', text: 'Added Support Of Interactive Analytics In Dashboard.' },
                    { type: 'f', text: 'Patched Critical Bug That Created Memory Leak Issues.' },
                    { type: 'b', text: 'Dashboard > Graphs Visiblity Issue Exists In Dark Mode.' },
                    { type: 'i', text: 'Multi Language Support & Special Characters Support Coming Soon.' },
                ]
            },
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
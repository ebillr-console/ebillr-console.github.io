      document.addEventListener('DOMContentLoaded', () => {
            const html = document.documentElement;
            const themeToggle = document.getElementById('theme-toggle');
            const logoutBtn = document.getElementById('logout-btn');
            const menuItems = document.querySelectorAll('.menu-item');
            const actionButtons = [
                document.getElementById('change-repo-btn'),
                document.getElementById('customer-id-btn'),
                document.getElementById('change-preset-btn'),
                document.getElementById('delete-files-btn')
            ];
            const sessionModal = document.getElementById('session-modal');

            // Check session first
            const session = getSession();
            if (!session) {
                showSessionModal();
                return;
            }

            // Set user data
            if (session.user) {
                document.getElementById('username').textContent = session.user.login || 'User';
                if (session.user.avatar_url) {
                    document.getElementById('user-avatar').src = session.user.avatar_url;
                }
            }

            // Theme toggle functionality
            themeToggle.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme');
                html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
            });

            // Logout button
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    destroySession();
                    window.location.href = 'login.html';
                }
            });

            // Menu item click handlers
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    menuItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    // Here you would load the appropriate content
                    document.querySelector('.data-placeholder p').textContent = 
                        `Loading ${this.textContent.trim()} content...`;
                });
            });

            // Action button click handlers
            actionButtons.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', () => {
                        alert(`${btn.textContent.trim()} functionality will be implemented here`);
                    });
                }
            });

            // Check session periodically
            setInterval(() => {
                if (!getSession()) {
                    showSessionModal();
                }
            }, 30000); // Check every 30 seconds
        });

        function showSessionModal() {
            const modal = document.getElementById('session-modal');
            modal.style.display = 'flex';
            
            let seconds = 5;
            const countdown = document.getElementById('countdown');
            const timer = setInterval(() => {
                seconds--;
                countdown.textContent = seconds;
                if (seconds <= 0) {
                    clearInterval(timer);
                    window.location.href = 'login.html';
                }
            }, 1000);
        }
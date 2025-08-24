document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const header = document.querySelector('header');

    // Default dark theme
    html.setAttribute('data-theme', 'dark');

    // Theme toggle (instant switch)
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

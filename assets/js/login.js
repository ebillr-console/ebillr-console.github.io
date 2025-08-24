document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const githubBtn = document.getElementById('github-login-btn');
    
    // Set dark theme by default
    html.setAttribute('data-theme', 'dark');
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Check if already logged in
    if (checkAuth()) {
        window.location.href = 'e-billr.html';
        return;
    }

    // Check for auth errors
    const error = localStorage.getItem('github_auth_error');
    if (error) {
        showError(error);
        localStorage.removeItem('github_auth_error');
    }

    // Setup GitHub OAuth with PKCE
    const state = generateStateToken();
    const codeVerifier = generateCodeVerifier();
    
    localStorage.setItem('github_auth_state', state);
    localStorage.setItem('github_code_verifier', codeVerifier);
    
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const redirectUri = encodeURIComponent(window.location.origin + '/auth-callback.html');
    
    // Update GitHub button href with all security parameters
    githubBtn.href = `https://github.com/login/oauth/authorize?client_id=Ov23liQgRHKpfR6JJzHi&redirect_uri=${redirectUri}&scope=user:email&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    
    // Store the current time to prevent replay attacks
    githubBtn.addEventListener('click', () => {
        localStorage.setItem('github_auth_time', Date.now());
    });
});

function generateStateToken() {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function generateCodeVerifier() {
    return CryptoJS.lib.WordArray.random(64).toString(CryptoJS.enc.Base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function generateCodeChallenge(verifier) {
    return CryptoJS.SHA256(verifier).toString(CryptoJS.enc.Base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function showError(message) {
    const popup = document.getElementById('errorPopup');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeError() {
    const popup = document.getElementById('errorPopup');
    popup.classList.remove('active');
    document.body.style.overflow = '';
}
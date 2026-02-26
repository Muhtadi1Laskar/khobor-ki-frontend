// Add this near your other state variables
let currentTheme = 'light';

// Initialize theme on page load (add to DOMContentLoaded)
const savedTheme = localStorage.getItem("theme");
if (savedTheme !== null && savedTheme.length > 0) {
    currentTheme = savedTheme;
    applyTheme(currentTheme);
}

// Toggle theme function
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// Apply theme function
function applyTheme(theme) {
    const body = document.body;
    const icon = document.getElementById('themeIcon');

    if (theme === 'dark') {
        body.classList.add('dark-theme');
        icon.textContent = '☀️'; // Sun icon for light mode
    } else {
        body.classList.remove('dark-theme');
        icon.textContent = '🌙'; // Moon icon for dark mode
    }
}

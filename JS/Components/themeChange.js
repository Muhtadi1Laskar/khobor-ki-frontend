// Add this near your other state variables
let currentTheme = 'light';
let themeToggleTimeout = null;

// Initialize theme on page load (add to DOMContentLoaded)
const savedTheme = localStorage.getItem("theme");
if (savedTheme !== null && savedTheme.length > 0) {
    currentTheme = savedTheme;
    applyTheme(currentTheme);
}

// Toggle theme function
function toggleTheme() {
    // Clear any pending toggle
    if (themeToggleTimeout) {
        clearTimeout(themeToggleTimeout);
    }
    
    // Debounce: wait 100ms before applying theme change
    themeToggleTimeout = setTimeout(() => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
        
        // Optional: Add temporary class for transition optimization
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }, 100);
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

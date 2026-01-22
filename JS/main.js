// Configuration
const API_BASE_URL = 'https://khobor-ki-backend.onrender.com/api/feed';
// const API_BASE_URL = 'http://localhost:8080/api/feed';
const ITEMS_PER_PAGE = 10;

// Language translations
const translations = {
    en: {
        all: 'All',
        national: 'National',
        international: 'International',
        sports: 'Sports',
        tech: 'Tech',
        filters: 'Filters',
        filterBySource: 'Filter by Source',
        applyFilters: 'Apply Filters',
        clearAll: 'Clear All',
        loadingNews: 'Loading news',
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        noNewsAvailable: 'No news available',
        tryAdjusting: 'Try adjusting your filters or check back later',
        unableToLoad: 'Unable to load news',
        makeSureBackend: 'Please make sure the backend server is running on https://khobor-ki-backend.onrender.com/'
    },
    bn: {
        all: 'সব',
        national: 'জাতীয়',
        international: 'আন্তর্জাতিক',
        sports: 'খেলাধুলা',
        tech: 'প্রযুক্তি',
        filters: 'ফিল্টার',
        filterBySource: 'সূত্র অনুসারে ফিল্টার করুন',
        applyFilters: 'ফিল্টার প্রয়োগ করুন',
        clearAll: 'সব মুছুন',
        loadingNews: 'খবর লোড হচ্ছে',
        previous: 'আগের',
        next: 'পরবর্তী',
        page: 'পৃষ্ঠা',
        noNewsAvailable: 'কোনো খবর নেই',
        tryAdjusting: 'আপনার ফিল্টার সামঞ্জস্য করুন বা পরে আবার চেষ্টা করুন',
        unableToLoad: 'খবর লোড করা যায়নি',
        makeSureBackend: 'অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার https://khobor-ki-backend.onrender.com/ এ চলছে'
    }
};

// Current language
let currentLang = 'bn';

const NEWS_SOURCES = {
    en: [
        'Prothom Alo',
        'Kaler Kantho',
        'Daily Noya Diganta',
        'Jugantor',
        'Amar Desh',
        'Daily Sangram',
        'Bonik Bartha (Bangla)',
        'Bonik Bartha (English)',
        'The Business Standard (Bangla)',
        'The Business Standard (English)',
        'The Daily Star',
        'The Financial Times',
        'The Daily Observer'
    ],
    bn: [
        'প্রথম আলো',
        'কালের কণ্ঠ',
        'নয়া দিগন্ত',
        'জুগান্তর',
        'আমার দেশ',
        'দৈনিক সংগ্রাম',
        'বণিক বার্তা (বাংলা)',
        'বণিক বার্তা (ইংরেজি)',
        'দ্য বিজনেস স্ট্যান্ডার্ড (বাংলা)',
        'দ্য বিজনেস স্ট্যান্ডার্ড (ইংরেজি)',
        'দ্য ডেইলি স্টার',
        'দ্য ফিন্যান্সিয়াল টাইমস',
        'দ্য ডেইলি অবজার্ভার'
    ]
};

// Source name mapping (English names are used for API calls)
const SOURCE_API_NAMES = [
    'Prothom Alo',
    'Kaler Kantho',
    'Daily Noya Diganta',
    'Jugantor',
    'Amar Desh',
    'Daily Sangram',
    'Bonik Bartha (Bangla)',
    'Bonik Bartha (English)',
    'The Business Standard (Bangla)',
    'The Business Standard (English)',
    'The Daily Star',
    'The Financial Times',
    'The Daily Observer'
];

// State management
let currentCategory = 'all';
let currentPage = 1;
let selectedSources = [];
let newsData = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage !== null && savedLanguage.length > 0) {
        currentLang = savedLanguage;
    }

    const storedFilters = localStorage.getItem("selected-filters");
    if(storedFilters !== null) {
        try {
            const parsedFilters = JSON.parse(storedFilters);
            if(Array.isArray(parsedFilters)) {
                selectedSources = parsedFilters;
            }
        } catch (error) {
            console.error("Error parsing stored filters: ", error);
            localStorage.removeItem("selected-filters");
        }
    }

    updateLanguage();
    setupNavigation();
    loadSourceFilters();
    updateActiveFilters();
    checkSavedFilters(selectedSources);
    loadNews();
});

function checkSavedFilters(savedFilters) {
    const checkboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]');
    checkboxes.forEach(box => {
        if(savedFilters.includes(box.value)) {
            box.checked = true;
        }
    });
}

// Toggle language
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'bn' : 'en';
    updateLanguage();
    updateSourceLabels();
    updateActiveFilters();
}

// Update all text based on current language
function updateLanguage() {
    const icon = document.getElementById('langIcon');
    icon.textContent = currentLang === 'en' ? '🇧🇩' : '🇬🇧';

    localStorage.setItem('language', currentLang);

    // Update all elements with data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // Update page info separately to preserve page number
    updatePageInfo();
}

// Update page info text
function updatePageInfo() {
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.innerHTML = `<span data-lang-key="page">${translations[currentLang].page}</span> ${currentPage}`;
    }
}

// Load source filter checkboxes
function loadSourceFilters() {
    const grid = document.getElementById('sourceGrid');
    const sources = NEWS_SOURCES[currentLang];

    grid.innerHTML = sources.map((source, index) => `
                <div class="source-checkbox">
                    <input type="checkbox" id="source-${index}" value="${SOURCE_API_NAMES[index]}" data-source-index="${index}">
                    <label for="source-${index}">${source}</label>
                </div>
            `).join('');
}

// Update source filter labels when language changes
function updateSourceLabels() {
    const sources = NEWS_SOURCES[currentLang];
    document.querySelectorAll('.source-checkbox').forEach((checkbox, index) => {
        const label = checkbox.querySelector('label');
        if (label && sources[index]) {
            label.textContent = sources[index];
        }
    });
}

// Toggle filter panel
function toggleFilters() {
    const panel = document.getElementById('filterPanel');
    const button = document.querySelector('.filter-button');
    panel.classList.toggle('open');
    button.classList.toggle('active');
}

// Apply filters
function applyFilters() {
    const checkboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]:checked');
    selectedSources = Array.from(checkboxes).map(cb => cb.value);

    localStorage.setItem("selected-filters", JSON.stringify(selectedSources));

    currentPage = 1;
    loadNews();
    updateActiveFilters();
    toggleFilters();
}

// Clear all filters
function clearFilters() {
    const checkboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    selectedSources = [];

    currentPage = 1;
    loadNews();
    updateActiveFilters();
}

// Update active filter tags
function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (selectedSources.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = selectedSources.map(source => {
        // Find the index of the source in API names
        const sourceIndex = SOURCE_API_NAMES.indexOf(source);
        // Get the display name in current language
        const displayName = sourceIndex !== -1 ? NEWS_SOURCES[currentLang][sourceIndex] : source;

        return `
                    <div class="filter-tag">
                        ${displayName}
                        <button onclick="removeFilter('${source.replace(/'/g, "\\'")}')" title="Remove filter">×</button>
                    </div>
                `;
    }).join('');
}

// Remove individual filter
function removeFilter(source) {
    const checkbox = document.querySelector(`input[value="${source}"]`);
    if (checkbox) checkbox.checked = false;

    selectedSources = selectedSources.filter(s => s !== source);
    currentPage = 1;
    loadNews();
    updateActiveFilters();
}

// Setup navigation click handlers
function setupNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active state
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Load new category
            currentCategory = tab.dataset.category;
            currentPage = 1;
            loadNews();
        });
    });
}

// Build API URL based on category, pagination, and filters
function buildApiUrl(category, page, limit, sources) {
    let url = API_BASE_URL;

    // Add category if not 'all'
    if (category !== 'all') {
        url += `/${category}`;
    }

    // Add query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    // Add source filters if any - send each source as a separate paper parameter
    if (sources && sources.length > 0) {
        sources.forEach(source => {
            params.append('paper', source);
        });
    }

    return `${url}?${params.toString()}`;
}

// Load news from API
async function loadNews() {
    const container = document.getElementById('newsContainer');
    const pagination = document.getElementById('pagination');

    // Show loading state
    container.innerHTML = `<div class="loading">${translations[currentLang].loadingNews}</div>`;
    pagination.style.display = 'none';

    try {
        const url = buildApiUrl(currentCategory, currentPage, ITEMS_PER_PAGE, selectedSources);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        newsData = data;

        renderNews(data);
        updatePagination(data);

    } catch (error) {
        console.error('Error loading news:', error);
        container.innerHTML = `
                    <div class="error">
                        <h3>${translations[currentLang].unableToLoad}</h3>
                        <p>${translations[currentLang].makeSureBackend}</p>
                        <p style="margin-top: 12px; font-size: 12px; color: #9ca3af;">Error: ${error.message}</p>
                    </div>
                `;
    }
}

// Render news items
function renderNews(data) {
    const container = document.getElementById('newsContainer');

    // Check if data is empty
    if (!data || (Array.isArray(data) && data.length === 0) ||
        (data.items && data.items.length === 0)) {
        container.innerHTML = `
                    <div class="empty-state">
                        <h3>${translations[currentLang].noNewsAvailable}</h3>
                        <p>${translations[currentLang].tryAdjusting}</p>
                    </div>
                `;
        return;
    }

    // Handle both array and object with items property
    const items = Array.isArray(data) ? data : (data.items || []);

    const newsHTML = `
                <div class="news-list">
                    ${items.map((item) => `
                        <div class="news-item">
                            <div class="news-content">
                                <div class="news-title">
                                    <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                                        ${escapeHtml(item.title)}
                                    </a>
                                </div>
                                <div class="news-meta">
                                    <span class="news-source">${escapeHtml(item.source)}</span>
                                    <span class="meta-separator">•</span><span>${renderTime(item)}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

    container.innerHTML = newsHTML;
}

// Update pagination controls
function updatePagination(data) {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Handle both array and object with pagination info
    const items = Array.isArray(data) ? data : (data.items || []);
    const hasMore = data.hasMore !== undefined ? data.hasMore : items.length === ITEMS_PER_PAGE;

    // Show pagination only if there are items
    if (items.length > 0) {
        pagination.style.display = 'flex';
        updatePageInfo();

        // Disable previous button on first page
        prevBtn.disabled = currentPage === 1;

        // Disable next button if no more items
        nextBtn.disabled = !hasMore;
    } else {
        pagination.style.display = 'none';
    }
}

// Change page
function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    loadNews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderTime(article) {
    const date = article.dataSource === "published" ?
        article.publishedDate :
        article.sortDate;
    return `Added on ${formatAbsoluteDate(date)}`;
}

function formatRelativeDate(epochSeconds) {
    const date = new Date(epochSeconds * 1000);
    const now = new Date();

    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatAbsoluteDate(epochSeconds);
}

function formatAbsoluteDate(epochSeconds) {
    return new Date(epochSeconds * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
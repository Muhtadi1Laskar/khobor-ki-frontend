// Configuration
const API_BASE_URL = 'https://khobor-ki-backend.onrender.com/api';
// const API_BASE_URL = 'http://localhost:8080/api';
const FEED_URL = `${API_BASE_URL}/feed`
const ITEMS_PER_PAGE = 30;

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
        banglaSources: 'Bangla Sources',
        englishSources: 'English Sources',
        applyFilters: 'Apply Filters',
        clearAll: 'Clear All',
        loadingNews: 'Loading news',
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        noNewsAvailable: 'No news available',
        tryAdjusting: 'Try adjusting your filters or check back later',
        unableToLoad: 'Unable to load news',
        makeSureBackend: 'Please make sure the backend server is running',
        clusters: 'Clusters',
        articles: 'articles',
        viewArticles: 'View all articles',
        hideArticles: 'Hide articles',
        sources: 'Sources',
        addedOn: 'Added on',
        trending: 'Trending',
        clusters: 'Clusters',

        articles: 'articles',
        viewAllArticles: 'View all articles',
        hideArticles: 'Hide articles',
        sources: 'sources',
        coveredBy: 'Covered by',
        moreSources: 'more',
        sources: 'sources',

        today: 'Today in 2 Minutes',
        topStories: 'Top Stories',
        updatedMinAgo: 'Updated minutes ago',
        articles: 'articles',
        sources: 'sources',
        topCoverage: 'Top Coverage',
        viewAllArticles: 'View all articles',

        coverageAnalysis: 'Coverage Analysis',
        learnMore: 'Learn more',
        howManySources: 'How many sources?',
        differentAngles: 'Different angles?',

        compareHeadlines: 'Compare Headlines Side-by-Side',
        showListView: 'Show List View',
        comparisonInfo: 'Highlighted words show how different outlets frame this story',

        banglaLabel: 'Bangla',
        englishLabel: 'English',
    },
    bn: {
        all: 'সব',
        national: 'জাতীয়',
        international: 'আন্তর্জাতিক',
        sports: 'খেলাধুলা',
        tech: 'প্রযুক্তি',
        filters: 'ফিল্টার',
        filterBySource: 'সূত্র অনুসারে ফিল্টার করুন',
        banglaSources: 'বাংলা উৎস',
        englishSources: 'ইংরেজি উৎস',
        applyFilters: 'ফিল্টার প্রয়োগ করুন',
        clearAll: 'সব মুছুন',
        loadingNews: 'খবর লোড হচ্ছে',
        previous: 'আগের',
        next: 'পরবর্তী',
        page: 'পৃষ্ঠা',
        noNewsAvailable: 'কোনো খবর নেই',
        tryAdjusting: 'আপনার ফিল্টার সামঞ্জস্য করুন বা পরে আবার চেষ্টা করুন',
        unableToLoad: 'খবর লোড করা যায়নি',
        makeSureBackend: 'অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চলছে',
        clusters: 'ক্লাস্টার',
        articles: 'নিবন্ধ',
        viewArticles: 'সব নিবন্ধ দেখুন',
        hideArticles: 'নিবন্ধ লুকান',
        sources: 'উৎস',
        addedOn: 'যোগ করা হয়েছে',
        trending: 'জনপ্রিয়',
        clusters: 'ক্লাস্টার',

        trending: 'জনপ্রিয়',
        articles: 'নিবন্ধ',
        viewAllArticles: 'সব নিবন্ধ দেখুন',
        hideArticles: 'নিবন্ধ লুকান',
        sources: 'উৎস',
        coveredBy: 'টি সূত্র',
        moreSources: 'আরও',
        sources: 'সূত্র',

        today: 'আজকের ২ মিনিট',
        topStories: 'শীর্ষ খবর',
        updatedMinAgo: 'মিনিট আগে আপডেট',
        articles: 'নিবন্ধ',
        sources: 'সূত্র',
        topCoverage: 'শীর্ষ কভারেজ',
        viewAllArticles: 'সব নিবন্ধ দেখুন',

        coverageAnalysis: 'কভারেজ বিশ্লেষণ',
        learnMore: 'আরও জানুন',
        howManySources: 'কতগুলি সূত্র?',
        differentAngles: 'ভিন্ন দৃষ্টিকোণ?',

        compareHeadlines: 'শিরোনাম পাশাপাশি তুলনা করুন',
        showListView: 'তালিকা ভিউ দেখান',
        comparisonInfo: 'হাইলাইট করা শব্দগুলি দেখায় বিভিন্ন আউটলেট কীভাবে এই গল্পটি উপস্থাপন করে',

        banglaLabel: 'বাংলা',
        englishLabel: 'ইংরেজি',
    }
};

// Current language
let currentLang = 'bn';
let currentSourceLang = 'bangla'; // tracks which source group is shown

// News sources organized by language
const NEWS_SOURCES = {
    bangla: {
        api: [
            'Prothom Alo',
            'Kaler Kantho',
            'Daily Noya Diganta',
            'Jugantor',
            'Amar Desh',
            'The Daily Ittefaq',
            'Daily Sangram',
            'Bangladesh Pratidin',
            'Bonik Bartha (Bangla)',
            'The Business Standard (Bangla)',
            'Dhaka Tribune',
            'Jagonews24',
            'bd24live',
            'Amar Bangla BD',
            'Risingbd.com',
            'The New Nation (Bangla)',
            'Dhaka Mail',
            'channelionline',
            'Asian Tv Online',
            'Boishakhi Online'
        ],
        en: [
            'Prothom Alo',
            'Kaler Kantho',
            'Daily Noya Diganta',
            'Jugantor',
            'Amar Desh',
            'The Daily Ittefaq',
            'Daily Sangram',
            'Bangladesh Pratidin',
            'Bonik Bartha (Bangla)',
            'The Business Standard (Bangla)',
            'Dhaka Tribune',
            'Jagonews24',
            'bd24live',
            'Amar Bangla BD',
            'Risingbd.com',
            'The New Nation (Bangla)',
            'Dhaka Mail',
            'Channel I Online',
            'Asian Tv Online',
            'Boishakhi Online'
        ],
        bn: [
            'প্রথম আলো',
            'কালের কণ্ঠ',
            'নয়া দিগন্ত',
            'জুগান্তর',
            'আমার দেশ',
            'দৈনিক ইত্তেফাক',
            'দৈনিক সংগ্রাম',
            'বাংলাদেশ প্রতিদিন',
            'বণিক বার্তা (বাংলা)',
            'দ্য বিজনেস স্ট্যান্ডার্ড (বাংলা)',
            'ঢাকা ট্রিবিউন',
            'জাগোনিউজ24',
            'বিডি24লাইভ',
            'আমার বাংলা বিডি',
            'রাইজিংবিডি ডটকম',
            'দ্য নিউ নেশন (বাংলা)',
            'ঢাকা মেইল',
            'channelionline',
            'এশিয়ান টিভি অনলাইন',
            'বৈশাখী অনলাইন'
        ]
    },
    english: {
        api: [
            'Prothom Alo (English)',
            'Bonik Bartha (English)',
            'The Business Standard (English)',
            'The Daily Star',
            'The Financial Times',
            'The Daily Observer',
            'Ars Technica',
            'investinglive.com',
            'Tech Crunch',
            'Wired',
            'The Hacker News',
            'The Verge',
            'The New Age',
            'The New Nation',
            'The Daily Times Of Bangladesh',
            'Bangladesh Post',
            'The Register'
        ],
        en: [
            'Prothom Alo (English)',
            'Bonik Bartha (English)',
            'The Business Standard (English)',
            'The Daily Star',
            'The Financial Times',
            'The Daily Observer',
            'Ars Technica',
            'investinglive.com',
            'Tech Crunch',
            'Wired',
            'The Hacker News',
            'The Verge',
            'The New Age',
            'The New Nation',
            'The Daily Times Of Bangladesh',
            'Bangladesh Post',
            'The Register'
        ],
        bn: [
            'প্রথম আলো (ইংরেজি)',
            'বণিক বার্তা (ইংরেজি)',
            'দ্য বিজনেস স্ট্যান্ডার্ড (ইংরেজি)',
            'দ্য ডেইলি স্টার',
            'দ্য ফিন্যান্সিয়াল টাইমস',
            'দ্য ডেইলি অবজার্ভার',
            'আরস টেকনিকা',
            'ইনভেস্টিং লাইভ ডট কম',
            'টেকক্রাঞ্চ',
            'ওয়্যার্ড',
            'দ্য হ্যাকার নিউজ',
            'দ্য ভার্জ',
            'নিউ এজ',
            'দ্য নিউ নেশন',
            'দ্য ডেইলি টাইমস অফ বাংলাদেশ',
            'দ্য বাংলাদেশ পোস্ট',
            'দ্য রেজিস্টার'
        ]
    }
};

// State management
let currentCategory = 'all';
let currentPage = 1;
let selectedSources = [];
let newsData = [];

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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage !== null && savedLanguage.length > 0) {
        currentLang = savedLanguage;
    }

    const storedFilters = localStorage.getItem("selected-filters");
    if (storedFilters !== null) {
        try {
            const parsedFilters = JSON.parse(storedFilters);
            if (Array.isArray(parsedFilters)) {
                selectedSources = parsedFilters;
            }
        } catch (error) {
            console.error("Error parsing stored filters: ", error);
            localStorage.removeItem("selected-filters");
        }
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme !== null && savedTheme.length > 0) {
        currentTheme = savedTheme;
        applyTheme(currentTheme)
    }

    updateLanguage();
    setupNavigation();
    loadSourceFilters();
    updateActiveFilters();
    checkSavedFilters(selectedSources);
    loadNews();
});

// Switch between Bangla and English source groups
function switchSourceLanguage(lang) {
    // First, save the current selections before switching
    const currentCheckboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]:checked');
    const currentSelections = Array.from(currentCheckboxes).map(cb => cb.value);

    // Merge with existing selectedSources (in case user hasn't applied yet)
    currentSelections.forEach(source => {
        if (!selectedSources.includes(source)) {
            selectedSources.push(source);
        }
    });

    currentSourceLang = lang;

    // Update button states
    document.querySelectorAll('.source-lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Reload source filters for the selected language group
    loadSourceFilters();

    // Restore ALL selections (both from selectedSources and current session)
    checkSavedFilters(selectedSources);
}

// Load source filter checkboxes
function loadSourceFilters() {
    const grid = document.getElementById('sourceGrid');
    const sources = NEWS_SOURCES[currentSourceLang];

    grid.innerHTML = sources.api.map((apiName, index) => `
                <div class="source-checkbox">
                    <input type="checkbox" id="source-${currentSourceLang}-${index}" value="${apiName}" data-source-lang="${currentSourceLang}" data-source-index="${index}">
                    <label for="source-${currentSourceLang}-${index}">${sources[currentLang][index]}</label>
                </div>
            `).join('');
}

function checkSavedFilters(savedFilters) {
    const checkboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]');
    checkboxes.forEach(box => {
        if (savedFilters.includes(box.value)) {
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

    if (currentCategory === "clusters") {
        updateClusterLanguage();
    }
}

function updateClusterLanguage() {
    // Update all "covered by" messages
    document.querySelectorAll('[data-cluster-covered]').forEach(element => {
        const articleCount = parseInt(element.getAttribute('data-cluster-covered'));
        element.innerHTML = setCoveredMessage(currentLang, articleCount, translations[currentLang]);
    });

    // Update "more sources" text
    document.querySelectorAll('[data-more-sources]').forEach(element => {
        const moreCount = parseInt(element.getAttribute('data-more-sources'));
        element.textContent = `+${moreCount} ${translations[currentLang].moreSources}`;
    });
}

// Update all text based on current language
function updateLanguage() {
    const icon = document.getElementById('langIcon');
    icon.textContent = currentLang === 'en' ? '🇧🇩' : '🇬🇧';
    localStorage.setItem('language', currentLang);

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    updatePageInfo();
}

// Update page info text
function updatePageInfo() {
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.innerHTML = `<span data-lang-key="page">${translations[currentLang].page}</span> ${currentPage}`;
    }
}

// Update source filter labels when language changes
function updateSourceLabels() {
    const sources = NEWS_SOURCES[currentSourceLang];
    document.querySelectorAll('.source-checkbox').forEach((checkbox, index) => {
        const label = checkbox.querySelector('label');
        if (label && sources[currentLang][index]) {
            label.textContent = sources[currentLang][index];
        }
    });
}

// Add this at the top with other state variables (around line with let currentCategory = 'all';)
let tempSelectedSources = []; // Tracks selections during filter panel session

// Modified: When opening filter panel, initialize temp state
function toggleFilters() {
    if (currentCategory === "clusters") {
        return;
    }

    const panel = document.getElementById('filterPanel');
    const button = document.querySelector('.filter-button');

    if (!panel.classList.contains('open')) {
        // Opening - copy current selections to temp
        tempSelectedSources = [...selectedSources];
    }

    panel.classList.toggle('open');
    button.classList.toggle('active');
}

// Modified: Switch between Bangla and English source groups
function switchSourceLanguage(lang) {
    // Save current visible checkbox states to temp
    const currentCheckboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]:checked');
    const currentSelections = Array.from(currentCheckboxes).map(cb => cb.value);

    // Update temp with current selections
    currentSelections.forEach(source => {
        if (!tempSelectedSources.includes(source)) {
            tempSelectedSources.push(source);
        }
    });

    // Remove unchecked items from temp
    const allCurrentCheckboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]');
    allCurrentCheckboxes.forEach(cb => {
        if (!cb.checked && tempSelectedSources.includes(cb.value)) {
            tempSelectedSources = tempSelectedSources.filter(s => s !== cb.value);
        }
    });

    currentSourceLang = lang;

    // Update button states
    document.querySelectorAll('.source-lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Reload source filters
    loadSourceFilters();

    // Restore from temp
    checkSavedFilters(tempSelectedSources);
}

// Modified: Apply filters
function applyFilters() {
    // Get current visible selections
    const currentCheckboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]:checked');
    const currentSelections = Array.from(currentCheckboxes).map(cb => cb.value);

    // Update temp with current tab
    currentSelections.forEach(source => {
        if (!tempSelectedSources.includes(source)) {
            tempSelectedSources.push(source);
        }
    });

    // Remove unchecked from current view
    const allCurrentCheckboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]');
    allCurrentCheckboxes.forEach(cb => {
        if (!cb.checked && tempSelectedSources.includes(cb.value)) {
            tempSelectedSources = tempSelectedSources.filter(s => s !== cb.value);
        }
    });

    // Apply temp to actual selectedSources
    selectedSources = [...tempSelectedSources];
    localStorage.setItem("selected-filters", JSON.stringify(selectedSources));

    currentPage = 1;
    loadNews();
    updateActiveFilters();
    toggleFilters();
}

// Modified: Clear all filters
function clearFilters() {
    const checkboxes = document.querySelectorAll('.source-checkbox input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    selectedSources = [];
    tempSelectedSources = [];
    localStorage.setItem("selected-filters", JSON.stringify(selectedSources));

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

    container.innerHTML = selectedSources.map(apiName => {
        // Find the source in either bangla or english group
        let displayName = apiName;
        for (const lang of ['bangla', 'english']) {
            const idx = NEWS_SOURCES[lang].api.indexOf(apiName);
            if (idx !== -1) {
                displayName = NEWS_SOURCES[lang][currentLang][idx];
                break;
            }
        }

        return `
                <div class="filter-tag">
                    ${displayName}
                    <button onclick="removeFilter('${apiName.replace(/'/g, "\\'")}')" title="Remove filter">×</button>
                </div>
            `;
    }).join('');
}

// Remove individual filter
function removeFilter(source) {
    // Remove from selectedSources
    selectedSources = selectedSources.filter(s => s !== source);

    // Save to localStorage
    localStorage.setItem("selected-filters", JSON.stringify(selectedSources));

    // Find and uncheck ALL checkboxes with this value (might be in hidden tab)
    document.querySelectorAll(`input[value="${CSS.escape(source)}"]`).forEach(cb => {
        cb.checked = false;
    });

    // Reload news with updated filters
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
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            currentCategory = tab.dataset.category;
            currentPage = 1;

            // Close filter panel and disable for non-news tabs
            const filterPanel = document.getElementById('filterPanel');
            const filterButton = document.querySelector('.filter-button');

            if (currentCategory === 'clusters' || currentCategory === 'today') {
                filterPanel.classList.remove('open');
                filterButton.classList.remove('active');
                filterButton.disabled = true;
                filterButton.style.opacity = '0.5';
                filterButton.style.cursor = 'not-allowed';

                if (currentCategory === 'clusters') {
                    loadClusters();
                } else {
                    loadTodayInTwoMinutes();
                }
            } else {
                filterButton.disabled = false;
                filterButton.style.opacity = '1';
                filterButton.style.cursor = 'pointer';
                loadNews();
            }
        });
    });
}

// Build API URL
function buildApiUrl(category, page, limit, sources) {
    let url = FEED_URL;
    if (category !== 'all') url += `/${category}`;

    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    if (sources && sources.length > 0) {
        sources.forEach(source => params.append('paper', source));
    }

    return `${url}?${params.toString()}`;
}

// Load news from API
async function loadNews() {
    const container = document.getElementById('newsContainer');
    const pagination = document.getElementById('pagination');

    container.innerHTML = `<div class="loading">${translations[currentLang].loadingNews}</div>`;
    pagination.style.display = 'none';

    try {
        const url = buildApiUrl(currentCategory, currentPage, ITEMS_PER_PAGE, selectedSources);
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
    console.log('Loading news with sources:', selectedSources);
}

// Render news items
function renderNews(data) {
    const container = document.getElementById('newsContainer');

    if (!data || (Array.isArray(data) && data.length === 0) || (data.items && data.items.length === 0)) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>${translations[currentLang].noNewsAvailable}</h3>
                <p>${translations[currentLang].tryAdjusting}</p>
            </div>
        `;
        return;
    }

    const items = Array.isArray(data) ? data : (data.items || []);


    // Create the card-based grid layout
    // In renderNews() function, update the news card structure:
    const newsHTML = `
        <div class="news-list">
            ${items.map((item) => `
                <div class="news-item">
                    <div class="news-card-header">
                        <img src="https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=32" 
                            alt="" 
                            class="news-source-favicon"
                            onerror="this.style.display='none'">
                        <div class="news-card-meta">
                            <span class="news-source-name">${escapeHtml(item.source)}</span>
                            
                        </div>
                        ${getSourceBadge(item.source)}
                    </div>
                    
                    <div class="news-content">
                        <h3 class="news-title">
                            <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                                ${escapeHtml(item.title)}
                            </a>
                        </h3>
                        
                        ${item.description ? `
                            <p class="news-excerpt">${escapeHtml(item.description.substring(0, 150))}...</p>
                        ` : ''}
                        
                        <div class="news-footer">
                            <span class="news-date">
                                <span class="date-icon">📅</span>
                                ${formatDate(item)}
                            </span>
                            ${getCategoryBadge(item.category || currentCategory)}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = newsHTML;
}


// Source badge (Bangla/English indicator)
function getSourceBadge(source) {
    const isBangla = NEWS_SOURCES.bangla.api.includes(source);
    return `
        <span class="source-lang-badge ${isBangla ? 'bangla' : 'english'}" data-lang-key="${isBangla ? 'banglaLabel' : 'englishLabel'}">
            ${isBangla ? translations[currentLang].banglaLabel || 'বাংলা' : translations[currentLang].englishLabel || 'EN'}
        </span>
    `;
}

// Recency badge (Breaking/New)
function getRecencyBadge(item) {
    const timestamp = item.dataSource === "published" ? item.publishedDate : item.sortDate;
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600);
    
    if (hours < 1) {
        return `<span class="recency-badge breaking">🔴 ${translations[currentLang].breaking || 'Breaking'}</span>`;
    } else if (hours < 6) {
        return `<span class="recency-badge new">${translations[currentLang].new || 'New'}</span>`;
    }
    return '';
}

// Category badge
function getCategoryBadge(category) {
    const categoryIcons = {
        all: '📰',
        national: '🏛️',
        international: '🌍',
        sports: '⚽',
        tech: '💻'
    };
    
    return `
        <span class="category-badge">
            <span class="category-icon">${categoryIcons[category] || '📰'}</span>
            <span class="category-text" data-lang-key="${category}">${translations[currentLang][category] || category}</span>
        </span>
    `;
}



// Update pagination
function updatePagination(data) {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const items = Array.isArray(data) ? data : (data.items || []);
    const hasMore = data.hasMore !== undefined ? data.hasMore : items.length === ITEMS_PER_PAGE;

    if (items.length > 0) {
        pagination.style.display = 'flex';
        updatePageInfo();
        prevBtn.disabled = currentPage === 1;
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

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(article) {
    const date = article.dataSource === "published" ? article.publishedDate : article.sortDate;
    return `${new Date(date * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })}`;
}

function formatDates(date) {
    return `${new Date(date * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })}`;
}
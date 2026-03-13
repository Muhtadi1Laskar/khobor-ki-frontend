// Configuration
const API_BASE_URL = 'https://khobor-ki-backend.onrender.com/api';
// const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = '/api'
const FEED_URL = `${API_BASE_URL}/feed`
const ITEMS_PER_PAGE = 30;

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
// async function loadNews() {
//     const container = document.getElementById('newsContainer');
//     const pagination = document.getElementById('pagination');
//     const loadingScreen = document.getElementById('loadingScreen');
//     const loadingMessage = document.getElementById('loadingText');
//     const savedLanguage = localStorage.getItem("language");

//     container.innerHTML = `<div class="loading">${translations[currentLang].loadingNews}</div>`;

//     if (loadingScreen) {
//         loadingScreen.display = "none";
//         if (savedLanguage == "en") {
//             loadingMessage.innerText = `${translations["en"]["tagline"]}`;
//         }
//     }

//     pagination.style.display = 'none';

//     try {
//         const url = buildApiUrl(currentCategory, currentPage, ITEMS_PER_PAGE, selectedSources);
//         const response = await fetch(url);

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//         const data = await response.json();
//         newsData = data;
//         renderNews(data);
//         updatePagination(data);

//     } catch (error) {
//         console.error('Error loading news:', error);
//         container.innerHTML = `
//                 <div class="error">
//                     <h3>${translations[currentLang].unableToLoad}</h3>
//                     <p>${translations[currentLang].makeSureBackend}</p>
//                     <p style="margin-top: 12px; font-size: 12px; color: #9ca3af;">Error: ${error.message}</p>
//                 </div>
//             `;
//     } finally {
//         if (loadingScreen) {
//             setTimeout(() => {
//                 loadingScreen.classList.add("hidden");
//             }, 300);
//         }
//     }
// }


async function loadNews() {
    const container = document.getElementById('newsContainer');
    const pagination = document.getElementById('pagination');
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingMessage = document.getElementById('loadingText');
    const savedLanguage = localStorage.getItem("language");

    const SKELETON_DELAY = 100; // Show skeleton after 300ms delay
    
    // ✅ Delayed skeleton approach
    let skeletonTimeout = setTimeout(() => {
        container.innerHTML = renderNewsSkeleton(12); // Show 12 skeleton cards
    }, SKELETON_DELAY);

    // if (loadingScreen) {
    //     loadingScreen.style.display = "none";
    //     if (savedLanguage == "en") {
    //         loadingMessage.innerText = `${translations["en"]["tagline"]}`;
    //     }
    // }

    pagination.style.display = 'none';

    try {
        const url = buildApiUrl(currentCategory, currentPage, ITEMS_PER_PAGE, selectedSources);
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        
        // ✅ Clear skeleton timeout - data arrived
        clearTimeout(skeletonTimeout);
        
        newsData = data;
        renderNews(data);
        updatePagination(data);

    } catch (error) {
        clearTimeout(skeletonTimeout);
        console.error('Error loading news:', error);
        container.innerHTML = `
            <div class="error">
                <h3>${translations[currentLang].unableToLoad}</h3>
                <p>${translations[currentLang].makeSureBackend}</p>
                <p style="margin-top: 12px; font-size: 12px; color: #9ca3af;">Error: ${error.message}</p>
            </div>
        `;
    } finally {
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add("hidden");
            }, 300);
        }
    }
}

// ============================================
// NEWS SKELETON LOADER
// ============================================

function renderNewsSkeleton(count) {
    count = count || 12; // Default to 12 cards
    
    let skeletonCards = '';
    
    for (let i = 0; i < count; i++) {
        skeletonCards += `
            <div class="news-item skeleton-news-item" style="animation-delay: ${i * 0.03}s">
                <div class="news-card-header">
                    <div class="skeleton skeleton-favicon"></div>
                    <div class="news-card-meta">
                        <div class="skeleton skeleton-source-name"></div>
                    </div>
                    <div class="skeleton skeleton-badge"></div>
                </div>
                
                <div class="news-content">
                    <div class="skeleton-title-wrapper">
                        <div class="skeleton skeleton-title-line"></div>
                        <div class="skeleton skeleton-title-line"></div>
                        <div class="skeleton skeleton-title-line-short"></div>
                    </div>
                    
                    <div class="skeleton-excerpt-wrapper">
                        <div class="skeleton skeleton-excerpt-line"></div>
                        <div class="skeleton skeleton-excerpt-line"></div>
                    </div>
                    
                    <div class="news-footer">
                        <div class="skeleton skeleton-date"></div>
                        <div class="skeleton skeleton-category-badge"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    return `<div class="news-list">${skeletonCards}</div>`;
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
        technology: '💻'
    };

    return `
        <span class="category-badge">
            <span class="category-icon">${categoryIcons[category] || '📰'}</span>
            <span class="category-text" data-lang-key="${category}">${translations[currentLang][category] || category}</span>
        </span>
    `;
}


// ============================================
// HASH NAVIGATION - Scroll to shared cluster
// ============================================

function handleHashNavigation() {
    const hash = window.location.hash;
    
    if (hash && hash.startsWith('#cluster-')) {
        const clusterId = hash.replace('#cluster-', '');
        
        // Need to ensure we're on the clusters tab first
        const clusterTab = document.querySelector('[data-category="clusters"]');
        if (clusterTab && !clusterTab.classList.contains('active')) {
            // Switch to clusters tab
            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
            clusterTab.classList.add('active');
            currentCategory = 'clusters';
            
            // Load clusters
            loadClusters();
        }
        
        // Wait for clusters to load, then scroll to the target cluster
        const scrollToCluster = () => {
            const targetButton = document.getElementById(`btn-${clusterId}`);
            const clusterCard = targetButton?.closest('.cluster-card');
            
            if (clusterCard) {
                // Scroll to cluster
                clusterCard.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Highlight cluster temporarily
                clusterCard.style.outline = '3px solid var(--color-primary)';
                clusterCard.style.outlineOffset = '4px';
                
                // Auto-expand the cluster
                const previewSection = document.getElementById(`preview-${clusterId}`);
                if (previewSection && !previewSection.classList.contains('show')) {
                    toggleClusterArticles(clusterId);
                }
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    clusterCard.style.outline = '';
                    clusterCard.style.outlineOffset = '';
                }, 3000);
                
                // Clear hash after scrolling (optional - keeps URL clean)
                // history.replaceState(null, null, ' ');
            } else {
                // Cluster not found yet, try again in 500ms
                setTimeout(scrollToCluster, 500);
            }
        };
        
        // Start checking for the cluster
        setTimeout(scrollToCluster, 100);
    }
}

// Check hash on page load
window.addEventListener('DOMContentLoaded', handleHashNavigation);

// Check hash when it changes (back/forward navigation)
window.addEventListener('hashchange', handleHashNavigation);
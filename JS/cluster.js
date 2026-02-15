// Modify setupNavigation() to handle clusters


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

// Load clusters from API
async function loadClusters() {
    const container = document.getElementById('newsContainer');
    const pagination = document.getElementById('pagination');

    container.innerHTML = `<div class="loading">${translations[currentLang].loadingNews}</div>`;
    pagination.style.display = 'none';

    try {
        const response = await fetch('https://khobor-ki-backend.onrender.com/api/cluster');

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        renderClusters(data);

    } catch (error) {
        console.error('Error loading clusters:', error);
        container.innerHTML = `
            <div class="error">
                <h3>${translations[currentLang].unableToLoad}</h3>
                <p>${translations[currentLang].makeSureBackend}</p>
                <p style="margin-top: 12px; font-size: 12px; color: #9ca3af;">Error: ${error.message}</p>
            </div>
        `;
    }
}

// Render clusters with timeline design
function renderClusters(clusters) {
    const container = document.getElementById('newsContainer');

    if (!clusters || clusters.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>${translations[currentLang].noNewsAvailable}</h3>
                <p>${translations[currentLang].tryAdjusting}</p>
            </div>
        `;
        return;
    }

    const clustersHTML = `
        <div class="cluster-list">
            ${clusters.map(cluster => `
                <div class="cluster-card">
                    <div class="cluster-timeline-header">
                        <div class="cluster-icon ${cluster.category.toLowerCase()}">
                            ${getCategoryIcon(cluster.category)}
                        </div>
                        <div class="cluster-header-content">
                            <a href="${cluster.articles[0].url}" target="_blank" rel="noopener noreferrer" class="cluster-title-link">
                                ${escapeHtml(cluster.representativeTitle)}
                            </a>
                            <div class="cluster-stats">
                                <div class="cluster-stat">
                                    <span data-cluster-covered="${cluster.articleCount}">
                                        ${setCoveredMessage(currentLang, cluster.articleCount, translations[currentLang])}
                                    </span>
                                </div>
                                <div class="cluster-stat">
                                    <span>📅</span> <span>${formatDates(cluster.createdAt)}</span>
                                </div>
                                <div class="cluster-stat">
                                    <span data-lang-key="${cluster.category.toLowerCase()}">${translations[currentLang][cluster.category.toLowerCase()] || cluster.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cluster-sources-row">
                        ${Object.entries(cluster.sources).slice(0, 3).map(([source, count]) => `
                            <div class="source-chip">
                                ${escapeHtml(source)}<span class="count">(${count})</span>
                            </div>
                        `).join('')}
                        ${Object.entries(cluster.sources).length > 3 ? `
                            <div class="source-chip more-sources" data-more-sources="${Object.entries(cluster.sources).length - 3}">
                                +${Object.entries(cluster.sources).length - 3} ${translations[currentLang].moreSources}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="cluster-preview" id="preview-${cluster._id}">
                        ${cluster.articles.map(article => `
                            <div class="preview-article">
                                <div class="preview-header">
                                    <img src="https://www.google.com/s2/favicons?domain=${new URL(article.url).hostname}&sz=32" 
                                        alt="" 
                                        class="source-favicon"
                                        onerror="this.style.display='none'">
                                    <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="preview-title">
                                        ${escapeHtml(article.title)}
                                    </a>
                                </div>
                                <div class="preview-meta">
                                    <span class="preview-source">${escapeHtml(article.source)}</span> • ${formatDates(article.sortDate)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button class="show-more-btn" onclick="toggleClusterArticles('${cluster._id}')" id="btn-${cluster._id}">
                        <span class="show-more-text" data-lang-key="viewAllArticles">${translations[currentLang].viewAllArticles}</span>
                        <span class="show-more-icon">▼</span>
                    </button>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = clustersHTML;
}

// Helper function to get category icon
function getCategoryIcon(category) {
    const icons = {
        national: '🏛️',
        international: '🌍',
        sports: '⚽',
        technology: '💻',
        default: '📰'
    };
    return icons[category.toLowerCase()] || icons.default;
}

// Helper function for covered message
function setCoveredMessage(currentLanguage, articleCount, translations) {
    const data = {
        "en": `<span>📰</span> ${translations["coveredBy"]} <span>${articleCount} ${translations["sources"]}</span>`,
        "bn": `<span>📰</span> <span>${articleCount} ${translations["coveredBy"]}</span>`
    }
    return data[currentLanguage];
}

// Update cluster language dynamically
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

// Toggle cluster articles visibility
function toggleClusterArticles(clusterId) {
    const preview = document.getElementById(`preview-${clusterId}`);
    const button = document.getElementById(`btn-${clusterId}`);
    const buttonText = button.querySelector('.show-more-text');

    preview.classList.toggle('show');
    button.classList.toggle('expanded');

    if (preview.classList.contains('show')) {
        buttonText.textContent = translations[currentLang].hideArticles;
    } else {
        buttonText.textContent = translations[currentLang].viewAllArticles;
    }
}
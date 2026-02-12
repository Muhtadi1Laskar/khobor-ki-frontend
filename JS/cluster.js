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

            // Check if clusters view
            if (currentCategory === 'clusters') {
                loadClusters();
            } else {
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

// Render clusters
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
                    <div class="cluster-header">
                        <h2 class="cluster-main-title">
                            <a href="${cluster.articles[0].url}" target="_blank" rel="noopener noreferrer">
                                ${escapeHtml(cluster.representativeTitle)}
                            </a>
                        </h2>
                        <div class="cluster-meta">
                            <span class="cluster-badge">
                                ${cluster.articleCount} ${translations[currentLang].articles}
                            </span>
                            <span class="cluster-badge category">
                                ${cluster.category}
                            </span>
                            <span class="cluster-badge language">
                                ${cluster.language}
                            </span>
                            <span class="meta-separator">•</span>
                            <span>${formatDates(cluster.createdAt)}</span>
                        </div>
                    </div>
                    
                    <div class="cluster-sources">
                        <div class="sources-title">${translations[currentLang].sources}:</div>
                        <div class="source-tags">
                            ${Object.entries(cluster.sources).map(([source, count]) => `
                                <span class="source-tag">
                                    ${escapeHtml(source)} <span class="source-count">(${count})</span>
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="cluster-articles">
                        <button class="articles-toggle" onclick="toggleClusterArticles('${cluster._id}')">
                            <span class="articles-toggle-text" data-cluster-id="${cluster._id}">
                                ${translations[currentLang].viewArticles}
                            </span>
                            <span class="articles-toggle-icon">▼</span>
                        </button>
                        <div class="cluster-articles-list" id="articles-${cluster._id}">
                            ${cluster.articles.map(article => `
                                <div class="cluster-article-item">
                                    <div class="cluster-article-title">
                                        <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                                            ${escapeHtml(article.title)}
                                        </a>
                                    </div>
                                    <div class="cluster-article-meta">
                                        <span class="cluster-article-source">${escapeHtml(article.source)}</span>
                                        <span class="meta-separator">•</span>
                                        <span>${formatDates(article.sortDate)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = clustersHTML;
}

// Toggle cluster articles visibility
function toggleClusterArticles(clusterId) {
    const articlesList = document.getElementById(`articles-${clusterId}`);
    const toggleBtn = event.currentTarget;
    const toggleText = toggleBtn.querySelector('.articles-toggle-text');

    articlesList.classList.toggle('show');
    toggleBtn.classList.toggle('expanded');

    if (articlesList.classList.contains('show')) {
        toggleText.textContent = translations[currentLang].hideArticles;
    } else {
        toggleText.textContent = translations[currentLang].viewArticles;
    }
}
function getRepresentativeArticles(cluster, maxArticles = 5) {
    const articlesBySource = {};
    cluster.articles.forEach(article => {
        if (!articlesBySource[article.source]) {
            articlesBySource[article.source] = [];
        }
        articlesBySource[article.source].push(article);
    });

    const representative = [];
    const sortedSources = Object.entries(articlesBySource)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, maxArticles);

    sortedSources.forEach(([source, articles]) => {
        const latest = articles.sort((a, b) => b.sortDate - a.sortDate)[0];
        representative.push(latest);
    });

    return representative;
}


async function loadTodayInTwoMinutes() {
    const container = document.getElementById('newsContainer');
    const pagination = document.getElementById('pagination');

    container.innerHTML = `<div class="loading">${translations[currentLang].loadingNews}</div>`;
    pagination.style.display = 'none';

    try {
        const response = await fetch('https://khobor-ki-backend.onrender.com/api/cluster');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const clusters = await response.json();

        // Get top 5 clusters (already sorted by score on backend)
        const topClusters = clusters.slice(0, 5);

        renderTodayView(topClusters);

    } catch (error) {
        console.error('Error loading today view:', error);
        container.innerHTML = `
            <div class="error">
                <h3>${translations[currentLang].unableToLoad}</h3>
                <p>${translations[currentLang].makeSureBackend}</p>
            </div>
        `;
    }
}


function renderTodayView(clusters) {
    const container = document.getElementById('newsContainer');

    if (!clusters || clusters.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>${translations[currentLang].noNewsAvailable}</h3>
            </div>
        `;
        return;
    }

    const topStory = clusters[0];
    const otherStories = clusters.slice(1);
    
    const representativeArticles = getRepresentativeArticles(topStory, 6);
    const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const html = `
        <div class="today-container">
            <div class="today-header">
                <div class="today-masthead">
                    <h1 class="today-title">${translations[currentLang].today || 'Today in 2 Minutes'}</h1>
                    <div class="today-date">${currentDate}</div>
                </div>
                <p class="today-tagline">${translations[currentLang].topStories || 'Top Stories'} • ${translations[currentLang].updatedMinAgo || 'Updated'}</p>
            </div>

            <!-- Lead Story -->
            <article class="today-lead-story">
                <span class="story-label">Lead Story</span>
                <div class="story-meta-top">
                    ${topStory.articleCount} ${translations[currentLang].articles} from ${Object.keys(topStory.sources).length} ${translations[currentLang].sources}
                </div>
                <h2 class="story-headline-large">
                    <a href="${topStory.articles[0].url}" target="_blank" rel="noopener noreferrer">
                        ${escapeHtml(topStory.representativeTitle)}
                    </a>
                </h2>
                <p class="story-lede">
                    ${topStory.articles[0].paragraph ? escapeHtml(topStory.articles[0].paragraph.substring(0, 200)) + '...' : 'Multiple sources are covering this developing story with extensive analysis and updates.'}
                </p>
                
                <div class="coverage-grid">
                    ${representativeArticles.map(article => `
                        <div class="coverage-item">
                            <div class="coverage-outlet">${escapeHtml(article.source)}</div>
                            <div class="coverage-headline">
                                <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                                    ${escapeHtml(article.title)}
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${topStory.articleCount > 6 ? `
                    <a href="#" onclick="viewFullCluster('${topStory._id}'); return false;" class="view-more-link">
                        ${translations[currentLang].viewAllArticles || 'View All'} (${topStory.articleCount}) →
                    </a>
                ` : ''}
            </article>

            <!-- Secondary Stories -->
            <div class="today-secondary">
                ${otherStories.map((cluster, index) => {
                    const articles = getRepresentativeArticles(cluster, 3);
                    return `
                        <article class="story-card">
                            <div class="story-number">${index + 2}</div>
                            <div class="story-meta-small">
                                ${cluster.articleCount} ${translations[currentLang].articles} • ${Object.keys(cluster.sources).length} ${translations[currentLang].sources}
                            </div>
                            <h3 class="story-headline-medium">
                                <a href="${cluster.articles[0].url}" target="_blank" rel="noopener noreferrer">
                                    ${escapeHtml(cluster.representativeTitle)}
                                </a>
                            </h3>
                            
                            <div class="story-sources">
                                ${articles.map(article => `
                                    <div class="source-item">
                                        <span class="source-name">${escapeHtml(article.source)}</span>
                                        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="source-title">
                                            ${escapeHtml(article.title)}
                                        </a>
                                    </div>
                                `).join('')}
                            </div>
                        </article>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;
}


// View full cluster (redirects to Trending tab)
function viewFullCluster(clusterId) {
    // Switch to Trending tab
    currentCategory = 'clusters';
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === 'clusters') {
            tab.classList.add('active');
        }
    });

    // Load clusters and auto-expand the specific one
    loadClusters().then(() => {
        // Auto-expand the cluster
        setTimeout(() => {
            const clusterElement = document.getElementById(`preview-${clusterId}`);
            if (clusterElement) {
                toggleClusterArticles(clusterId);
                clusterElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    });
}
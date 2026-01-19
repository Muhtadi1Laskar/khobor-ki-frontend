const API_BASE_URL = 'https://khobor-ki-backend.onrender.com/api/feed';
// const API_BASE_URL = 'http://localhost:8080/api/feed';
const ITEMS_PER_PAGE = 10;

let currentCategory = 'all';
let currentPage = 1;
let newsData = [];

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadNews();
});

function setupNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            currentCategory = tab.dataset.category;
            currentPage = 1;
            loadNews();
        });
    });
}

function buildApiUrl(category, page, limit) {
    const baseUrl = API_BASE_URL;
    if (category === 'all') {
        return `${baseUrl}?page=${page}&limit=${limit}`;
    }
    return `${baseUrl}/${category}?page=${page}&limit=${limit}`;
}

async function loadNews() {
    const container = document.getElementById('newsContainer');
    const pagination = document.getElementById('pagination');

    container.innerHTML = '<div class="loading">Loading news</div>';
    pagination.style.display = 'none';

    try {
        const url = buildApiUrl(currentCategory, currentPage, ITEMS_PER_PAGE);
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
                        <h3>Unable to load news</h3>
                        <p>Please make sure the backend server is running on localhost:8080</p>
                        <p style="margin-top: 12px; font-size: 12px; color: #9ca3af;">Error: ${error.message}</p>
                    </div>
                `;
    }
}

function renderNews(data) {
    const container = document.getElementById('newsContainer');

    if (!data || (Array.isArray(data) && data.length === 0) ||
        (data.items && data.items.length === 0)) {
        container.innerHTML = `
                    <div class="empty-state">
                        <h3>No news available</h3>
                        <p>Check back later for updates</p>
                    </div>
                `;
        return;
    }

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

function updatePagination(data) {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');

    const items = Array.isArray(data) ? data : (data.items || []);
    const hasMore = data.hasMore !== undefined ? data.hasMore : items.length === ITEMS_PER_PAGE;

    if (items.length > 0) {
        pagination.style.display = 'flex';
        pageInfo.textContent = `Page ${currentPage}`;

        prevBtn.disabled = currentPage === 1;

        nextBtn.disabled = !hasMore;
    } else {
        pagination.style.display = 'none';
    }
}

function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    loadNews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

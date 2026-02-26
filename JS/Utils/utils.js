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

function countTotalSources(sources) {
    if (!sources || typeof sources !== "object" || Array.isArray(sources)) {
        console.warn("Invalid source format: ", sources);
        return 0
    }
    return Object.keys(sources).length;
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
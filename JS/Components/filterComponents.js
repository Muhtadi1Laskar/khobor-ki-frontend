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
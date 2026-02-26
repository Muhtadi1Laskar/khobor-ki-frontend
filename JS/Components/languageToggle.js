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
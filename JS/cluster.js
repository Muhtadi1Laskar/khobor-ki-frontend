// Add this state variable at the top
let clusterLanguageFilter = 'BN'; // Default to Bangla clusters

// Modified loadClusters function
// async function loadClusters() {
//     const container = document.getElementById('newsContainer');
//     const pagination = document.getElementById('pagination');

//     // Check if controls already exist
//     const controlsExist = document.querySelector('.cluster-controls');

//     // Only show loading in the cluster list area, not the whole container
//     if (controlsExist) {
//         const clusterList = document.querySelector('.cluster-list');
//         if (clusterList) {
//             clusterList.innerHTML = `<div class="loading">${translations[currentLang].loadingNews}</div>`;
//         }
//     } else {
//         container.innerHTML = `<div class="loading">${translations[currentLang].loadingNews}</div>`;
//     }

//     pagination.style.display = 'none';

//     try {
//         const CLUSTER_URL = `${API_BASE_URL}/cluster?language=${clusterLanguageFilter}`;
//         const response = await fetch(CLUSTER_URL);

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//         const data = await response.json();
//         renderClusters(data);

//     } catch (error) {
//         console.error('Error loading clusters:', error);
//         container.innerHTML = `
//             <div class="error">
//                 <h3>${translations[currentLang].unableToLoad}</h3>
//                 <p>${translations[currentLang].makeSureBackend}</p>
//                 <p style="margin-top: 12px; font-size: 12px; color: #9ca3af;">Error: ${error.message}</p>
//             </div>
//         `;
//     }
// }



// Modified loadClusters function
async function loadClusters() {
    const container = document.getElementById('newsContainer');
    const pagination = document.getElementById('pagination');
    const controlsExist = document.querySelector('.cluster-controls');

    let skeletonTimeout = null;
    const SKELETON_DELAY = 300; // Show skeleton only after 300ms
    
    if (controlsExist) {
        const clusterList = document.querySelector('.cluster-list');
        if (clusterList) {
            // ✅ Delayed skeleton: only show if loading takes > 300ms
            skeletonTimeout = setTimeout(() => {
                clusterList.innerHTML = renderClusterSkeleton(3); // 3 cards instead of 5
            }, SKELETON_DELAY);
        }
    } else {
        container.innerHTML = `
            <div class="cluster-controls">
                <div class="cluster-lang-toggle-container">
                    <button class="cluster-lang-toggle ${clusterLanguageFilter === 'BN' ? 'bn-active' : 'en-active'}" 
                            id="clusterLangToggle" 
                            onclick="toggleClusterLanguage()">
                        <span class="toggle-option bn-option">
                            ${currentLang === 'en' ? 'Bangla Media' : 'বাংলা মিডিয়া'}
                        </span>
                        <span class="toggle-slider"></span>
                        <span class="toggle-option en-option">
                            ${currentLang === 'en' ? 'English Media' : 'ইংরেজি মিডিয়া'}
                        </span>
                    </button>
                </div>
            </div>
            <div class="cluster-list"></div>
        `;
        
        // ✅ Delayed skeleton for initial load too
        const clusterList = document.querySelector('.cluster-list');
        skeletonTimeout = setTimeout(() => {
            if (clusterList) {
                clusterList.innerHTML = renderClusterSkeleton(3);
            }
        }, SKELETON_DELAY);
    }

    pagination.style.display = 'none';

    try {
        const CLUSTER_URL = `${API_BASE_URL}/cluster?language=${clusterLanguageFilter}`;
        const response = await fetch(CLUSTER_URL);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        
        // ✅ Clear skeleton timeout - data arrived
        clearTimeout(skeletonTimeout);
        
        renderClusters(data);

    } catch (error) {
        clearTimeout(skeletonTimeout);
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



// Toggle cluster language filter
function toggleClusterLanguage() {
    clusterLanguageFilter = clusterLanguageFilter === 'BN' ? 'EN' : 'BN';

    // Update the toggle button classes immediately
    const toggleBtn = document.getElementById('clusterLangToggle');
    if (toggleBtn) {
        if (clusterLanguageFilter === 'BN') {
            toggleBtn.classList.remove('en-active');
            toggleBtn.classList.add('bn-active');
        } else {
            toggleBtn.classList.remove('bn-active');
            toggleBtn.classList.add('en-active');
        }
    }

    // Only reload the cluster list, not the entire page
    reloadClusterList();
}

// New function to reload only the cluster list
// async function reloadClusterList() {
//     const clusterList = document.querySelector('.cluster-list');
//     if (!clusterList) {
//         loadClusters(); // Fallback to full load if list doesn't exist
//         return;
//     }

//     // Show loading in just the cluster list
//     clusterList.innerHTML = `<div class="loading">${translations[currentLang].loadingNews}</div>`;

//     try {
//         const response = await fetch(`${API_BASE_URL}/cluster?language=${clusterLanguageFilter}`);

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//         const data = await response.json();

//         // Only update the cluster list HTML, not controls
//         renderClusterListOnly(data);

//     } catch (error) {
//         console.error('Error loading clusters:', error);
//         clusterList.innerHTML = `
//             <div class="error">
//                 <h3>${translations[currentLang].unableToLoad}</h3>
//                 <p>${translations[currentLang].makeSureBackend}</p>
//                 <p style="margin-top: 12px; font-size: 12px; color: #9ca3af;">Error: ${error.message}</p>
//             </div>
//         `;
//     }
// }


// New function to reload only the cluster list
async function reloadClusterList() {
    const clusterList = document.querySelector('.cluster-list');
    if (!clusterList) {
        loadClusters();
        return;
    }

    const SKELETON_DELAY = 100;
    
    // ✅ Delayed skeleton
    const skeletonTimeout = setTimeout(() => {
        clusterList.innerHTML = renderClusterSkeleton(3); // 3 cards
    }, SKELETON_DELAY);

    try {
        const response = await fetch(`${API_BASE_URL}/cluster?language=${clusterLanguageFilter}`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        
        // ✅ Clear skeleton timeout
        clearTimeout(skeletonTimeout);
        
        renderClusterListOnly(data);

    } catch (error) {
        clearTimeout(skeletonTimeout);
        console.error('Error loading clusters:', error);
        clusterList.innerHTML = `
            <div class="error">
                <h3>${translations[currentLang].unableToLoad}</h3>
                <p>${translations[currentLang].makeSureBackend}</p>
                <p style="margin-top: 12px; font-size: 12px; color: #9ca3af;">Error: ${error.message}</p>
            </div>
        `;
    }
}


// ============================================
// SKELETON LOADING
// ============================================

function renderClusterSkeleton(count = 5) {
    return Array(count).fill(0).map((_, index) => `
        <div class="cluster-card skeleton-card" style="animation-delay: ${index * 0.1}s">
            <div class="cluster-timeline-header">
                <div class="skeleton skeleton-icon"></div>
                <div class="cluster-header-content">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-title-short"></div>
                    <div class="cluster-stats">
                        <div class="skeleton skeleton-stat"></div>
                        <div class="skeleton skeleton-stat"></div>
                        <div class="skeleton skeleton-stat"></div>
                    </div>
                </div>
            </div>
            
            <div class="skeleton-transparency">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text-short"></div>
            </div>
            
            <div class="cluster-sources-row">
                <div class="skeleton skeleton-chip"></div>
                <div class="skeleton skeleton-chip"></div>
                <div class="skeleton skeleton-chip"></div>
            </div>
            
            <div class="skeleton-articles">
                <div class="skeleton skeleton-article"></div>
                <div class="skeleton skeleton-article"></div>
                <div class="skeleton skeleton-article"></div>
            </div>
        </div>
    `).join('');
}


// Update the toggle button UI
function updateClusterLanguageToggle() {
    const toggleBtn = document.getElementById('clusterLangToggle');
    const toggleLabel = document.getElementById('clusterLangLabel');

    if (toggleBtn && toggleLabel) {
        if (clusterLanguageFilter === 'BN') {
            toggleBtn.classList.remove('en-active');
            toggleBtn.classList.add('bn-active');
            toggleLabel.textContent = currentLang === 'en' ? 'Bangla Media' : 'বাংলা মিডিয়া';
        } else {
            toggleBtn.classList.remove('bn-active');
            toggleBtn.classList.add('en-active');
            toggleLabel.textContent = currentLang === 'en' ? 'English Media' : 'ইংরেজি মিডিয়া';
        }
    }
}


// New function to render only the cluster list (without controls)
function renderClusterListOnly(clusters) {
    const clusterList = document.querySelector('.cluster-list');

    if (!clusterList) {
        renderClusters(clusters); // Fallback to full render
        return;
    }

    if (!clusters || clusters.length === 0) {
        clusterList.innerHTML = `
            <div class="empty-state">
                <h3>${translations[currentLang].noNewsAvailable}</h3>
                <p>${translations[currentLang].tryAdjusting}</p>
            </div>
        `;
        return;
    }

    clusterList.innerHTML = clusters.map(cluster => {
        const totalSourceCount = countTotalSources(cluster.sources);
        return `
            ${cluster.articles.length > 1 ? `
                <div class="cluster-card" id="cluster-card-${cluster._id}">
                    <div class="cluster-timeline-header">
                        <div class="cluster-icon ${cluster.category.toLowerCase()}">
                            ${getCategoryIcon(cluster.category)}
                        </div>
                        <div class="cluster-header-content">
                            <a href="${cluster.representativeLink}" target="_blank" rel="noopener noreferrer" class="cluster-title-link">
                                ${escapeHtml(cluster.representativeTitle)}
                            </a>
                            <div class="cluster-stats">
                                <div class="cluster-stat">
                                    <span data-cluster-covered="${totalSourceCount}">
                                        ${setCoveredMessage(currentLang, totalSourceCount, translations[currentLang])}
                                    </span>
                                </div>
                                <div class="cluster-stat">
                                    <span>📅</span> <span>${formatDates(cluster.createdAt)}</span>
                                </div>
                                <div class="cluster-stat">
                                    <span data-lang-key="${cluster.category.toLowerCase()}">${translations[currentLang][cluster.category.toLowerCase()] || cluster.category}</span>
                                </div>
                                <button class="cluster-share-btn" 
                                    onclick="shareCluster('${cluster._id}', event)" 
                                    title="${translations[currentLang].shareStory || 'Share this story'}">
                                <span class="share-icon">📤</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    ${cluster.biasTransparency ? `
                        <div class="transparency-card" data-sds="${cluster.biasTransparency.sourceDiversityScore}" data-nss="${cluster.biasTransparency.narrativeSpreadScore}">
                            <div class="transparency-header">
                                <span class="transparency-title" data-lang-key="coverageAnalysis">${translations[currentLang].coverageAnalysis || 'Coverage Analysis'}</span>
                                <button class="info-toggle" 
                                        onclick="toggleTransparencyInfo('${cluster._id}')" 
                                        id="toggle-btn-${cluster._id}"
                                        title="${translations[currentLang].showDetails || 'Show details'}" 
                                        data-lang-key-title="showDetails">
                                    <svg class="chevron-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                            
                            <div class="transparency-interpretation">
                                <p class="interpretation-text">
                                    ${getTransparencyInterpretation(cluster.biasTransparency, currentLang)}
                                </p>
                            </div>
                            
                            <div class="transparency-details" id="transparency-details-${cluster._id}">
                                <div class="detail-row" data-type="sources" data-score="${cluster.biasTransparency.sourceDiversityScore}">
                                    <div class="detail-label">
                                        <span class="detail-icon">📰</span>
                                        <span data-lang-key="howManySources">${translations[currentLang].howManySources || 'How many sources?'}</span>
                                    </div>
                                    <div class="detail-visual">
                                        ${getVisualIndicator(cluster.biasTransparency.sourceDiversityScore, 'sources', currentLang)}
                                    </div>
                                </div>
                                
                                <div class="detail-row" data-type="angles" data-score="${cluster.biasTransparency.narrativeSpreadScore}">
                                    <div class="detail-label">
                                        <span class="detail-icon">💬</span>
                                        <span data-lang-key="differentAngles">${translations[currentLang].differentAngles || 'Different angles?'}</span>
                                    </div>
                                    <div class="detail-visual">
                                        ${getVisualIndicator(cluster.biasTransparency.narrativeSpreadScore, 'angles', currentLang)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="cluster-sources-row" id="sources-${cluster._id}">
                        ${Object.entries(cluster.sources).slice(0, 3).map(([source, count]) => `
                            <div class="source-chip">
                                ${escapeHtml(source)}<span class="count">(${count})</span>
                            </div>
                        `).join('')}
                        
                        ${Object.entries(cluster.sources).length > 3 ? `
                            <!-- Hidden sources -->
                            <div class="hidden-sources" id="hidden-sources-${cluster._id}" style="display: none;">
                                ${Object.entries(cluster.sources).slice(3).map(([source, count]) => `
                                    <div class="source-chip">
                                        ${escapeHtml(source)}<span class="count">(${count})</span>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <!-- Toggle button -->
                            <button class="source-chip more-sources-btn" 
                                    onclick="toggleMoreSources('${cluster._id}')" 
                                    id="more-btn-${cluster._id}"
                                    data-more-count="${Object.entries(cluster.sources).length - 3}">
                                <span class="more-icon">+</span>
                                <span class="more-text" data-more-sources="${Object.entries(cluster.sources).length - 3}">
                                    ${Object.entries(cluster.sources).length - 3} ${translations[currentLang].moreSources}
                                </span>
                            </button>
                        ` : ''}
                    </div>
                    
                    <div class="cluster-preview" id="preview-${cluster._id}">
                        ${cluster.comparisonTitles && cluster.comparisonTitles.length > 0 ? `
                            <div class="view-toggle-container">
                                <button class="view-toggle-btn" onclick="toggleComparisonView('${cluster._id}')" id="view-toggle-${cluster._id}">
                                    <span class="toggle-icon">⚡</span>
                                    <span class="toggle-text" data-lang-key="compareHeadlines">${translations[currentLang].compareHeadlines || 'Compare Headlines Side-by-Side'}</span>
                                </button>
                            </div>
                        ` : ''}
                        
                        <div class="list-view" id="list-view-${cluster._id}">
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
                        
                        ${cluster.comparisonTitles && cluster.comparisonTitles.length > 0 ? `
                            <div class="comparison-view" id="comparison-view-${cluster._id}" style="display: none;">
                                <div class="comparison-header">
                                    <div class="comparison-info">
                                        <span class="info-icon">💡</span>
                                        <span class="info-text" data-lang-key="comparisonInfo">${translations[currentLang].comparisonInfo || 'Highlighted words show how different outlets frame this story'}</span>
                                    </div>
                                </div>
                                <div class="comparison-grid">
                                    ${highlightDifferences(cluster.comparisonTitles).map(item => `
                                        <div class="comparison-card">
                                            <div class="comparison-source">${escapeHtml(item.source)}</div>
                                            <div class="comparison-title">${item.highlightedTitle}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <button class="show-more-btn" onclick="toggleClusterArticles('${cluster._id}')" id="btn-${cluster._id}">
                        <span class="show-more-text" data-lang-key="viewAllArticles">${translations[currentLang].viewAllArticles}</span>
                        <span class="show-more-icon">▼</span>
                    </button>
                </div>
            ` : ""}
        `
    }).join('');
}


function toggleMoreSources(clusterId) {
    const hiddenSources = document.getElementById(`hidden-sources-${clusterId}`);
    const moreBtn = document.getElementById(`more-btn-${clusterId}`);
    const moreText = moreBtn.querySelector('.more-text');
    const moreIcon = moreBtn.querySelector('.more-icon');
    
    if (!hiddenSources || !moreBtn) return;
    
    const isExpanded = hiddenSources.style.display !== 'none';
    
    if (isExpanded) {
        // Collapse - hide sources
        hiddenSources.style.display = 'none';
        moreIcon.textContent = '';
        moreIcon.textContent = '+';
        const count = moreBtn.dataset.moreCount;
        moreText.textContent = `${count} ${translations[currentLang].moreSources}`;
        moreBtn.classList.remove('expanded');
    } else {
        // Expand - show sources
        hiddenSources.style.display = 'contents'; // Use 'contents' to maintain flexbox flow
        moreIcon.textContent = '−'; // Minus sign
        moreText.textContent = translations[currentLang].showLess || 'Show less';
        moreBtn.classList.add('expanded');
    }
}


// Helper function to get transparency badge with simple language
function getTransparencyBadge(biasTransparency) {
    const sds = biasTransparency.sourceDiversityScore;
    const nss = biasTransparency.narrativeSpreadScore;

    // Determine overall transparency level
    const avgScore = (sds + nss) / 2;

    if (avgScore >= 0.6) {
        return '<span class="transparency-icon high">✓</span> <span>Verified</span>';
    } else if (avgScore >= 0.3) {
        return '<span class="transparency-icon medium">⚠</span> <span>Check Sources</span>';
    } else {
        return '<span class="transparency-icon low">!</span> <span>Limited Coverage</span>';
    }
}

// Get human-readable interpretation
function getTransparencyInterpretation(biasTransparency, lang) {
    const sds = biasTransparency.sourceDiversityScore;
    const nss = biasTransparency.narrativeSpreadScore;

    const interpretations = {
        en: {
            high_high: "This story is covered by many different sources with multiple perspectives. Good for getting the full picture.",
            high_low: "This story is covered by many different outlets, but the reporting style is relatively consistent.",
            low_high: "This story has limited source coverage, but shows different viewpoints among available sources.",
            low_low: "This story has limited coverage and similar reporting across sources. Consider checking for updates."
        },
        bn: {
            high_high: "এই খবরটি বিভিন্ন সূত্র থেকে এসেছে এবং একাধিক দৃষ্টিভঙ্গি রয়েছে। সম্পূর্ণ ছবি পেতে ভালো।",
            high_low: "এই খবরটি বিভিন্ন আউটলেট থেকে এসেছে, তবে রিপোর্টিং স্টাইল তুলনামূলকভাবে সামঞ্জস্যপূর্ণ।",
            low_high: "এই খবরের সূত্র কভারেজ সীমিত, তবে উপলব্ধ সূত্রগুলির মধ্যে ভিন্ন দৃষ্টিভঙ্গি দেখা যাচ্ছে।",
            low_low: "এই খবরের কভারেজ সীমিত এবং সূত্রগুলিতে একই ধরনের রিপোর্টিং। আপডেটের জন্য অপেক্ষা করুন।"
        }
    };

    // Determine interpretation key
    const diversityLevel = sds >= 0.5 ? 'high' : 'low';
    const narrativeLevel = nss >= 0.5 ? 'high' : 'low';
    const key = `${diversityLevel}_${narrativeLevel}`;

    return interpretations[lang][key];
}


function highlightDifferences(comparisonTitles) {
    if (!comparisonTitles || comparisonTitles.length < 2) return comparisonTitles;

    const allWords = comparisonTitles.map(item =>
        item.title.split(/\s+/).map(word => word.toLowerCase())
    );

    const commonWords = allWords[0].filter(word =>
        allWords.every(titleWords => titleWords.includes(word))
    );

    return comparisonTitles.map(item => {
        const words = item.title.split(/\s+/);
        const segments = [];
        let currentSegment = { isHighlighted: false, words: [] };

        words.forEach(word => {
            const isUnique = !commonWords.includes(word.toLowerCase());

            if (currentSegment.words.length > 0 && currentSegment.isHighlighted !== isUnique) {
                segments.push({ ...currentSegment });
                currentSegment = { isHighlighted: isUnique, words: [] };
            }

            currentSegment.isHighlighted = isUnique;
            currentSegment.words.push(word);
        });

        if (currentSegment.words.length > 0) {
            segments.push(currentSegment);
        }

        const highlightedTitle = segments.map(segment => {
            const text = segment.words.join(' ');
            return segment.isHighlighted
                ? `<mark class="diff-highlight">${text}</mark>`
                : text;
        }).join(' ');

        return {
            ...item,
            highlightedTitle
        };
    });
}


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


    // Render controls + cluster list on initial load
    container.innerHTML = `
        <div class="cluster-controls">
            <div class="cluster-lang-toggle-container">
                <button class="cluster-lang-toggle ${clusterLanguageFilter === 'BN' ? 'bn-active' : 'en-active'}" 
                        id="clusterLangToggle" 
                        onclick="toggleClusterLanguage()">
                    <span class="toggle-option bn-option">
                        ${currentLang === 'en' ? 'Bangla Media' : 'বাংলা মিডিয়া'}
                    </span>
                    <span class="toggle-slider"></span>
                    <span class="toggle-option en-option">
                        ${currentLang === 'en' ? 'English Media' : 'ইংরেজি মিডিয়া'}
                    </span>
                </button>
            </div>
        </div>
        
        <div class="cluster-list"></div>
    `;

    // Now render the cluster list
    renderClusterListOnly(clusters);
}

function toggleComparisonView(clusterId) {
    const listView = document.getElementById(`list-view-${clusterId}`);
    const comparisonView = document.getElementById(`comparison-view-${clusterId}`);
    const toggleBtn = document.getElementById(`view-toggle-${clusterId}`);
    const toggleText = toggleBtn.querySelector('.toggle-text');

    if (comparisonView.style.display === 'none') {
        // Switch to comparison view
        listView.style.display = 'none';
        comparisonView.style.display = 'block';
        toggleBtn.classList.add('active');
        toggleText.textContent = translations[currentLang].showListView || 'Show List View';
    } else {
        // Switch to list view
        listView.style.display = 'block';
        comparisonView.style.display = 'none';
        toggleBtn.classList.remove('active');
        toggleText.textContent = translations[currentLang].compareHeadlines || 'Compare Headlines Side-by-Side';
    }
}

// Visual indicator using dots/bars
function getVisualIndicator(score, type, lang) {
    const labels = {
        sources: {
            en: ['Few', 'Some', 'Many'],
            bn: ['কম', 'মাঝারি', 'অনেক']
        },
        angles: {
            en: ['Similar', 'Mixed', 'Diverse'],
            bn: ['একই রকম', 'মিশ্র', 'বৈচিত্র্যময়']
        }
    };

    let level, dots;
    if (score >= 0.6) {
        level = 2; // High
        dots = '● ● ●';
    } else if (score >= 0.3) {
        level = 1; // Medium
        dots = '● ● ○';
    } else {
        level = 0; // Low
        dots = '● ○ ○';
    }

    return `
        <div class="visual-dots">${dots}</div>
        <span class="visual-label">${labels[type][lang][level]}</span>
    `;
}

// Toggle transparency info details
// Toggle transparency info details
function toggleTransparencyInfo(clusterId) {
    const details = document.getElementById(`transparency-details-${clusterId}`);
    const button = document.getElementById(`toggle-btn-${clusterId}`);
    
    const isExpanded = details.classList.toggle('show');
    
    if (button) {
        button.classList.toggle('expanded');
        
        // ✅ Update tooltip text
        const newTitle = isExpanded 
            ? translations[currentLang].hideDetails 
            : translations[currentLang].showDetails;
        button.setAttribute('title', newTitle);
    }
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
// Update cluster language dynamically
function updateClusterLanguage() {
    // Update all "covered by" messages
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

    // Update all elements with data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // Update title attributes
    document.querySelectorAll('[data-lang-key-title]').forEach(element => {
        const key = element.getAttribute('data-lang-key-title');
        if (translations[currentLang][key]) {
            element.title = translations[currentLang][key];
        }
    });

    // Update interpretation texts inside Coverage Analysis cards
    document.querySelectorAll('.transparency-interpretation .interpretation-text').forEach(element => {
        const card = element.closest('.transparency-card');
        if (card) {
            const sds = parseFloat(card.getAttribute('data-sds'));
            const nss = parseFloat(card.getAttribute('data-nss'));

            if (!isNaN(sds) && !isNaN(nss)) {
                element.textContent = getTransparencyInterpretation(
                    { sourceDiversityScore: sds, narrativeSpreadScore: nss },
                    currentLang
                );
            }
        }
    });

    // Update toggle button text when UI language changes
    const bnOption = document.querySelector('.bn-option');
    const enOption = document.querySelector('.en-option');

    if (bnOption && enOption) {
        bnOption.textContent = currentLang === 'en' ? 'Bangla Media' : 'বাংলা মিডিয়া';
        enOption.textContent = currentLang === 'en' ? 'English Media' : 'ইংরেজি মিডিয়া';
    }
    updateClusterLanguageToggle();
}

// Toggle cluster articles visibility
function toggleClusterArticles(clusterId) {
    const preview = document.getElementById(`preview-${clusterId}`);
    const button = document.getElementById(`btn-${clusterId}`);
    const buttonText = button.querySelector('.show-more-text');
    const clusterCard = button.closest('.cluster-card');

    preview.classList.toggle('show');
    button.classList.toggle('expanded');

    if (preview.classList.contains('show')) {
        // Expanding
        buttonText.textContent = translations[currentLang].hideArticles;
    } else {
        // Collapsing - scroll back to cluster
        buttonText.textContent = translations[currentLang].viewAllArticles;

        if (clusterCard) {
            // Small delay to let collapse animation start
            setTimeout(() => {
                clusterCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
}

// ============================================
// SHARE CLUSTER FUNCTIONALITY
// ============================================

function shareCluster(clusterId, event) {
    event.stopPropagation();
    
    // Find the cluster data from the current page
    const clusterCard = event.target.closest('.cluster-card');
    const title = clusterCard.querySelector('.cluster-title-link').textContent.trim();
    const sourceCount = clusterCard.querySelector('[data-cluster-covered]').getAttribute('data-cluster-covered');
    
    // ✅ CREATE KHOBOR KI URL WITH CLUSTER ID HASH
    const khoborKiUrl = `${window.location.origin}${window.location.pathname}#cluster-${clusterId}`;
    
    // Create share text
    const shareText = currentLang === 'en'
        ? `${title}\n\nCovered by ${sourceCount} sources on Khobor Ki`
        : `${title}\n\n${sourceCount} সূত্র থেকে কভার করা হয়েছে - খবর কি`;
    
    // Try native share first (mobile)
    if (navigator.share) {
        navigator.share({
            title: title,
            text: shareText,
            url: khoborKiUrl  // ✅ Share Khobor Ki URL
        }).catch(err => {
            if (err.name !== 'AbortError') {
                showShareMenu(title, khoborKiUrl, shareText, event);
            }
        });
    } else {
        // Desktop: show custom menu
        showShareMenu(title, khoborKiUrl, shareText, event);
    }
}

function showShareMenu(title, khoborKiUrl, shareText, event) {
    // Remove any existing menu
    const existingMenu = document.querySelector('.share-menu');
    if (existingMenu) existingMenu.remove();
    
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'share-menu';
    menu.innerHTML = `
        <div class="share-menu-header">
            <span>${translations[currentLang].shareStory || 'Share Story'}</span>
        </div>
        
        <button class="share-option" onclick="copyToClipboard('${khoborKiUrl}', this)">
            <span>🔗</span>
            <span>${translations[currentLang].copyLink || 'Copy Link'}</span>
        </button>
        
        <button class="share-option" onclick="copyToClipboard(\`${shareText.replace(/`/g, '\\`').replace(/\n/g, '\\n')}\n\n${khoborKiUrl}\`, this)">
            <span>📋</span>
            <span>${translations[currentLang].copyAsText || 'Copy as Text'}</span>
        </button>
        
        <a class="share-option" 
           href="https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + khoborKiUrl)}"
           target="_blank"
           rel="noopener noreferrer">
            <span>💬</span>
            <span>WhatsApp</span>
        </a>
        
        <a class="share-option" 
           href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(khoborKiUrl)}"
           target="_blank"
           rel="noopener noreferrer">
            <span>📘</span>
            <span>Facebook</span>
        </a>
        
        <a class="share-option" 
           href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(khoborKiUrl)}"
           target="_blank"
           rel="noopener noreferrer">
            <span>🐦</span>
            <span>Twitter</span>
        </a>
        
        <a class="share-option" 
           href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + khoborKiUrl)}"
           rel="noopener noreferrer">
            <span>📧</span>
            <span>Email</span>
        </a>
    `;
    
    // Position menu
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 8}px`;
    menu.style.left = `${rect.left}px`;
    menu.style.zIndex = '1000';
    
    document.body.appendChild(menu);
    
    // Adjust if off-screen
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
        menu.style.left = `${rect.right - menuRect.width}px`;
    }
    if (menuRect.bottom > window.innerHeight) {
        menu.style.top = `${rect.top - menuRect.height - 8}px`;
    }
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const originalHTML = button.innerHTML;
        button.innerHTML = '<span>✓</span><span>' + (translations[currentLang].copied || 'Copied!') + '</span>';
        button.style.background = 'var(--accent-success-bg)';
        button.style.color = 'var(--accent-success)';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.style.color = '';
            document.querySelector('.share-menu')?.remove();
        }, 1500);
        
    } catch (err) {
        console.error('Failed to copy:', err);
        alert(translations[currentLang].copyFailed || 'Failed to copy');
    }
}
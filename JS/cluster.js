// // Modify setupNavigation() to handle clusters


// function setupNavigation() {
//     const navTabs = document.querySelectorAll('.nav-tab');
//     navTabs.forEach(tab => {
//         tab.addEventListener('click', (e) => {
//             e.preventDefault();
//             navTabs.forEach(t => t.classList.remove('active'));
//             tab.classList.add('active');

//             currentCategory = tab.dataset.category;
//             currentPage = 1;

//             // Close filter panel and disable for non-news tabs
//             const filterPanel = document.getElementById('filterPanel');
//             const filterButton = document.querySelector('.filter-button');

//             if (currentCategory === 'clusters' || currentCategory === 'today') {
//                 filterPanel.classList.remove('open');
//                 filterButton.classList.remove('active');
//                 filterButton.disabled = true;
//                 filterButton.style.opacity = '0.5';
//                 filterButton.style.cursor = 'not-allowed';

//                 if (currentCategory === 'clusters') {
//                     loadClusters();
//                 } else {
//                     loadTodayInTwoMinutes();
//                 }
//             } else {
//                 filterButton.disabled = false;
//                 filterButton.style.opacity = '1';
//                 filterButton.style.cursor = 'pointer';
//                 loadNews();
//             }
//         });
//     });
// }

// // Load clusters from API
// async function loadClusters() {
//     const container = document.getElementById('newsContainer');
//     const pagination = document.getElementById('pagination');

//     container.innerHTML = `<div class="loading">${translations[currentLang].loadingNews}</div>`;
//     pagination.style.display = 'none';

//     try {
//         const response = await fetch('https://khobor-ki-backend.onrender.com/api/cluster');

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

// /// Helper function to get transparency badge with simple language
// function getTransparencyBadge(biasTransparency) {
//     const sds = biasTransparency.sourceDiversityScore;
//     const nss = biasTransparency.narrativeSpreadScore;

//     // Determine overall transparency level
//     const avgScore = (sds + nss) / 2;

//     if (avgScore >= 0.6) {
//         return '<span class="transparency-icon high">✓</span> <span>Verified</span>';
//     } else if (avgScore >= 0.3) {
//         return '<span class="transparency-icon medium">⚠</span> <span>Check Sources</span>';
//     } else {
//         return '<span class="transparency-icon low">!</span> <span>Limited Coverage</span>';
//     }
// }

// // Get human-readable interpretation
// function getTransparencyInterpretation(biasTransparency, lang) {
//     const sds = biasTransparency.sourceDiversityScore;
//     const nss = biasTransparency.narrativeSpreadScore;

//     const interpretations = {
//         en: {
//             high_high: "This story is covered by many different sources with multiple perspectives. Good for getting the full picture.",
//             high_low: "This story is covered by many different outlets, but the reporting style is relatively consistent.",
//             low_high: "This story has limited source coverage, but shows different viewpoints among available sources.",
//             low_low: "This story has limited coverage and similar reporting across sources. Consider checking for updates."
//         },
//         bn: {
//             high_high: "এই খবরটি বিভিন্ন সূত্র থেকে এসেছে এবং একাধিক দৃষ্টিভঙ্গি রয়েছে। সম্পূর্ণ ছবি পেতে ভালো।",
//             high_low: "এই খবরটি বিভিন্ন আউটলেট থেকে এসেছে, তবে রিপোর্টিং স্টাইল তুলনামূলকভাবে সামঞ্জস্যপূর্ণ।",
//             low_high: "এই খবরের সূত্র কভারেজ সীমিত, তবে উপলব্ধ সূত্রগুলির মধ্যে ভিন্ন দৃষ্টিভঙ্গি দেখা যাচ্ছে।",
//             low_low: "এই খবরের কভারেজ সীমিত এবং সূত্রগুলিতে একই ধরনের রিপোর্টিং। আপডেটের জন্য পরীক্ষা করুন।"
//         }
//     };

//     // Determine interpretation key
//     const diversityLevel = sds >= 0.5 ? 'high' : 'low';
//     const narrativeLevel = nss >= 0.5 ? 'high' : 'low';
//     const key = `${diversityLevel}_${narrativeLevel}`;

//     return interpretations[lang][key];
// }

// // Simplified renderClusters with accessible transparency
// function renderClusters(clusters) {
//     const container = document.getElementById('newsContainer');

//     if (!clusters || clusters.length === 0) {
//         container.innerHTML = `
//             <div class="empty-state">
//                 <h3>${translations[currentLang].noNewsAvailable}</h3>
//                 <p>${translations[currentLang].tryAdjusting}</p>
//             </div>
//         `;
//         return;
//     }

//     const clustersHTML = `
//         <div class="cluster-list">
//             ${clusters.map(cluster => `
//                 <div class="cluster-card">
//                     <div class="cluster-timeline-header">
//                         <div class="cluster-icon ${cluster.category.toLowerCase()}">
//                             ${getCategoryIcon(cluster.category)}
//                         </div>
//                         <div class="cluster-header-content">
//                             <a href="${cluster.articles[0].url}" target="_blank" rel="noopener noreferrer" class="cluster-title-link">
//                                 ${escapeHtml(cluster.representativeTitle)}
//                             </a>
//                             <div class="cluster-stats">
//                                 <div class="cluster-stat">
//                                     <span data-cluster-covered="${cluster.articleCount}">
//                                         ${setCoveredMessage(currentLang, cluster.articleCount, translations[currentLang])}
//                                     </span>
//                                 </div>
//                                 <div class="cluster-stat">
//                                     <span>📅</span> <span>${formatDates(cluster.createdAt)}</span>
//                                 </div>
//                                 <div class="cluster-stat">
//                                     <span data-lang-key="${cluster.category.toLowerCase()}">${translations[currentLang][cluster.category.toLowerCase()] || cluster.category}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     ${cluster.biasTransparency ? `
//                         <div class="transparency-card">
//                             <div class="transparency-header">
//                                 <span class="transparency-title">${translations[currentLang].coverageAnalysis || 'Coverage Analysis'}</span>
//                                 <button class="info-toggle" onclick="toggleTransparencyInfo('${cluster._id}')" title="${translations[currentLang].learnMore || 'Learn more'}">
//                                     <span class="info-icon-btn">ℹ️</span>
//                                 </button>
//                             </div>

//                             <div class="transparency-interpretation">
//                                 <p class="interpretation-text">
//                                     ${getTransparencyInterpretation(cluster.biasTransparency, currentLang)}
//                                 </p>
//                             </div>

//                             <div class="transparency-details" id="transparency-details-${cluster._id}">
//                                 <div class="detail-row">
//                                     <div class="detail-label">
//                                         <span class="detail-icon">📰</span>
//                                         <span>${translations[currentLang].howManySources || 'How many sources?'}</span>
//                                     </div>
//                                     <div class="detail-visual">
//                                         ${getVisualIndicator(cluster.biasTransparency.sourceDiversityScore, 'sources', currentLang)}
//                                     </div>
//                                 </div>

//                                 <div class="detail-row">
//                                     <div class="detail-label">
//                                         <span class="detail-icon">💬</span>
//                                         <span>${translations[currentLang].differentAngles || 'Different angles?'}</span>
//                                     </div>
//                                     <div class="detail-visual">
//                                         ${getVisualIndicator(cluster.biasTransparency.narrativeSpreadScore, 'angles', currentLang)}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ` : ''}

//                     <div class="cluster-sources-row">
//                         ${Object.entries(cluster.sources).slice(0, 3).map(([source, count]) => `
//                             <div class="source-chip">
//                                 ${escapeHtml(source)}<span class="count">(${count})</span>
//                             </div>
//                         `).join('')}
//                         ${Object.entries(cluster.sources).length > 3 ? `
//                             <div class="source-chip more-sources" data-more-sources="${Object.entries(cluster.sources).length - 3}">
//                                 +${Object.entries(cluster.sources).length - 3} ${translations[currentLang].moreSources}
//                             </div>
//                         ` : ''}
//                     </div>

//                     <div class="cluster-preview" id="preview-${cluster._id}">
//                         ${cluster.articles.map(article => `
//                             <div class="preview-article">
//                                 <div class="preview-header">
//                                     <img src="https://www.google.com/s2/favicons?domain=${new URL(article.url).hostname}&sz=32" 
//                                         alt="" 
//                                         class="source-favicon"
//                                         onerror="this.style.display='none'">
//                                     <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="preview-title">
//                                         ${escapeHtml(article.title)}
//                                     </a>
//                                 </div>
//                                 <div class="preview-meta">
//                                     <span class="preview-source">${escapeHtml(article.source)}</span> • ${formatDates(article.sortDate)}
//                                 </div>
//                             </div>
//                         `).join('')}
//                     </div>

//                     <button class="show-more-btn" onclick="toggleClusterArticles('${cluster._id}')" id="btn-${cluster._id}">
//                         <span class="show-more-text" data-lang-key="viewAllArticles">${translations[currentLang].viewAllArticles}</span>
//                         <span class="show-more-icon">▼</span>
//                     </button>
//                 </div>
//             `).join('')}
//         </div>
//     `;

//     container.innerHTML = clustersHTML;
// }

// // Visual indicator using dots/bars
// function getVisualIndicator(score, type, lang) {
//     const labels = {
//         sources: {
//             en: ['Few', 'Some', 'Many'],
//             bn: ['কম', 'মাঝারি', 'অনেক']
//         },
//         angles: {
//             en: ['Similar', 'Mixed', 'Diverse'],
//             bn: ['একই রকম', 'মিশ্র', 'বৈচিত্র্যময়']
//         }
//     };

//     let level, dots;
//     if (score >= 0.6) {
//         level = 2; // High
//         dots = '● ● ●';
//     } else if (score >= 0.3) {
//         level = 1; // Medium
//         dots = '● ● ○';
//     } else {
//         level = 0; // Low
//         dots = '● ○ ○';
//     }

//     return `
//         <div class="visual-dots">${dots}</div>
//         <span class="visual-label">${labels[type][lang][level]}</span>
//     `;
// }

// // Toggle transparency info details
// function toggleTransparencyInfo(clusterId) {
//     const details = document.getElementById(`transparency-details-${clusterId}`);
//     details.classList.toggle('show');
// }


// // Helper function to get category icon
// function getCategoryIcon(category) {
//     const icons = {
//         national: '🏛️',
//         international: '🌍',
//         sports: '⚽',
//         technology: '💻',
//         default: '📰'
//     };
//     return icons[category.toLowerCase()] || icons.default;
// }

// // Helper function for covered message
// function setCoveredMessage(currentLanguage, articleCount, translations) {
//     const data = {
//         "en": `<span>📰</span> ${translations["coveredBy"]} <span>${articleCount} ${translations["sources"]}</span>`,
//         "bn": `<span>📰</span> <span>${articleCount} ${translations["coveredBy"]}</span>`
//     }
//     return data[currentLanguage];
// }

// // Update cluster language dynamically
// function updateClusterLanguage() {
//     // Update all "covered by" messages
//     document.querySelectorAll('[data-cluster-covered]').forEach(element => {
//         const articleCount = parseInt(element.getAttribute('data-cluster-covered'));
//         element.innerHTML = setCoveredMessage(currentLang, articleCount, translations[currentLang]);
//     });

//     // Update "more sources" text
//     document.querySelectorAll('[data-more-sources]').forEach(element => {
//         const moreCount = parseInt(element.getAttribute('data-more-sources'));
//         element.textContent = `+${moreCount} ${translations[currentLang].moreSources}`;
//     });
// }

// // Toggle cluster articles visibility
// function toggleClusterArticles(clusterId) {
//     const preview = document.getElementById(`preview-${clusterId}`);
//     const button = document.getElementById(`btn-${clusterId}`);
//     const buttonText = button.querySelector('.show-more-text');

//     preview.classList.toggle('show');
//     button.classList.toggle('expanded');

//     if (preview.classList.contains('show')) {
//         buttonText.textContent = translations[currentLang].hideArticles;
//     } else {
//         buttonText.textContent = translations[currentLang].viewAllArticles;
//     }
// }




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
            low_low: "এই খবরের কভারেজ সীমিত এবং সূত্রগুলিতে একই ধরনের রিপোর্টিং। আপডেটের জন্য পরীক্ষা করুন।"
        }
    };

    // Determine interpretation key
    const diversityLevel = sds >= 0.5 ? 'high' : 'low';
    const narrativeLevel = nss >= 0.5 ? 'high' : 'low';
    const key = `${diversityLevel}_${narrativeLevel}`;

    return interpretations[lang][key];
}

// Highlight differences between titles
function highlightDifferences(comparisonTitles) {
    if (!comparisonTitles || comparisonTitles.length < 2) return comparisonTitles;

    // Extract all words from all titles
    const allWords = comparisonTitles.map(item =>
        item.title.split(/\s+/).map(word => word.toLowerCase())
    );

    // Find common words across all titles
    const commonWords = allWords[0].filter(word =>
        allWords.every(titleWords => titleWords.includes(word))
    );

    // Return titles with highlighted unique words
    return comparisonTitles.map(item => {
        const words = item.title.split(/\s+/);
        const highlightedTitle = words.map(word => {
            if (!commonWords.includes(word.toLowerCase())) {
                return `<mark class="diff-highlight">${word}</mark>`;
            }
            return word;
        }).join(' ');

        return {
            ...item,
            highlightedTitle
        };
    });
}

// Simplified renderClusters with accessible transparency
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

    console.log(clusters);

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
                    
                   ${cluster.biasTransparency ? `
                        <div class="transparency-card" data-sds="${cluster.biasTransparency.sourceDiversityScore}" data-nss="${cluster.biasTransparency.narrativeSpreadScore}">
                            <div class="transparency-header">
                                <span class="transparency-title" data-lang-key="coverageAnalysis">${translations[currentLang].coverageAnalysis || 'Coverage Analysis'}</span>
                                <button class="info-toggle" onclick="toggleTransparencyInfo('${cluster._id}')" title="${translations[currentLang].learnMore || 'Learn more'}" data-lang-key-title="learnMore">
                                    <span class="info-icon-btn">ℹ️</span>
                                </button>
                            </div>
                            
                            <div class="transparency-interpretation">
                                <p class="interpretation-text" data-lang-dynamic="interpretation" data-sds="${cluster.biasTransparency.sourceDiversityScore}" data-nss="${cluster.biasTransparency.narrativeSpreadScore}">
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
            `).join('')}
        </div>
    `;

    container.innerHTML = clustersHTML;
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
function toggleTransparencyInfo(clusterId) {
    const details = document.getElementById(`transparency-details-${clusterId}`);
    details.classList.toggle('show');
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
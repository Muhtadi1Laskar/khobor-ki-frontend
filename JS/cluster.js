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
//                                 ${cluster.biasTransparency ? `
//                                     <div class="cluster-stat transparency-badge" onclick="toggleTransparency('${cluster._id}')">
//                                         ${getTransparencyBadge(cluster.biasTransparency)}
//                                     </div>
//                                 ` : ''}
//                             </div>
//                         </div>
//                     </div>
                    
//                     ${cluster.biasTransparency ? `
//                         <div class="transparency-panel" id="transparency-${cluster._id}">
//                             <div class="transparency-grid">
//                                 <div class="transparency-metric">
//                                     <div class="metric-label">
//                                         <span class="metric-icon">🔍</span>
//                                         <span>${translations[currentLang].sourceDiversity || 'Source Diversity'}</span>
//                                     </div>
//                                     <div class="metric-bar-container">
//                                         <div class="metric-bar" style="width: ${cluster.biasTransparency.sourceDiversityScore * 100}%"></div>
//                                     </div>
//                                     <div class="metric-value">
//                                         ${getSourceDiversityLabel(cluster.biasTransparency.sourceDiversityScore, currentLang)}
//                                     </div>
//                                 </div>
                                
//                                 <div class="transparency-metric">
//                                     <div class="metric-label">
//                                         <span class="metric-icon">📊</span>
//                                         <span>${translations[currentLang].narrativeSpread || 'Narrative Spread'}</span>
//                                     </div>
//                                     <div class="metric-bar-container">
//                                         <div class="metric-bar narrative" style="width: ${cluster.biasTransparency.narrativeSpreadScore * 100}%"></div>
//                                     </div>
//                                     <div class="metric-value">
//                                         ${getNarrativeSpreadLabel(cluster.biasTransparency.narrativeSpreadScore, currentLang)}
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div class="transparency-info">
//                                 <span class="info-icon">ℹ️</span>
//                                 <span class="info-text">${translations[currentLang].transparencyExplainer || 'These metrics help you understand how diverse the coverage is across different sources and perspectives.'}</span>
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

// // Helper function to get transparency badge
// function getTransparencyBadge(biasTransparency) {
//     const sds = biasTransparency.sourceDiversityScore;
//     const nss = biasTransparency.narrativeSpreadScore;

//     // Determine overall transparency level
//     const avgScore = (sds + nss) / 2;

//     if (avgScore >= 0.6) {
//         return '<span class="transparency-icon high">🟢</span> <span>High Transparency</span>';
//     } else if (avgScore >= 0.3) {
//         return '<span class="transparency-icon medium">🟡</span> <span>Moderate Transparency</span>';
//     } else {
//         return '<span class="transparency-icon low">🔴</span> <span>Limited Transparency</span>';
//     }
// }

// // Helper functions for labels
// function getSourceDiversityLabel(score, lang) {
//     const labels = {
//         en: {
//             high: 'High Diversity',
//             moderate: 'Moderate Diversity',
//             low: 'Dominated Coverage'
//         },
//         bn: {
//             high: 'উচ্চ বৈচিত্র্য',
//             moderate: 'মধ্যম বৈচিত্র্য',
//             low: 'সীমিত কভারেজ'
//         }
//     };

//     if (score >= 0.6) return labels[lang].high;
//     if (score >= 0.3) return labels[lang].moderate;
//     return labels[lang].low;
// }

// function getNarrativeSpreadLabel(score, lang) {
//     const labels = {
//         en: {
//             high: 'Multiple Angles',
//             moderate: 'Some Variation',
//             low: 'Uniform Framing'
//         },
//         bn: {
//             high: 'বহু দৃষ্টিকোণ',
//             moderate: 'কিছু পরিবর্তন',
//             low: 'একক দৃষ্টিভঙ্গি'
//         }
//     };

//     if (score >= 0.6) return labels[lang].high;
//     if (score >= 0.3) return labels[lang].moderate;
//     return labels[lang].low;
// }

// // Toggle transparency panel
// function toggleTransparency(clusterId) {
//     const panel = document.getElementById(`transparency-${clusterId}`);
//     panel.classList.toggle('show');
// }



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
                        <div class="transparency-card">
                            <div class="transparency-header">
                                <span class="transparency-title">${translations[currentLang].coverageAnalysis || 'Coverage Analysis'}</span>
                                <button class="info-toggle" onclick="toggleTransparencyInfo('${cluster._id}')" title="${translations[currentLang].learnMore || 'Learn more'}">
                                    <span class="info-icon-btn">ℹ️</span>
                                </button>
                            </div>
                            
                            <div class="transparency-interpretation">
                                <p class="interpretation-text">
                                    ${getTransparencyInterpretation(cluster.biasTransparency, currentLang)}
                                </p>
                            </div>
                            
                            <div class="transparency-details" id="transparency-details-${cluster._id}">
                                <div class="detail-row">
                                    <div class="detail-label">
                                        <span class="detail-icon">📰</span>
                                        <span>${translations[currentLang].howManySources || 'How many sources?'}</span>
                                    </div>
                                    <div class="detail-visual">
                                        ${getVisualIndicator(cluster.biasTransparency.sourceDiversityScore, 'sources', currentLang)}
                                    </div>
                                </div>
                                
                                <div class="detail-row">
                                    <div class="detail-label">
                                        <span class="detail-icon">💬</span>
                                        <span>${translations[currentLang].differentAngles || 'Different angles?'}</span>
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
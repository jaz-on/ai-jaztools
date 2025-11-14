// Feed Subscription Organizer - JavaScript Ultra-Condensé
import Card from '../components/Card/Card.js';
import Button from '../components/Button/Button.js';
import Header from '../components/Header/Header.js';
import Footer from '../components/Footer/Footer.js';
import Grid from '../components/Grid/Grid.js';
import Loader from '../components/Loader/Loader.js';
import { List, ListItem } from '../components/List/index.js';
import Badge from '../components/Badge/Badge.js';

class App {
    constructor() {
        this.elements = {};
        this.currentAnalysis = null;
        this.subscriptions = null;
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        ['dropzone', 'fileInput', 'uploadSection', 'loadingSection', 'resultsSection', 
         'statisticsGrid', 'yearlyEvolutionSection', 'summarySection', 'allSourcesButtonSection',
         'examplesCard', 'examplesContainer', 'recommendationsCard', 'recommendationsContainer',
         'authorExpertiseSection']
            .forEach(id => this.elements[id] = document.getElementById(id));
    }

    initializeEventListeners() {
        this.elements.fileInput.addEventListener('change', e => this.handleFileSelection(e));
        this.elements.dropzone.addEventListener('dragover', e => this.handleDragOver(e));
        this.elements.dropzone.addEventListener('dragleave', () => this.handleDragLeave());
        this.elements.dropzone.addEventListener('drop', e => this.handleFileDrop(e));
        this.elements.dropzone.addEventListener('click', () => this.triggerFileInput());
        this.elements.dropzone.addEventListener('keydown', e => this.handleKeyboardInteraction(e));
    }

    triggerFileInput() { this.elements.fileInput.click(); }

    handleFileSelection(event) {
        const files = Array.from(event.target.files);
        if (files.length > 0) this.processFiles(files);
    }

    handleDragOver(event) {
        event.preventDefault();
        this.elements.dropzone.classList.add('dragover');
    }

    handleDragLeave() {
        this.elements.dropzone.classList.remove('dragover');
    }

    handleFileDrop(event) {
        event.preventDefault();
        this.elements.dropzone.classList.remove('dragover');
        const files = Array.from(event.dataTransfer.files);
        if (files.length > 0) this.processFiles(files);
    }

    handleKeyboardInteraction(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.triggerFileInput();
        }
    }

    processFiles(files) {
        let jsonFile = null;
        let opmlFile = null;
        
        files.forEach(file => {
            if (file.name.toLowerCase().includes('starred') && file.name.toLowerCase().endsWith('.json')) {
                jsonFile = file;
            } else if ((file.name.toLowerCase().includes('subscription') || file.name.toLowerCase().endsWith('.opml') || file.name.toLowerCase().endsWith('.xml')) && 
                      (file.name.toLowerCase().endsWith('.xml') || file.name.toLowerCase().endsWith('.opml'))) {
                opmlFile = file;
            }
        });
        
        if (!jsonFile) {
            alert('Veuillez sélectionner un fichier starred.json valide.');
            return;
        }
        
        this.showLoading();
        this.processJsonFile(jsonFile);
        
        if (opmlFile) {
            this.processOpmlFile(opmlFile);
        }
    }

    processJsonFile(file) {
        const reader = new FileReader();
        reader.onload = e => this.handleJsonFileRead(e);
        reader.onerror = () => alert('Erreur de lecture du fichier JSON.');
        reader.readAsText(file);
    }
    
    processOpmlFile(file) {
        const reader = new FileReader();
        reader.onload = e => this.handleOpmlFileRead(e);
        reader.onerror = () => alert('Erreur de lecture du fichier OPML.');
        reader.readAsText(file);
    }
    
    handleJsonFileRead(event) {
        try {
            const jsonData = JSON.parse(event.target.result);
            if (!Array.isArray(jsonData) || jsonData.length === 0) {
                throw new Error('Format JSON invalide. Attendu un tableau d\'articles.');
            }
            setTimeout(() => this.analyzeData(jsonData), 500);
        } catch (error) {
            alert(`Erreur d'analyse JSON : ${error.message}`);
        }
    }
    
    handleOpmlFileRead(event) {
        try {
            const opmlData = event.target.result;
            this.subscriptions = this.parseOpml(opmlData);
            console.log('OPML parsed:', this.subscriptions.length, 'subscriptions');
        } catch (error) {
            console.warn('Erreur d\'analyse OPML:', error.message);
            this.subscriptions = null;
        }
    }

    analyzeData(articles) {
        try {
            const analysis = this.performAnalysis(articles);
            this.currentAnalysis = analysis;
            this.displayResults(analysis);
        } catch (error) {
            alert(`Erreur d'analyse : ${error.message}`);
        }
    }

    performAnalysis(articles) {
        const domains = {};
        const authors = {};
        const keywords = {};
        const themes = {
            'WordPress': ['wordpress', 'wp', 'plugin', 'theme', 'gutenberg'],
            'Performance': ['performance', 'optimization', 'speed', 'lighthouse'],
            'Sécurité': ['security', 'sécurité', 'vulnérabilité', 'patch', 'cve', 'threat', 'malware'],
            'Accessibilité': ['accessibility', 'accessibilité', 'a11y', 'wcag'],
            'JavaScript': ['javascript', 'js', 'react', 'vue', 'angular'],
            'CSS': ['css', 'styling', 'design', 'responsive'],
            'AI & Machine Learning': ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'neural', 'algorithm'],
            'Startup & Innovation': ['startup', 'funding', 'venture', 'innovation', 'product launch'],
            'Government & Policy': ['regulation', 'policy', 'government', 'compliance'],
            'Technology Trends': ['trend', 'future', 'emerging', 'disruption'],
            'Research & Analysis': ['study', 'research', 'analysis', 'statistics', 'report']
        };
        const themeScores = {};
        const yearlyData = {};
        const domainEngagement = {};
        const readingPatterns = {
            totalReadTime: 0,
            avgReadTime: 0,
            readingFrequency: 'unknown',
            articlesPerDay: 0,
            engagementScore: 0
        };

        articles.forEach(article => {
            const title = (article.title || '').toLowerCase();
            const author = article.author || 'Auteur inconnu';
            let domain = '';
            try { domain = article.url ? new URL(article.url).hostname : ''; } catch(e) {}
            
            if (domain) {
                domains[domain] = (domains[domain] || 0) + 1;
                // Calculer l'engagement par domaine (basé sur les étoiles, favoris, etc.)
                if (article.starred || article.favorited) {
                    domainEngagement[domain] = (domainEngagement[domain] || 0) + 1;
                }
            }
            if (author) authors[author] = (authors[author] || 0) + 1;
            
            // Analyse temporelle
            if (article.published) {
                const year = new Date(article.published).getFullYear();
                yearlyData[year] = (yearlyData[year] || 0) + 1;
            }
            
            // Estimation du temps de lecture basé sur la longueur du titre et du contenu
            const estimatedReadTime = this.estimateReadTime(article);
            readingPatterns.totalReadTime += estimatedReadTime;
            
            title.split(/\s+/).forEach(word => {
                if (word.length >= 3 && /^[a-zA-Zàâäéèêëïîôùûüÿç]+$/.test(word)) {
                    keywords[word] = (keywords[word] || 0) + 1;
                }
            });

            Object.entries(themes).forEach(([theme, keywords]) => {
                if (keywords.some(k => title.includes(k))) {
                    themeScores[theme] = (themeScores[theme] || 0) + 1;
                }
            });
        });

        // Calculer les métriques de lecture
        readingPatterns.avgReadTime = articles.length > 0 ? readingPatterns.totalReadTime / articles.length : 0;
        readingPatterns.articlesPerDay = this.calculateArticlesPerDay(articles);
        readingPatterns.readingFrequency = this.determineReadingFrequency(readingPatterns.articlesPerDay);
        readingPatterns.engagementScore = this.calculateOverallEngagement(articles);

        const topDomains = Object.entries(domains).sort(([,a], [,b]) => b - a);
        const topAuthors = Object.entries(authors).sort(([,a], [,b]) => b - a).slice(0, 6);
        const topKeywords = Object.entries(keywords).sort(([,a], [,b]) => b - a).slice(0, 20);
        const thematicClusters = Object.entries(themeScores).map(([theme, score]) => ({
            theme, 
            score, 
            confidence: Math.min(score / 10, 1),
            keywords: themes[theme]
        })).sort((a, b) => b.score - a.score);

        // Tri des données annuelles
        const yearlyStats = Object.entries(yearlyData)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([year, count]) => ({ year: parseInt(year), count }));

        return {
            totalArticles: articles.length,
            domains: Object.keys(domains),
            authors: Object.keys(authors),
            topDomains,
            topAuthors,
            topKeywords,
            thematicClusters,
            sampleArticles: articles.slice(0, 8),
            articles: articles, // Stocker tous les articles pour l'analyse comparative
            dateRange: this.calculateDateRange(articles),
            languageDistribution: this.analyzeLanguage(articles),
            contentTypes: this.analyzeContentTypes(articles),
            yearlyStats,
            readingPatterns,
            domainEngagement
        };
    }

    estimateReadTime(article) {
        const titleLength = (article.title || '').length;
        const contentLength = (article.content || '').length;
        const summaryLength = (article.summary || '').length;
        
        // Estimation basée sur la longueur du contenu (200 mots/minute)
        const totalLength = titleLength + contentLength + summaryLength;
        const words = totalLength / 5; // Estimation approximative
        return Math.max(30, Math.min(600, words / 3.33)); // Entre 30 secondes et 10 minutes
    }

    calculateArticlesPerDay(articles) {
        if (articles.length === 0) return 0;
        
        const dates = articles
            .filter(a => a.published)
            .map(a => new Date(a.published))
            .filter(d => !isNaN(d));
        
        if (dates.length === 0) return 0;
        
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
        
        return daysDiff > 0 ? articles.length / daysDiff : articles.length;
    }

    determineReadingFrequency(articlesPerDay) {
        if (articlesPerDay > 50) return 'multiple_daily';
        if (articlesPerDay > 20) return 'daily';
        if (articlesPerDay > 5) return 'weekly';
        return 'irregular';
    }

    calculateOverallEngagement(articles) {
        const starredArticles = articles.filter(a => a.starred || a.favorited).length;
        return articles.length > 0 ? starredArticles / articles.length : 0;
    }

    calculateDateRange(articles) {
        const dates = articles.filter(a => a.published).map(a => new Date(a.published)).filter(d => !isNaN(d));
        return dates.length > 0 ? {
            start: new Date(Math.min(...dates)),
            end: new Date(Math.max(...dates))
        } : {};
    }

    analyzeLanguage(articles) {
        const french = articles.filter(a => {
            const title = (a.title || '').toLowerCase();
            return title.includes('les') || title.includes('des') || title.includes('une') || 
                   (a.url && a.url.includes('.fr'));
        }).length;
        const english = articles.length - french;
        const total = articles.length;
        return {
            french: { count: french, percentage: total > 0 ? ((french / total) * 100).toFixed(1) : '0' },
            english: { count: english, percentage: total > 0 ? ((english / total) * 100).toFixed(1) : '0' }
        };
    }

    analyzeContentTypes(articles) {
        const types = { tutorials: 0, news: 0, reviews: 0, opinions: 0 };
        const patterns = {
            tutorials: ['tutorial', 'guide', 'how to', 'learn'],
            news: ['news', 'update', 'release', 'announces'],
            reviews: ['review', 'comparison', 'vs', 'tested'],
            opinions: ['opinion', 'thoughts', 'perspective', 'commentary']
        };

        articles.forEach(article => {
            const title = (article.title || '').toLowerCase();
            Object.entries(patterns).forEach(([type, keywords]) => {
                if (keywords.some(k => title.includes(k))) types[type]++;
            });
        });

        return Object.entries(types).map(([type, count]) => ({
            type, count, percentage: ((count / articles.length) * 100).toFixed(1)
        })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
    }

    displayResults(analysis) {
        this.elements.loadingSection.style.display = 'none';
        this.displayYearlyEvolution(analysis);
        this.displayStatistics(analysis);
        this.displaySummary(analysis);
        this.displayAllSourcesButton(analysis);
        this.displayRecommendations(analysis);
        this.elements.resultsSection.classList.remove('hidden');
    }

    displayYearlyEvolution(analysis) {
        if (!analysis.yearlyStats || analysis.yearlyStats.length === 0) return;
        
        const maxCount = Math.max(...analysis.yearlyStats.map(item => item.count));
        const yearlyStats = analysis.yearlyStats;
        
        const yearlyBars = yearlyStats.map(item => {
            // Échelle logarithmique pour mieux différencier les valeurs
            const logMax = Math.log(maxCount + 1);
            const logValue = Math.log(item.count + 1);
            const height = maxCount > 0 ? (logValue / logMax * 80) + 20 : 20;
            
            // Couleur basée sur l'intensité
            const intensity = item.count / maxCount;
            const color = intensity > 0.5 ? 'var(--blue)' : 
                         intensity > 0.2 ? '#3b82f6' : 
                         intensity > 0.1 ? '#60a5fa' : '#93c5fd';

            const bar = document.createElement('div');
            bar.style.cssText = `
                flex: 1; display: flex; flex-direction: column; 
                align-items: center; min-width: 60px;
            `;

            const barFill = document.createElement('div');
            barFill.style.cssText = `
                background: ${color}; width: 100%; max-width: 40px; 
                height: ${height}px; border-radius: 4px 4px 0 0; 
                margin-bottom: 0.5rem; position: relative;
            `;

            const count = Badge({
                variant: 'dark',
                children: item.count.toString()
            });
            count.style.cssText = `
                position: absolute; top: -25px; left: 50%; 
                transform: translateX(-50%); white-space: nowrap;
            `;

            const year = Badge({
                variant: 'light',
                children: item.year.toString()
            });

            barFill.appendChild(count);
            bar.appendChild(barFill);
            bar.appendChild(year);

            return bar;
        });

        const chart = document.createElement('div');
        chart.style.cssText = `
            display: flex; align-items: end; gap: 0.5rem; 
            height: 120px; padding: 1rem 0; 
            border-bottom: 2px solid var(--light);
        `;
        yearlyBars.forEach(bar => chart.appendChild(bar));

        const container = Card({
            children: [
                Header({
                    title: 'Évolution des favoris par année de publication des contenus',
                    subtitle: ''
                }),
                chart
            ]
        });

        this.elements.yearlyEvolutionSection.innerHTML = '';
        this.elements.yearlyEvolutionSection.appendChild(container);
    }

    displayStatistics(analysis) {
        const dayRange = analysis.dateRange.start && analysis.dateRange.end
            ? Math.round((analysis.dateRange.end - analysis.dateRange.start) / (1000 * 60 * 60 * 24))
            : 'N/A';
        const articlesPerDay = dayRange !== 'N/A' ? (analysis.totalArticles / dayRange).toFixed(2) : 'N/A';
        const articlesPerSource = (analysis.totalArticles / analysis.domains.length).toFixed(1);

        const statsCards = [
            Card({
                children: [
                    Badge({ variant: 'primary', children: analysis.totalArticles.toLocaleString() }),
                    'Articles étoilés',
                    document.createTextNode(`${articlesPerDay}/jour en moyenne`)
                ]
            }),
            Card({
                children: [
                    Badge({ variant: 'success', children: analysis.domains.length.toLocaleString() }),
                    'Sites sources',
                    document.createTextNode(`${articlesPerSource} articles/source`)
                ]
            }),
            Card({
                children: [
                    Badge({ variant: 'info', children: analysis.authors.length.toLocaleString() }),
                    'Auteurs uniques',
                    document.createTextNode(`${analysis.authors.length} auteurs différents`)
                ]
            })
        ];

        const statsGrid = Grid({ columns: 3, children: statsCards });
        this.elements.statisticsGrid.innerHTML = '';
        this.elements.statisticsGrid.appendChild(statsGrid);
    }

    displaySummary(analysis) {
        const top10Count = analysis.topDomains.slice(0, 10).reduce((sum, [, count]) => sum + count, 0);
        const top10Percentage = ((top10Count / analysis.totalArticles) * 100).toFixed(1);
        
        const summaryCard = Card({
            children: [
                Header({ title: 'Récapitulatif', subtitle: '' }),
                List({
                    children: [
                        ListItem({ children: `${analysis.domains.length.toLocaleString()} sources total, top 10 = ${top10Count.toLocaleString()} articles (${top10Percentage}% du total)` }),
                        ListItem({ children: this.generatePeriodDescription(analysis) })
                    ]
                })
            ]
        });

        this.elements.summarySection.innerHTML = '';
        this.elements.summarySection.appendChild(summaryCard);
    }

    displayAllSources() {
        const allSources = this.currentAnalysis.topDomains;
        
        const sourcesList = List({
            children: allSources.map(([domain, count]) => 
                ListItem({
                    children: [
                        domain,
                        Badge({ variant: 'info', children: `${count} articles` })
                    ]
                })
            )
        });

        const modal = Card({
            children: [
                Header({ title: `Toutes les sources (${allSources.length})`, subtitle: '' }),
                Button({ variant: 'primary', children: 'Copier données complètes', onClick: () => this.copyFullData(allSources) }),
                Button({ variant: 'primary', children: 'Copier URLs seulement', onClick: () => this.copyUrlsOnly(allSources) }),
                sourcesList,
                Button({ variant: 'secondary', children: 'Fermer', onClick: () => modal.remove() })
            ]
        });

        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            max-width: 700px; max-height: 80vh; overflow-y: auto; z-index: 1050;
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 1040;
        `;
        overlay.onclick = () => {
            overlay.remove();
            modal.remove();
        };

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    displayRecommendations(analysis) {
        const recommendationsGrid = Grid({
            columns: 2,
            children: [
                this.generateDynamicCategories(analysis),
                this.generatePriorityRecommendations(analysis),
                this.generateTemporalPatterns(analysis),
                this.generateEngagementOptimization(analysis),
                this.generateRedundancyAnalysis(analysis),
                this.generateFeedbinFilters(analysis),
                this.generateFeedbinTutorial(analysis),
                this.generateWorkflowProductivity(analysis),
                this.generateNoiseAnalysis(analysis)
            ]
        });

        this.elements.recommendationsContainer.innerHTML = '';
        this.elements.recommendationsContainer.appendChild(recommendationsGrid);
        this.elements.recommendationsCard.style.display = 'block';
    }

    generateRecommendations(analysis) {
        const recommendationsGrid = Grid({
            columns: 2,
            children: [
                this.generateDynamicCategories(analysis),
                this.generatePriorityRecommendations(analysis),
                this.generateTemporalPatterns(analysis),
                this.generateEngagementOptimization(analysis),
                this.generateRedundancyAnalysis(analysis),
                this.generateFeedbinFilters(analysis),
                this.generateFeedbinTutorial(analysis),
                this.generateWorkflowProductivity(analysis),
                this.generateNoiseAnalysis(analysis)
            ]
        });

        this.elements.recommendationsContainer.innerHTML = '';
        this.elements.recommendationsContainer.appendChild(recommendationsGrid);
    }

    generateDynamicCategories(analysis) {
        const topSources = analysis.topDomains.slice(0, 5);
        const sourcesList = List({
            children: [
                ListItem({
                    children: [
                        'Priorité : ',
                        ...topSources.map(([domain], index) => [
                            domain,
                            index < topSources.length - 1 ? ', ' : ''
                        ]).flat()
                    ]
                }),
                analysis.thematicClusters.length > 0 && ListItem({
                    children: [
                        'Thèmes principaux : ',
                        ...analysis.thematicClusters.slice(0, 3).map((cluster, index) => [
                            cluster.theme,
                            index < Math.min(3, analysis.thematicClusters.length) - 1 ? ', ' : ''
                        ]).flat()
                    ]
                }),
                ListItem({
                    children: [
                        'Rythme suggéré : ',
                        Badge({
                            variant: 'info',
                            children: this.getFrequencyDisplayName(analysis.readingPatterns.frequency)
                        })
                    ]
                })
            ].filter(Boolean)
        });

        return Card({
            children: [
                Header({ title: 'Catégories dynamiques suggérées', subtitle: 'Basées sur vos patterns de lecture' }),
                sourcesList
            ]
        });
    }

    generatePriorityRecommendations(analysis) {
        const highEngagementDomains = analysis.topDomains.filter(([domain, count]) => {
            const engagement = analysis.domainEngagement[domain] || 0;
            return engagement / count > 0.7;
        });

        const lowEngagementDomains = analysis.topDomains.filter(([domain, count]) => {
            const engagement = analysis.domainEngagement[domain] || 0;
            return engagement / count < 0.3;
        });

        const optimalTime = analysis.readingPatterns.avgReadTime < 300 ? 'courts' : 'longs';

        const recommendationsList = List({
            children: [
                highEngagementDomains.length > 0 && ListItem({
                    children: [
                        'Sources prioritaires : ',
                        Badge({ variant: 'success', children: 'Lisez en premier' })
                    ]
                }),
                lowEngagementDomains.length > 0 && ListItem({
                    children: [
                        'Sources à réévaluer : ',
                        Badge({
                            variant: 'warning',
                            children: `${lowEngagementDomains.length} sources peu engageantes`
                        })
                    ]
                }),
                ListItem({
                    children: [
                        'Articles optimaux : ',
                        Badge({
                            variant: 'info',
                            children: `Privilégiez les articles ${optimalTime}`
                        })
                    ]
                })
            ].filter(Boolean)
        });

        return Card({
            children: [
                Header({ title: 'Stratégie de priorisation', subtitle: 'Optimisez votre temps de lecture' }),
                recommendationsList
            ]
        });
    }

    generateTemporalPatterns(analysis) {
        const patterns = analysis.readingPatterns;
        const patternsList = List({
            children: [
                patterns.peakHours?.length > 0 && ListItem({
                    children: [
                        'Heures de pointe : ',
                        Badge({
                            variant: 'info',
                            children: patterns.peakHours.join(', ') + 'h'
                        })
                    ]
                }),
                patterns.activeDays?.length > 0 && ListItem({
                    children: [
                        'Jours actifs : ',
                        Badge({
                            variant: 'info',
                            children: patterns.activeDays.join(', ')
                        })
                    ]
                }),
                ListItem({
                    children: [
                        'Fréquence suggérée : ',
                        Badge({
                            variant: 'success',
                            children: this.getFrequencyDisplayName(patterns.frequency)
                        })
                    ]
                })
            ].filter(Boolean)
        });

        return Card({
            children: [
                Header({ title: 'Patterns temporels', subtitle: 'Optimisez votre planning de lecture' }),
                patternsList
            ]
        });
    }

    generateEngagementOptimization(analysis) {
        const topEngagement = analysis.topDomains.slice(0, 3);
        const engagementList = List({
            children: [
                ListItem({
                    children: [
                        'Sources favorites : ',
                        ...topEngagement.map(([domain, count], index) => {
                            const engagement = analysis.domainEngagement[domain] || 0;
                            const engagementRate = count > 0 ? ((engagement / count) * 100).toFixed(1) : '0';
                            return [
                                Badge({
                                    variant: 'success',
                                    children: `${domain} (${engagementRate}%)`
                                }),
                                index < topEngagement.length - 1 ? ' ' : ''
                            ];
                        }).flat()
                    ]
                }),
                analysis.contentTypes?.length > 0 && ListItem({
                    children: [
                        'Contenu préféré : ',
                        Badge({
                            variant: 'info',
                            children: `${analysis.contentTypes[0].type} (${analysis.contentTypes[0].count} articles)`
                        })
                    ]
                })
            ].filter(Boolean)
        });

        return Card({
            children: [
                Header({ title: 'Optimisation de l\'engagement', subtitle: 'Améliorez votre expérience de lecture' }),
                engagementList
            ]
        });
    }

    generateRedundancyAnalysis(analysis) {
        const redundancyAnalysis = this.analyzeSourceRedundancy(analysis);
        const hasRedundancy = redundancyAnalysis.redundantGroups.length > 0;

        const content = hasRedundancy ? [
            List({
                children: redundancyAnalysis.redundantGroups.map(group => {
                    const engagement = group.sources.reduce((sum, source) => sum + (source.engagement || 0), 0);
                    const totalArticles = group.sources.reduce((sum, source) => sum + (source.count || 0), 0);
                    const engagementRate = totalArticles > 0 ? ((engagement / totalArticles) * 100).toFixed(1) : '0';
                    return ListItem({
                        children: [
                            Badge({ variant: 'primary', children: group.theme }),
                            ` (${engagementRate}% engagement)`
                        ]
                    });
                })
            }),
            Header({ title: 'Recommandations d\'organisation', subtitle: '' }),
            List({
                children: redundancyAnalysis.redundantGroups.map((group, index) => 
                    ListItem({
                        children: [
                            `Groupe ${index + 1} : `,
                            Badge({
                                variant: 'info',
                                children: `Créez un dossier "${group.theme}"`
                            })
                        ]
                    })
                )
            })
        ] : [
            Badge({
                variant: 'success',
                children: 'Aucune redondance majeure détectée : Vos sources sont bien diversifiées'
            })
        ];

        return Card({
            children: [
                Header({ title: 'Analyse de redondance', subtitle: '' }),
                ...content
            ]
        });
    }

    generateFeedbinFilters(analysis) {
        const filtersList = List({
            children: [
                ListItem({
                    children: [
                        'Articles étoilés non lus (priorité) : ',
                        Badge({ variant: 'code', children: 'is:unread is:starred' })
                    ]
                }),
                ListItem({
                    children: [
                        'Articles non étoilés (à scanner) : ',
                        Badge({ variant: 'code', children: 'is:unread -is:starred' })
                    ]
                }),
                ...(analysis.thematicClusters || []).slice(0, 3).map(cluster => {
                    const themeKeywords = cluster.theme.toLowerCase().split(' ').join(' OR ');
                    return ListItem({
                        children: [
                            `Articles ${cluster.theme.toLowerCase()} : `,
                            Badge({ variant: 'code', children: `title:(${themeKeywords})` })
                        ]
                    });
                })
            ]
        });

        return Card({
            children: [
                Header({ title: 'Filtres Feedbin utiles', subtitle: 'Créez ces filtres dans Feedbin pour organiser automatiquement' }),
                filtersList
            ]
        });
    }

    generateFeedbinTutorial(analysis) {
        const tutorialList = List({
            children: [
                ListItem({ children: [
                    'Organisation : ',
                    Badge({ variant: 'info', children: 'Créez des dossiers thématiques pour vos sources' })
                ]}),
                ListItem({ children: [
                    'Dossiers : ',
                    Badge({ variant: 'info', children: '"Priorité", "À scanner" et "Archive"' })
                ]}),
                ListItem({ children: [
                    'Filtres : ',
                    Badge({ variant: 'info', children: 'Utilisez les filtres ci-dessus pour organiser automatiquement' })
                ]}),
                ListItem({ children: [
                    'Workflow : ',
                    Badge({ variant: 'info', children: 'Commencez par les priorités, utilisez j/k pour naviguer' })
                ]})
            ]
        });

        return Card({
            children: [
                Header({ title: 'Guide pratique Feedbin', subtitle: 'Étapes pour réorganiser votre lecteur RSS' }),
                tutorialList
            ]
        });
    }

    generateWorkflowProductivity(analysis) {
        const workflowList = List({
            children: [
                ListItem({ children: [
                    'Structure de dossiers : ',
                    Badge({ variant: 'info', children: '"Priorité", "À scanner", "Archive", "À lire", "Lus"' })
                ]}),
                ListItem({ children: [
                    'Marquage intelligent : ',
                    Badge({ variant: 'info', children: 'Étoiles pour "relecture", "partage", "référence future"' })
                ]}),
                ListItem({ children: [
                    'Révision périodique : ',
                    Badge({ variant: 'info', children: 'Revisitez vos articles étoilés mensuellement' })
                ]}),
                analysis.readingPatterns?.avgReadTime > 300 && ListItem({ children: [
                    'Lecture différée : ',
                    Badge({ variant: 'info', children: 'Marquez les articles longs pour lecture ultérieure' })
                ]})
            ].filter(Boolean)
        });

        return Card({
            children: [
                Header({ title: 'Workflow et productivité', subtitle: 'Optimisation de votre routine de lecture' }),
                workflowList
            ]
        });
    }

    generateNoiseAnalysis(analysis) {
        const lowEngagement = analysis.topDomains.filter(([domain, count]) => {
            const engagement = analysis.domainEngagement[domain] || 0;
            return engagement / count < 0.3;
        });

        const inactiveSources = analysis.topDomains.filter(([domain, count]) => count < 5);

        const noiseList = List({
            children: [
                lowEngagement.length > 0 && ListItem({
                    children: [
                        'Sources à faible engagement : ',
                        Badge({
                            variant: 'warning',
                            children: `${lowEngagement.length} sources (${((lowEngagement.length / analysis.topDomains.length) * 100).toFixed(1)}%)`
                        })
                    ]
                }),
                inactiveSources.length > 0 && ListItem({
                    children: [
                        'Sources inactives : ',
                        Badge({
                            variant: 'warning',
                            children: `${inactiveSources.length} sources avec peu d'articles`
                        })
                    ]
                }),
                ListItem({
                    children: [
                        'Action recommandée : ',
                        Badge({
                            variant: 'error',
                            children: 'Désabonnez-vous des sources peu engageantes'
                        })
                    ]
                }),
                ListItem({
                    children: [
                        'Alternative : ',
                        Badge({
                            variant: 'info',
                            children: 'Déplacez-les dans un dossier "À réévaluer"'
                        })
                    ]
                })
            ].filter(Boolean)
        });

        return Card({
            children: [
                Header({ title: 'Réduction du bruit informationnel', subtitle: 'Identifiez et réduisez les sources de bruit' }),
                noiseList
            ]
        });
    }

    analyzeSourceRedundancy(analysis) {
        const redundantGroups = [];
        
        // Définir les groupes thématiques pour détecter les redondances
        const themeGroups = {
            'WordPress': ['wordpress', 'wp', 'plugin', 'theme', 'gutenberg', 'woocommerce'],
            'JavaScript': ['javascript', 'js', 'react', 'vue', 'angular', 'node', 'typescript'],
            'CSS/Design': ['css', 'design', 'ui', 'ux', 'responsive', 'frontend'],
            'Performance': ['performance', 'speed', 'optimization', 'lighthouse', 'webpagetest'],
            'Sécurité': ['security', 'sécurité', 'vulnérabilité', 'cve', 'threat', 'malware'],
            'AI/ML': ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'neural'],
            'News/Tech': ['news', 'tech', 'technology', 'startup', 'innovation'],
            'Blogs personnels': ['blog', 'personal', 'journal', 'thoughts', 'opinion']
        };
        
        // Analyser chaque groupe thématique
        Object.entries(themeGroups).forEach(([theme, keywords]) => {
            const matchingSources = [];
            
            // Trouver les sources qui correspondent à ce thème
            analysis.topDomains.forEach(([domain, count]) => {
                const domainLower = domain.toLowerCase();
                const hasKeyword = keywords.some(keyword => domainLower.includes(keyword));
                
                if (hasKeyword && count > 0) {
                    matchingSources.push({
                        domain,
                        title: domain,
                        count,
                        engagement: analysis.domainEngagement[domain] || 0
                    });
                }
            });
            
            // Si on a plusieurs sources dans le même thème, c'est potentiellement redondant
            if (matchingSources.length >= 2) {
                // Calculer le score de redondance basé sur la similarité des domaines
                const redundancyScore = this.calculateRedundancyScore(matchingSources);
                
                if (redundancyScore > 0.3) { // Seuil de redondance
                    redundantGroups.push({
                        theme,
                        sources: matchingSources,
                        redundancyScore: redundancyScore.toFixed(2)
                    });
                }
            }
        });
        
        // Analyser aussi les sources avec des noms très similaires
        const similarNameGroups = this.findSimilarNamedSources(analysis.topDomains);
        redundantGroups.push(...similarNameGroups);
        
        return {
            redundantGroups: redundantGroups.sort((a, b) => parseFloat(b.redundancyScore) - parseFloat(a.redundancyScore)),
            totalRedundantSources: redundantGroups.reduce((sum, group) => sum + group.sources.length, 0)
        };
    }
    
    calculateRedundancyScore(sources) {
        if (sources.length < 2) return 0;
        
        let totalSimilarity = 0;
        let comparisons = 0;
        
        for (let i = 0; i < sources.length; i++) {
            for (let j = i + 1; j < sources.length; j++) {
                const similarity = this.calculateStringSimilarity(
                    sources[i].domain.toLowerCase(),
                    sources[j].domain.toLowerCase()
                );
                totalSimilarity += similarity;
                comparisons++;
            }
        }
        
        return comparisons > 0 ? totalSimilarity / comparisons : 0;
    }
    
    calculateStringSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }
    
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    findSimilarNamedSources(domains) {
        const groups = [];
        const processed = new Set();
        
        domains.forEach(([domain1, count1], index1) => {
            if (processed.has(domain1)) return;
            
            const similarSources = [{
                domain: domain1,
                title: domain1,
                count: count1,
                engagement: 0 // Sera mis à jour plus tard
            }];
            
            domains.forEach(([domain2, count2], index2) => {
                if (index1 === index2 || processed.has(domain2)) return;
                
                const similarity = this.calculateStringSimilarity(domain1, domain2);
                if (similarity > 0.7) { // Seuil de similarité élevé pour les noms
                    similarSources.push({
                        domain: domain2,
                        title: domain2,
                        count: count2,
                        engagement: 0
                    });
                    processed.add(domain2);
                }
            });
            
            if (similarSources.length > 1) {
                groups.push({
                    theme: 'Noms similaires',
                    sources: similarSources,
                    redundancyScore: '0.75'
                });
                processed.add(domain1);
            }
        });
        
        return groups;
    }

    analyzeContentFormats(articles) {
        const patterns = {
            tutorials: ['tutorial', 'guide', 'how to', 'learn', 'step by step', 'getting started'],
            news: ['news', 'update', 'release', 'announces', 'launches', 'introduces'],
            reviews: ['review', 'comparison', 'vs', 'tested', 'benchmark', 'performance test'],
            opinions: ['opinion', 'thoughts', 'perspective', 'commentary', 'analysis', 'why']
        };
        
        const types = { tutorials: 0, news: 0, reviews: 0, opinions: 0 };
        
        articles.forEach(article => {
            const title = (article.title || '').toLowerCase();
            Object.entries(patterns).forEach(([type, keywords]) => {
                if (keywords.some(k => title.includes(k))) types[type]++;
            });
        });
        
        return types;
    }

    analyzeContentComplexity(articles) {
        let totalScore = 0;
        let analyzedCount = 0;
        
        articles.forEach(article => {
            const title = article.title || '';
            const content = article.content || '';
            const summary = article.summary || '';
            
            let score = 0;
            
            // Longueur du contenu
            const totalLength = title.length + content.length + summary.length;
            if (totalLength > 5000) score += 3;
            else if (totalLength > 2000) score += 2;
            else if (totalLength > 500) score += 1;
            
            // Mots techniques
            const technicalWords = ['algorithm', 'architecture', 'framework', 'protocol', 'api', 'database', 'optimization'];
            const text = (title + ' ' + content + ' ' + summary).toLowerCase();
            const technicalCount = technicalWords.filter(word => text.includes(word)).length;
            score += Math.min(technicalCount, 3);
            
            // Présence de code
            if (content.includes('```') || content.includes('<code>') || content.includes('function')) {
                score += 2;
            }
            
            // Mots complexes
            const complexWords = ['implementation', 'infrastructure', 'deployment', 'scalability', 'microservices'];
            const complexCount = complexWords.filter(word => text.includes(word)).length;
            score += Math.min(complexCount, 2);
            
            totalScore += score;
            analyzedCount++;
        });
        
        const avgScore = analyzedCount > 0 ? totalScore / analyzedCount : 0;
        
        let level = 'Simple';
        if (avgScore > 6) level = 'Avancé';
        else if (avgScore > 3) level = 'Intermédiaire';
        
        return { score: Math.round(avgScore * 10) / 10, level };
    }

    analyzePublicationPatterns(articles) {
        let weekendCount = 0;
        let totalWithDate = 0;
        
        articles.forEach(article => {
            if (article.published) {
                const date = new Date(article.published);
                if (!isNaN(date.getTime())) {
                    const dayOfWeek = date.getDay();
                    if (dayOfWeek === 0 || dayOfWeek === 6) { // Dimanche ou Samedi
                        weekendCount++;
                    }
                    totalWithDate++;
                }
            }
        });
        
        return {
            weekendRatio: totalWithDate > 0 ? weekendCount / totalWithDate : 0,
            weekendCount,
            totalWithDate
        };
    }

    analyzeContentFreshness(articles) {
        const now = new Date();
        let recentCount = 0;
        let oldCount = 0;
        let totalWithDate = 0;
        
        articles.forEach(article => {
            if (article.published) {
                const publishDate = new Date(article.published);
                if (!isNaN(publishDate.getTime())) {
                    const daysDiff = (now - publishDate) / (1000 * 60 * 60 * 24);
                    
                    if (daysDiff <= 30) recentCount++;
                    else if (daysDiff > 365) oldCount++;
                    
                    totalWithDate++;
                }
            }
        });
        
        if (totalWithDate === 0) return { description: 'Dates non disponibles' };
        
        const recentRatio = recentCount / totalWithDate;
        const oldRatio = oldCount / totalWithDate;
        
        if (recentRatio > 0.5) {
            return { description: 'Contenu récent (majorité < 30 jours)' };
        } else if (oldRatio > 0.5) {
            return { description: 'Contenu ancien (majorité > 1 an)' };
        } else {
            return { description: 'Contenu mixte (répartition équilibrée)' };
        }
    }

    parseOpml(opmlData) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(opmlData, 'text/xml');
        const outlines = xmlDoc.querySelectorAll('outline[type="rss"]');
        
        const subscriptions = [];
        outlines.forEach(outline => {
            const title = outline.getAttribute('title') || outline.getAttribute('text') || '';
            const xmlUrl = outline.getAttribute('xmlUrl') || '';
            const htmlUrl = outline.getAttribute('htmlUrl') || '';
            
            if (xmlUrl) {
                let domain = '';
                try {
                    domain = new URL(xmlUrl).hostname;
                } catch(e) {
                    try {
                        domain = new URL(htmlUrl).hostname;
                    } catch(e2) {
                        domain = title.toLowerCase().replace(/[^a-z0-9.-]/g, '');
                    }
                }
                
                subscriptions.push({
                    title,
                    xmlUrl,
                    htmlUrl,
                    domain
                });
            }
        });
        
        return subscriptions;
    }

    calculateActivityLevel(score, total) {
        const percentage = (score / total) * 100;
        if (percentage > 20) return 'very_high';
        if (percentage > 10) return 'high';
        if (percentage > 5) return 'medium';
        return 'low';
    }

    getActivityColor(level) {
        const colors = {
            'very_high': '#dc2626',
            'high': '#ea580c',
            'medium': '#ca8a04',
            'low': '#16a34a'
        };
        return colors[level] || '#6b7280';
    }

    extractCategoryFromDomain(domain) {
        const parts = domain.split('.');
        if (parts.length >= 2) {
            return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
        }
        return domain;
    }

    getFrequencyDisplayName(frequency) {
        const names = {
            'multiple_daily': 'Multi-quotidien',
            'daily': 'Quotidien',
            'weekly': 'Hebdomadaire',
            'irregular': 'Irregular'
        };
        return names[frequency] || frequency;
    }

    showLoading() {
        this.elements.uploadSection.style.display = 'none';
        this.elements.loadingSection.style.display = 'block';
        this.elements.resultsSection.classList.add('hidden');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generatePeriodDescription(analysis) {
        if (!analysis.dateRange.start || !analysis.dateRange.end) return '';
        
        const startYear = analysis.dateRange.start.getFullYear();
        const endYear = analysis.dateRange.end.getFullYear();
        const yearsSpan = endYear - startYear;
        const dayRange = Math.round((analysis.dateRange.end - analysis.dateRange.start) / (1000 * 60 * 60 * 24));
        
        let description = yearsSpan === 0 ? 
            `Vos favoris couvrent l'année ${startYear}` :
            `Vos favoris s'étendent sur ${yearsSpan} ${yearsSpan === 1 ? 'an' : 'ans'}`;
        
        const startMonth = analysis.dateRange.start.toLocaleDateString('fr-FR', { month: 'short' });
        const endMonth = analysis.dateRange.end.toLocaleDateString('fr-FR', { month: 'short' });
        const timelineDisplay = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
        
        return `${description} (${timelineDisplay}) • ${dayRange.toLocaleString()} jours d'activité`;
    }

    copyFullData(sources) {
        const data = sources.map(([domain, count]) => `${domain}\t${count}`).join('\n');
        navigator.clipboard.writeText(data);
    }

    copyUrlsOnly(sources) {
        const urls = sources.map(([domain]) => `https://${domain}`).join('\n');
        navigator.clipboard.writeText(urls);
    }
}



// Initialisation
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { app = new App(); });
} else {
    app = new App();
}
window.app = app; 
// public/js/migration.js - Frontend migration module
class MigrationModule {
    constructor() {
        this.freshRSSData = null;
        this.feedbinSubscriptions = null;
        this.migrationState = 'idle';
    }

    /**
     * Handle file upload for FreshRSS data
     * @param {Event} event - File upload event
     * @returns {Promise<boolean>} - Success status
     */
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return false;

        // Validate file type
        if (file.type !== 'application/json') {
            this.showError('Please select a JSON file exported from FreshRSS');
            return false;
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            this.showError('File too large (max 50MB)');
            return false;
        }

        try {
            const content = await this.readFileAsText(file);
            const data = JSON.parse(content);

            // Validate FreshRSS format
            if (!data.items || !Array.isArray(data.items)) {
                this.showError('Invalid FreshRSS file format. The file must contain an "items" array.');
                return false;
            }

            if (data.items.length === 0) {
                this.showError('FreshRSS file contains no items to migrate');
                return false;
            }

            // Store data
            this.freshRSSData = data;

            // Display file info
            this.displayFileInfo(file, data);

            // Enable next step
            document.getElementById('analyze-feedbin').disabled = false;
            this.updateStepStatus(1, 'completed');
            this.updateStepStatus(2, 'current');

            this.showSuccess(`✅ File loaded: ${data.items.length} favorites from ${this.getSourceCount(data)} sources`);
            return true;

        } catch (error) {
            console.error('File upload error:', error);
            this.showError('Error reading file. Please check the file format.');
            return false;
        }
    }

    /**
     * Analyze Feedbin subscriptions
     * @returns {Promise<boolean>} - Success status
     */
    async analyzeFeedbin() {
        const analyzeBtn = document.getElementById('analyze-feedbin');
        const analysisDiv = document.getElementById('feedbin-analysis');
        
        this.setButtonLoading(analyzeBtn, true);
        
        try {
            // Get FeedbinAPI from auth module
            const authModule = window.authModule;
            if (!authModule || !authModule.isAuthenticated) {
                throw new Error('Not authenticated');
            }
            
            const feedbinAPI = authModule.getFeedbinAPI();
            this.feedbinSubscriptions = await feedbinAPI.getSubscriptions();
            this.displayFeedbinAnalysis();
            
            // Enable migration step
            document.getElementById('start-migration').disabled = false;
            this.updateStepStatus(2, 'completed');
            this.updateStepStatus(3, 'current');
            
            // Cache stats removed (client-side only, no backend cache)
            
        } catch (error) {
            console.error('Feedbin analysis error:', error);
            analysisDiv.innerHTML = `
                <div style="color: var(--error);">❌ ${error.message}</div>
            `;
        } finally {
            this.setButtonLoading(analyzeBtn, false);
        }
    }

    /**
     * Start migration process
     * @returns {Promise<boolean>} - Success status
     */
    async startMigration() {
        if (!this.freshRSSData || !this.feedbinSubscriptions) {
            this.showError('Missing data to start migration');
            return false;
        }

        const startBtn = document.getElementById('start-migration');
        const progressContainer = document.getElementById('migration-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        this.migrationState = 'running';
        startBtn.disabled = true;
        progressContainer.classList.remove('hidden');
        
        try {
            progressText.textContent = 'Starting migration...';
            
            // Get FeedbinAPI from auth module
            const authModule = window.authModule;
            if (!authModule || !authModule.isAuthenticated) {
                throw new Error('Not authenticated');
            }
            
            const feedbinAPI = authModule.getFeedbinAPI();
            
            // Perform migration client-side
            const result = await this.performMigrationClientSide(feedbinAPI);
            
            if (result.success) {
                this.migrationState = 'completed';
                progressFill.style.width = '100%';
                progressText.textContent = '100% - Migration completed!';
                
                this.updateStepStatus(3, 'completed');
                this.updateStepStatus(4, 'current');
                
                this.displayRealMigrationResults(result.results);
                return true;
            } else {
                throw new Error('Migration failed');
            }
            
        } catch (error) {
            console.error('Migration error:', error);
            this.migrationState = 'error';
            this.updateStepStatus(3, 'blocked');
            this.showError('Error during migration: ' + error.message);
            
            progressFill.style.width = '0%';
            progressText.textContent = 'Migration error';
            return false;
        }
    }

    /**
     * Perform migration client-side using Feedbin API
     * @param {FeedbinAPI} feedbinAPI - Feedbin API instance
     * @returns {Promise<Object>} Migration results
     */
    async performMigrationClientSide(feedbinAPI) {
        const results = {
            total: 0,
            starred: 0,
            processed: 0,
            failed: 0,
            bySource: {}
        };

        const items = this.freshRSSData.items || [];
        results.total = items.length;

        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        // Process items in batches
        const batchSize = 10;
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            
            // Update progress
            const progress = Math.round(((i + batch.length) / items.length) * 100);
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${progress}% - Processing...`;

            // Process batch
            for (const item of batch) {
                try {
                    // Find matching entry in Feedbin by URL
                    const entryId = await this.findEntryInFeedbin(feedbinAPI, item.url);
                    
                    if (entryId) {
                        // Star the entry
                        const success = await feedbinAPI.starEntry(entryId);
                        if (success) {
                            results.starred++;
                            const source = item.feed_title || 'Unknown';
                            if (!results.bySource[source]) {
                                results.bySource[source] = { total: 0, starred: 0 };
                            }
                            results.bySource[source].total++;
                            results.bySource[source].starred++;
                        } else {
                            results.failed++;
                        }
                    } else {
                        results.failed++;
                    }
                    results.processed++;
                } catch (error) {
                    console.error('Error migrating item:', error);
                    results.failed++;
                    results.processed++;
                }
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return {
            success: true,
            results: results
        };
    }

    /**
     * Find entry ID in Feedbin by URL
     * @param {FeedbinAPI} feedbinAPI - Feedbin API instance
     * @param {string} url - Entry URL to find
     * @returns {Promise<number|null>} Entry ID or null
     */
    async findEntryInFeedbin(feedbinAPI, url) {
        try {
            // Search for entries by URL (simplified - may need pagination)
            const entries = await feedbinAPI.searchEntriesByURL(url);
            if (entries && entries.length > 0) {
                // Find exact match
                const match = entries.find(e => e.url === url);
                return match ? match.id : null;
            }
        } catch (error) {
            console.error('Error finding entry:', error);
        }
        return null;
    }

    /**
     * Get unmigrated favorites from migration results
     * @param {Object} migrationResults - Migration results
     * @returns {Array} Array of unmigrated items
     */
    getUnmigratedFavorites(migrationResults) {
        if (!this.freshRSSData || !migrationResults || !migrationResults.results) {
            return [];
        }

        const items = this.freshRSSData.items || [];
        const bySource = migrationResults.results.bySource || {};
        const unmigrated = [];

        // Find items that failed to migrate
        for (const item of items) {
            const source = item.feed_title || 'Unknown';
            const sourceStats = bySource[source];
            
            if (!sourceStats || sourceStats.starred === 0) {
                unmigrated.push(item);
            }
        }

        return unmigrated;
    }

    /**
     * Download export file
     * @param {Array} unmigrated - Unmigrated items
     */
    downloadExportFile(unmigrated) {
        const exportData = {
            export_date: new Date().toISOString(),
            unmigrated_count: unmigrated.length,
            items: unmigrated
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `unmigrated-favorites-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Display FreshRSS analysis results
     * @param {Object} analysis - Analysis data
     */
    displayFreshRSSAnalysis(analysis) {
        const analysisDiv = document.getElementById('freshrss-analysis');
        
        const topSources = analysis.topSources.slice(0, 5);
        
        analysisDiv.innerHTML = `
            <h3>📊 FreshRSS Data Analysis</h3>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${analysis.totalEntries}</span>
                    <span class="stat-label">Total favorites</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${analysis.sourceCount}</span>
                    <span class="stat-label">Sources</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${this.formatDate(analysis.dateRange.oldest)}</span>
                    <span class="stat-label">Oldest</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${this.formatDate(analysis.dateRange.newest)}</span>
                    <span class="stat-label">Newest</span>
                </div>
            </div>
            
            <h4>🏆 Top 5 sources:</h4>
            <div class="results-container">
                ${topSources.map(([source, data]) => `
                    <div class="result-item">
                        <span><strong>${source}</strong></span>
                        <span>${data.count} favorites</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        analysisDiv.classList.remove('hidden');
    }

    /**
     * Display Feedbin analysis results
     */
    displayFeedbinAnalysis() {
        const analysisDiv = document.getElementById('feedbin-analysis');
        
        analysisDiv.innerHTML = `
            <h3>📡 Feedbin Analysis</h3>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${this.feedbinSubscriptions.length}</span>
                    <span class="stat-label">Subscriptions</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">✅</span>
                    <span class="stat-label">Connection OK</span>
                </div>
            </div>
            
            <div style="margin-top: 15px; color: var(--success);">
                ✅ Ready for migration!
            </div>
        `;
        
        analysisDiv.classList.remove('hidden');
    }

    /**
     * Display migration results
     * @param {Object} results - Migration results
     */
    displayRealMigrationResults(results) {
        const resultsDiv = document.getElementById('migration-results');
        const finalDiv = document.getElementById('final-results');
        
        const { total, starred, processed, bySource } = results;
        const percentage = Math.round((starred / total) * 100);
        const failed = total - starred;
        
        // Create sources list with details
        const sourcesList = Object.entries(bySource)
            .sort((a, b) => b[1].starred - a[1].starred)
            .map(([source, stats]) => {
                const sourceRate = stats.total > 0 ? Math.round((stats.starred / stats.total) * 100) : 0;
                return `
                    <div class="result-item">
                        <span><strong>${source}</strong> (${stats.starred}/${stats.total})</span>
                        <span style="color: ${sourceRate >= 70 ? 'var(--success)' : sourceRate >= 30 ? 'var(--warning)' : 'var(--error)'}">
                            ${sourceRate}%
                        </span>
                    </div>
                `;
            }).join('');
        
        const resultsHTML = `
            <h3>🎉 Migration completed!</h3>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${starred}</span>
                    <span class="stat-label">Successfully migrated</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${failed}</span>
                    <span class="stat-label">Failures</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${percentage}%</span>
                    <span class="stat-label">Success rate</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${Object.keys(bySource).length}</span>
                    <span class="stat-label">Sources processed</span>
                </div>
            </div>
            
            <h4>📊 Results by source:</h4>
            <div class="results-container">
                ${sourcesList}
            </div>
            
            ${failed > 0 ? `
                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: var(--radius);">
                    <strong>💡 Tips to improve success rate:</strong><br>
                    • Check that you are subscribed to missing feeds in Feedbin<br>
                    • Some articles may be too old or deleted<br>
                    • Use analysis tools to identify feeds to import
                </div>
                
                <div style="margin-top: 15px;">
                    <button id="export-unmigrated-btn" class="btn btn-secondary">
                        📄 Export unmigrated favorites
                    </button>
                </div>
            ` : `
                <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: var(--radius);">
                    <strong>🎉 Perfect migration!</strong><br>
                    All your favorites have been successfully migrated to Feedbin.
                </div>
            `}
        `;
        
        resultsDiv.innerHTML = resultsHTML;
        resultsDiv.classList.remove('hidden');
        
        finalDiv.innerHTML = resultsHTML;
        finalDiv.classList.remove('hidden');
        
        // Add event for exporting unmigrated favorites
        if (failed > 0) {
            const exportBtn = document.getElementById('export-unmigrated-btn');
            exportBtn.addEventListener('click', () => this.exportUnmigratedFavorites(results));
        }
    }

    /**
     * Export unmigrated favorites
     * @param {Object} migrationResults - Migration results
     */
    async exportUnmigratedFavorites(migrationResults) {
        const exportBtn = document.getElementById('export-unmigrated-btn');
        const originalText = exportBtn.textContent;
        
        this.setButtonLoading(exportBtn, true);
        exportBtn.textContent = '⏳ Generating...';
        
        try {
            // Export unmigrated favorites client-side
            const unmigrated = this.getUnmigratedFavorites(migrationResults);
            
            if (unmigrated.length === 0) {
                this.showSuccess('All favorites were successfully migrated!');
                return;
            }
            
            // Generate JSON export
            const exportData = {
                success: true,
                unmigrated: unmigrated,
                count: unmigrated.length
            };
            
            this.displayExportResults(exportData);
            this.downloadExportFile(unmigrated);
            this.showSuccess(`Export completed: ${unmigrated.length} unmigrated favorites`);
            
        } catch (error) {
            console.error('Export error:', error);
            this.showError('Export error: ' + error.message);
        } finally {
            this.setButtonLoading(exportBtn, false);
            exportBtn.textContent = originalText;
        }
    }

    /**
     * Display export results
     * @param {Object} exportData - Export data
     */
    displayExportResults(exportData) {
        const { unmigratedCount, missingFeedsCount, opml, report, csv, summary } = exportData;
        
        // Create download links
        const opmlBlob = new Blob([opml], { type: 'application/xml' });
        const csvBlob = new Blob([csv], { type: 'text/csv' });
        
        const opmlUrl = URL.createObjectURL(opmlBlob);
        const csvUrl = URL.createObjectURL(csvBlob);
        
        const exportHTML = `
            <h3>📄 Export of unmigrated favorites</h3>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${unmigratedCount}</span>
                    <span class="stat-label">Unmigrated favorites</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${missingFeedsCount}</span>
                    <span class="stat-label">Missing feeds</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${summary.successRate}%</span>
                    <span class="stat-label">Success rate</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${summary.migrated}</span>
                    <span class="stat-label">Successfully migrated</span>
                </div>
            </div>
            
            <h4>📥 Files to download:</h4>
            <div class="export-links">
                <a href="${opmlUrl}" download="missing-feeds.opml" class="btn btn-primary">
                    📄 Download OPML (${missingFeedsCount} feeds)
                </a>
                <a href="${csvUrl}" download="unmigrated-favorites.csv" class="btn btn-secondary">
                    📊 Download CSV (${unmigratedCount} favorites)
                </a>
            </div>
            
            <h4>📋 Top 5 sources with failures:</h4>
            <div class="results-container">
                ${report.topFailedSources.map(source => `
                    <div class="result-item">
                        <span><strong>${source.source}</strong></span>
                        <span style="color: var(--error);">
                            ${source.failed} failures (${source.rate}% success)
                        </span>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border: 1px solid #bbdefb; border-radius: var(--radius);">
                <strong>💡 Instructions:</strong><br>
                1. <strong>Import the OPML file</strong> into Feedbin (Settings > Import/Export)<br>
                2. <strong>Wait 30-60 minutes</strong> for Feedbin to sync the feeds<br>
                3. <strong>Restart the migration</strong> to recover missing favorites<br>
                4. <strong>Check the CSV</strong> to see the detailed list of unmigrated favorites
            </div>
        `;
        
        // Create or update export section
        let exportSection = document.getElementById('export-results');
        if (!exportSection) {
            exportSection = document.createElement('div');
            exportSection.id = 'export-results';
            exportSection.className = 'export-results';
            document.getElementById('final-results').appendChild(exportSection);
        }
        
        exportSection.innerHTML = exportHTML;
        exportSection.classList.remove('hidden');
    }

    /**
     * Load cache statistics (removed - no backend cache in client-side version)
     */
    async loadCacheStats() {
        // Cache stats not available in client-side only version
        // This method is kept for compatibility but does nothing
    }

    /**
     * Display cache statistics
     * @param {Object} stats - Cache statistics
     */
    displayCacheStats(stats) {
        const cacheStatsDiv = document.getElementById('cache-stats');
        if (!cacheStatsDiv) return;

        cacheStatsDiv.innerHTML = `
            <h4>📋 Cache Statistics</h4>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${stats.subscriptions}</span>
                    <span class="stat-label">Cached subscriptions</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${stats.entries}</span>
                    <span class="stat-label">Cached feeds</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${stats.totalMemory}</span>
                    <span class="stat-label">Memory usage</span>
                </div>
            </div>
        `;
    }

    /**
     * Read file as text
     * @param {File} file - File to read
     * @returns {Promise<string>} - File content
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    /**
     * Display file information
     * @param {File} file - Uploaded file
     * @param {Object} data - Parsed data
     */
    displayFileInfo(file, data) {
        const fileInfo = document.getElementById('file-info');
        if (!fileInfo) return;

        fileInfo.innerHTML = `
            <div class="file-info">
                <h4>📁 File Information</h4>
                <p><strong>Name:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
                <p><strong>Items:</strong> ${data.items.length} favorites</p>
                <p><strong>Sources:</strong> ${this.getSourceCount(data)} feeds</p>
                <p><strong>Date Range:</strong> ${this.getDateRange(data)}</p>
            </div>
        `;
        fileInfo.classList.remove('hidden');
    }

    /**
     * Get source count from data
     * @param {Object} data - FreshRSS data
     * @returns {number} - Source count
     */
    getSourceCount(data) {
        const sources = new Set();
        data.items.forEach(item => {
            const source = item.origin?.title || 'Unknown source';
            sources.add(source);
        });
        return sources.size;
    }

    /**
     * Get date range from data
     * @param {Object} data - FreshRSS data
     * @returns {string} - Date range string
     */
    getDateRange(data) {
        const dates = data.items.map(item => item.published * 1000).sort((a, b) => a - b);
        const oldest = new Date(dates[0]);
        const newest = new Date(dates[dates.length - 1]);
        return `${this.formatDate(oldest.toISOString())} to ${this.formatDate(newest.toISOString())}`;
    }

    /**
     * Format file size
     * @param {number} bytes - Bytes to format
     * @returns {string} - Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Format date
     * @param {string} dateString - Date string
     * @returns {string} - Formatted date
     */
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    }

    /**
     * Sleep utility
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise} - Sleep promise
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in main app
window.MigrationModule = MigrationModule; 
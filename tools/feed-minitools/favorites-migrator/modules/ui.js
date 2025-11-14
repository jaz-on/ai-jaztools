// public/js/ui.js - Frontend UI utilities module
class UIModule {
    constructor() {
        this.currentTab = 'migration';
    }

    /**
     * Initialize UI components
     */
    init() {
        this.bindTabEvents();
        this.bindPreferencesEvents();
        this.bindAdminEvents();
        this.setupEventListeners();
    }

    /**
     * Bind tab switching events
     */
    bindTabEvents() {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    /**
     * Bind preferences events
     */
    bindPreferencesEvents() {
        // Migration configuration
        const configForm = document.getElementById('migration-config');
        if (configForm) {
            configForm.addEventListener('submit', (e) => this.saveMigrationConfig(e));
        }

        // Export buttons
        const exportActivityBtn = document.getElementById('export-activity');
        if (exportActivityBtn) {
            exportActivityBtn.addEventListener('click', (e) => this.exportMyActivity(e));
        }

        const exportAdminBtn = document.getElementById('export-admin');
        if (exportAdminBtn) {
            exportAdminBtn.addEventListener('click', (e) => this.exportAdminData(e));
        }

        // Clear logs button
        const clearLogsBtn = document.getElementById('clear-logs');
        if (clearLogsBtn) {
            clearLogsBtn.addEventListener('click', (e) => this.clearLogs(e));
        }
    }

    /**
     * Bind admin events
     */
    bindAdminEvents() {
        // Admin-specific event bindings
        const adminRefreshBtn = document.getElementById('refresh-admin');
        if (adminRefreshBtn) {
            adminRefreshBtn.addEventListener('click', () => this.loadAdminData());
        }
    }

    /**
     * Setup general event listeners
     */
    setupEventListeners() {
        // File upload
        const fileInput = document.getElementById('freshrss-file');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Migration buttons
        const analyzeBtn = document.getElementById('analyze-feedbin');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeFeedbin());
        }

        const startBtn = document.getElementById('start-migration');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startMigration());
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    /**
     * Switch to tab
     * @param {string} tabName - Tab name
     */
    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(`${tabName}-tab`);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }
        
        // Add active class to selected tab button
        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }

        this.currentTab = tabName;
        
        // Load tab-specific data
        this.loadTabData(tabName);
    }

    /**
     * Load tab-specific data
     * @param {string} tabName - Tab name
     */
    async loadTabData(tabName) {
        switch (tabName) {
            case 'migration':
                // Migration tab doesn't need additional data loading
                break;
            case 'preferences':
                await this.loadMyPreferences();
                break;
            case 'activity':
                await this.loadMyActivity();
                break;
            case 'admin':
                await this.loadAdminData();
                break;
        }
    }

    /**
     * Load my activity data
     */
    async loadMyActivity() {
        try {
            const response = await this.makeAuthenticatedRequest('/api/user/activity');
            if (response.ok) {
                const data = await response.json();
                this.displayMyActivityHistory(data);
            }
        } catch (error) {
            console.error('Error loading activity:', error);
        }
    }

    /**
     * Load my preferences
     */
    async loadMyPreferences() {
        try {
            const response = await this.makeAuthenticatedRequest('/api/user/preferences');
            if (response.ok) {
                const data = await response.json();
                this.displayMyPreferences(data);
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }

    /**
     * Load admin data
     */
    async loadAdminData() {
        try {
            const response = await this.makeAuthenticatedRequest('/api/admin/stats');
            if (response.ok) {
                const data = await response.json();
                this.displayAdminStats(data);
            }
        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    }

    /**
     * Display my activity history
     * @param {Array} history - Activity history
     */
    displayMyActivityHistory(history) {
        const activityDiv = document.getElementById('my-activity');
        if (!activityDiv) return;

        const historyHTML = `
            <h3>📊 My Activity History</h3>
            <div class="activity-list">
                ${history.map(activity => `
                    <div class="activity-item">
                        <div class="activity-date">${this.formatDate(activity.date)}</div>
                        <div class="activity-stats">
                            <span class="stat">${activity.total} items</span>
                            <span class="stat success">${activity.succeeded} succeeded</span>
                            <span class="stat">${activity.successRate}% success</span>
                            <span class="stat">${activity.duration}s duration</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        activityDiv.innerHTML = historyHTML;
        activityDiv.classList.remove('hidden');
    }

    /**
     * Display my preferences
     * @param {Object} prefs - User preferences
     */
    displayMyPreferences(prefs) {
        const prefsDiv = document.getElementById('my-preferences');
        if (!prefsDiv) return;

        const prefsHTML = `
            <h3>⚙️ My Preferences</h3>
            <div class="preferences-form">
                <div class="form-group">
                    <label for="retry-attempts">Retry Attempts</label>
                    <input type="number" id="retry-attempts" value="${prefs.retryAttempts || 3}" min="1" max="10">
                </div>
                <div class="form-group">
                    <label for="batch-size">Batch Size</label>
                    <input type="number" id="batch-size" value="${prefs.batchSize || 100}" min="10" max="1000">
                </div>
                <div class="form-group">
                    <label for="delay-between-batches">Delay Between Batches (ms)</label>
                    <input type="number" id="delay-between-batches" value="${prefs.delayBetweenBatches || 1000}" min="0" max="10000">
                </div>
                <button type="submit" class="btn btn-primary">Save Preferences</button>
            </div>
        `;

        prefsDiv.innerHTML = prefsHTML;
        prefsDiv.classList.remove('hidden');
    }

    /**
     * Display admin statistics
     * @param {Object} stats - Admin statistics
     */
    displayAdminStats(stats) {
        const adminDiv = document.getElementById('admin-stats');
        if (!adminDiv) return;

        const statsHTML = `
            <h3>🔧 Admin Statistics</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${stats.totalUsers}</span>
                    <span class="stat-label">Total Users</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${stats.totalMigrations}</span>
                    <span class="stat-label">Total Migrations</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${stats.avgSuccessRate}%</span>
                    <span class="stat-label">Average Success Rate</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${stats.activeUsers}</span>
                    <span class="stat-label">Active Users</span>
                </div>
            </div>
        `;

        adminDiv.innerHTML = statsHTML;
        adminDiv.classList.remove('hidden');
    }

    /**
     * Save migration configuration
     * @param {Event} event - Form submission event
     */
    async saveMigrationConfig(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const config = {
            retryAttempts: parseInt(formData.get('retry-attempts')),
            batchSize: parseInt(formData.get('batch-size')),
            delayBetweenBatches: parseInt(formData.get('delay-between-batches'))
        };

        try {
            const response = await this.makeAuthenticatedRequest('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (response.ok) {
                this.showSuccess('Preferences saved successfully!');
            } else {
                this.showError('Failed to save preferences');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            this.showError('Error saving preferences');
        }
    }

    /**
     * Export my activity
     * @param {Event} event - Click event
     */
    async exportMyActivity(event) {
        event.preventDefault();
        
        try {
            const response = await this.makeAuthenticatedRequest('/api/user/export-activity');
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'my-activity.csv';
                a.click();
                URL.revokeObjectURL(url);
                this.showSuccess('Activity exported successfully!');
            } else {
                this.showError('Failed to export activity');
            }
        } catch (error) {
            console.error('Error exporting activity:', error);
            this.showError('Error exporting activity');
        }
    }

    /**
     * Export admin data
     * @param {Event} event - Click event
     */
    async exportAdminData(event) {
        event.preventDefault();
        
        try {
            const response = await this.makeAuthenticatedRequest('/api/admin/export');
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'admin-data.csv';
                a.click();
                URL.revokeObjectURL(url);
                this.showSuccess('Admin data exported successfully!');
            } else {
                this.showError('Failed to export admin data');
            }
        } catch (error) {
            console.error('Error exporting admin data:', error);
            this.showError('Error exporting admin data');
        }
    }

    /**
     * Clear logs
     * @param {Event} event - Click event
     */
    async clearLogs(event) {
        event.preventDefault();
        
        if (!confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await this.makeAuthenticatedRequest('/api/admin/clear-logs', {
                method: 'POST'
            });

            if (response.ok) {
                this.showSuccess('Logs cleared successfully!');
            } else {
                this.showError('Failed to clear logs');
            }
        } catch (error) {
            console.error('Error clearing logs:', error);
            this.showError('Error clearing logs');
        }
    }

    /**
     * Show loading state
     * @param {boolean} show - Whether to show loading
     */
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 8000);
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        const successDiv = document.getElementById('success-message');
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
        
        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 3000);
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        document.getElementById('error-message').classList.add('hidden');
        document.getElementById('success-message').classList.add('hidden');
    }

    /**
     * Set button loading state
     * @param {HTMLButtonElement} button - Button element
     * @param {boolean} loading - Loading state
     */
    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
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
     * Make authenticated request (delegates to auth module)
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Response>} - API response
     */
    async makeAuthenticatedRequest(endpoint, options = {}) {
        // Client-side only: Most UI features that required backend are now disabled
        // This method is kept for compatibility but will throw an error
        throw new Error('Backend endpoints not available in client-side only version. This feature requires a backend.');
    }
}

// Export for use in main app
window.UIModule = UIModule; 
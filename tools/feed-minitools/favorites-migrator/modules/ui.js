/**
 * @module tools/feed-minitools/favorites-migrator/modules/ui
 * 
 * Module d'interface utilisateur pour Favorites Migrator
 * 
 * Gère les composants UI, la navigation par onglets et les interactions utilisateur.
 */

import { showError as displayError, showSuccess as displaySuccess } from '../../../../shared/utils/messages.js';

/**
 * Classe de gestion de l'interface utilisateur
 * 
 * @class
 */
class UIModule {
    /**
     * Crée une instance du module UI
     * 
     * @constructor
     */
    constructor() {
        this.currentTab = 'migration';
    }

    /**
     * Initialise les composants UI
     * 
     * @returns {void}
     */
    init() {
        this.bindTabEvents();
        this.bindPreferencesEvents();
        this.bindAdminEvents();
        this.setupEventListeners();
    }

    /**
     * Lie les événements de changement d'onglet avec navigation clavier
     * 
     * @returns {void}
     */
    bindTabEvents() {
        const tabButtons = document.querySelectorAll('.tab-btn[role="tab"]');
        
        tabButtons.forEach((button, index) => {
            // Click event
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
            
            // Keyboard navigation
            button.addEventListener('keydown', (e) => {
                this.handleTabKeydown(e, index, tabButtons);
            });
        });
    }
    
    /**
     * Gère la navigation clavier pour les onglets
     * 
     * @param {KeyboardEvent} e - Événement clavier
     * @param {number} currentIndex - Index de l'onglet actuel
     * @param {NodeList} tabButtons - Tous les boutons d'onglets
     * @returns {void}
     */
    handleTabKeydown(e, currentIndex, tabButtons) {
        const buttons = Array.from(tabButtons);
        let targetIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                targetIndex = (currentIndex + 1) % buttons.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                targetIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                break;
            case 'Home':
                e.preventDefault();
                targetIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                targetIndex = buttons.length - 1;
                break;
            default:
                return;
        }
        
        const targetButton = buttons[targetIndex];
        const tabName = targetButton.getAttribute('data-tab');
        this.switchTab(tabName);
        targetButton.focus();
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
     * Switch to tab with accessibility support
     * @param {string} tabName - Tab name
     */
    switchTab(tabName) {
        // Hide all tab contents and update ARIA
        document.querySelectorAll('.tab-content[role="tabpanel"]').forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
            content.setAttribute('tabindex', '-1');
        });
        
        // Remove active class from all tabs and update ARIA
        document.querySelectorAll('.tab-btn[role="tab"]').forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
            button.setAttribute('tabindex', '-1');
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(tabName);
        if (selectedContent) {
            selectedContent.classList.add('active');
            selectedContent.setAttribute('aria-hidden', 'false');
            selectedContent.setAttribute('tabindex', '0');
        }
        
        // Add active class to selected tab button and update ARIA
        const selectedButton = document.querySelector(`[data-tab="${tabName}"][role="tab"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
            selectedButton.setAttribute('aria-selected', 'true');
            selectedButton.setAttribute('tabindex', '0');
        }

        this.currentTab = tabName;
        
        // Load tab-specific data
        this.loadTabData(tabName);
        
        // Focus first focusable element in the new tab panel
        setTimeout(() => {
            const firstFocusable = selectedContent?.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
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
            } else {
                this.showError(`Erreur lors du chargement de l'activité: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error loading activity:', error);
            this.showError(`Erreur lors du chargement de l'activité: ${error.message || 'Erreur inconnue'}`);
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
            } else {
                this.showError(`Erreur lors du chargement des préférences: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            this.showError(`Erreur lors du chargement des préférences: ${error.message || 'Erreur inconnue'}`);
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
            } else {
                this.showError(`Erreur lors du chargement des statistiques: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error loading admin data:', error);
            this.showError(`Erreur lors du chargement des statistiques: ${error.message || 'Erreur inconnue'}`);
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
            this.showError(`Erreur lors de la sauvegarde des préférences: ${error.message || 'Erreur inconnue'}`);
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
            this.showError(`Erreur lors de l'export de l'activité: ${error.message || 'Erreur inconnue'}`);
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
            this.showError(`Erreur lors de l'export des données admin: ${error.message || 'Erreur inconnue'}`);
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
            this.showError(`Erreur lors de la suppression des logs: ${error.message || 'Erreur inconnue'}`);
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
        const errorDiv = document.getElementById('error-message-container') || document.getElementById('error-message');
        const Message = this.getSharedComponent('Message');
        if (Message && errorDiv) {
            errorDiv.innerHTML = '';
            const messageEl = Message({
                type: 'error',
                children: message
            });
            errorDiv.appendChild(messageEl);
        } else if (errorDiv) {
            displayError(message, errorDiv);
        }
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        const successDiv = document.getElementById('success-message-container') || document.getElementById('success-message');
        const Message = this.getSharedComponent('Message');
        if (Message && successDiv) {
            successDiv.innerHTML = '';
            const messageEl = Message({
                type: 'success',
                children: message
            });
            successDiv.appendChild(messageEl);
        } else if (successDiv) {
            displaySuccess(message, successDiv);
        }
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        const errorDiv = document.getElementById('error-message-container') || document.getElementById('error-message');
        const successDiv = document.getElementById('success-message-container') || document.getElementById('success-message');
        if (errorDiv) {
            errorDiv.innerHTML = '';
        }
        if (successDiv) {
            successDiv.innerHTML = '';
        }
    }

    /**
     * Helper function to get shared components
     * @param {string} name - Component name
     * @returns {Function|null} Component function or null
     */
    getSharedComponent(name) {
        if (window.SharedComponents && window.SharedComponents[name]) {
            return window.SharedComponents[name];
        }
        return null;
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
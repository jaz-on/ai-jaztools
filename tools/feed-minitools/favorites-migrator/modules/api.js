/**
 * Feedbin API Module - Direct client-side API communication
 * Uses Basic Auth to communicate directly with Feedbin API
 */

class FeedbinAPI {
    constructor() {
        this.baseURL = 'https://api.feedbin.com/v2';
        this.email = null;
        this.password = null;
    }

    /**
     * Set credentials for API calls
     * @param {string} email - Feedbin email
     * @param {string} password - Feedbin password
     */
    setCredentials(email, password) {
        this.email = email;
        this.password = password;
    }

    /**
     * Clear credentials
     */
    clearCredentials() {
        this.email = null;
        this.password = null;
    }

    /**
     * Create Basic Auth header
     * @returns {string} Authorization header value
     */
    getAuthHeader() {
        if (!this.email || !this.password) {
            throw new Error('Credentials not set');
        }
        const credentials = btoa(`${this.email}:${this.password}`);
        return `Basic ${credentials}`;
    }

    /**
     * Make authenticated request to Feedbin API
     * @param {string} endpoint - API endpoint (without base URL)
     * @param {Object} options - Fetch options
     * @returns {Promise<Response>} API response
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.getAuthHeader(),
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                mode: 'cors'
            });

            // Handle authentication errors
            if (response.status === 401) {
                throw new Error('Invalid credentials');
            }

            return response;
        } catch (error) {
            if (error.message === 'Invalid credentials') {
                throw error;
            }
            // Handle CORS errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('CORS error: Feedbin API may not allow direct browser access. A proxy may be required.');
            }
            throw error;
        }
    }

    /**
     * Test authentication
     * @returns {Promise<boolean>} True if authenticated
     */
    async testAuth() {
        try {
            const response = await this.makeRequest('/authentication.json');
            return response.ok;
        } catch (error) {
            console.error('Auth test error:', error);
            return false;
        }
    }

    /**
     * Get Feedbin subscriptions
     * @returns {Promise<Array>} Subscriptions array
     */
    async getSubscriptions() {
        const response = await this.makeRequest('/subscriptions.json');
        if (!response.ok) {
            throw new Error(`Failed to get subscriptions: ${response.statusText}`);
        }
        return await response.json();
    }

    /**
     * Get starred entries
     * @param {number} page - Page number (optional)
     * @returns {Promise<Array>} Starred entries array
     */
    async getStarredEntries(page = null) {
        let endpoint = '/starred_entries.json';
        if (page) {
            endpoint += `?page=${page}`;
        }
        const response = await this.makeRequest(endpoint);
        if (!response.ok) {
            throw new Error(`Failed to get starred entries: ${response.statusText}`);
        }
        return await response.json();
    }

    /**
     * Star an entry
     * @param {number} entryId - Entry ID to star
     * @returns {Promise<boolean>} Success status
     */
    async starEntry(entryId) {
        const response = await this.makeRequest('/starred_entries.json', {
            method: 'POST',
            body: JSON.stringify({ starred_entries: [entryId] })
        });
        return response.ok;
    }

    /**
     * Star multiple entries
     * @param {Array<number>} entryIds - Array of entry IDs
     * @returns {Promise<boolean>} Success status
     */
    async starEntries(entryIds) {
        const response = await this.makeRequest('/starred_entries.json', {
            method: 'POST',
            body: JSON.stringify({ starred_entries: entryIds })
        });
        return response.ok;
    }

    /**
     * Get entry by ID
     * @param {number} entryId - Entry ID
     * @returns {Promise<Object>} Entry object
     */
    async getEntry(entryId) {
        const response = await this.makeRequest(`/entries/${entryId}.json`);
        if (!response.ok) {
            throw new Error(`Failed to get entry: ${response.statusText}`);
        }
        return await response.json();
    }

    /**
     * Search for entries by URL
     * @param {string} url - URL to search for
     * @returns {Promise<Array>} Matching entries
     */
    async searchEntriesByURL(url) {
        // Feedbin API doesn't have direct URL search, so we'll need to search through entries
        // This is a simplified version - in practice, you might need to paginate through entries
        const response = await this.makeRequest(`/entries.json?per_page=100&search=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error(`Failed to search entries: ${response.statusText}`);
        }
        return await response.json();
    }
}

// Export for use in modules
window.FeedbinAPI = FeedbinAPI;

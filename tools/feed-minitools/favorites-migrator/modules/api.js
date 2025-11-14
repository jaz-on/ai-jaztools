/**
 * @module tools/feed-minitools/favorites-migrator/modules/api
 * 
 * Module API Feedbin - Communication directe côté client
 * 
 * Utilise l'authentification Basic Auth pour communiquer directement avec l'API Feedbin.
 */

import { createError, ErrorType } from '../../../../shared/utils/error-handler.js';

/**
 * Classe de gestion de l'API Feedbin
 * 
 * @class
 */
class FeedbinAPI {
    /**
     * Crée une instance de l'API Feedbin
     * 
     * @constructor
     */
    constructor() {
        this.baseURL = 'https://api.feedbin.com/v2';
        this.email = null;
        this.password = null;
    }

    /**
     * Définit les identifiants pour les appels API
     * 
     * @param {string} email - Email Feedbin
     * @param {string} password - Mot de passe Feedbin
     * @returns {void}
     */
    setCredentials(email, password) {
        this.email = email;
        this.password = password;
    }

    /**
     * Efface les identifiants
     * 
     * @returns {void}
     */
    clearCredentials() {
        this.email = null;
        this.password = null;
    }

    /**
     * Crée l'en-tête d'authentification Basic Auth
     * 
     * @returns {string} Valeur de l'en-tête Authorization
     * @throws {Error} Si les identifiants ne sont pas définis
     */
    getAuthHeader() {
        if (!this.email || !this.password) {
            throw new Error('Credentials not set');
        }
        const credentials = btoa(`${this.email}:${this.password}`);
        return `Basic ${credentials}`;
    }

    /**
     * Effectue une requête authentifiée à l'API Feedbin
     * 
     * @param {string} endpoint - Endpoint API (sans l'URL de base)
     * @param {Object} [options] - Options de fetch
     * @returns {Promise<Response>} Réponse de l'API
     * @throws {Error} Si la requête échoue ou si les identifiants sont invalides
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
                const error = createError('Identifiants invalides', ErrorType.API);
                throw error;
            }

            return response;
        } catch (error) {
            if (error.type === ErrorType.API && error.message === 'Identifiants invalides') {
                throw error;
            }
            // Handle CORS errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                const corsError = createError('Erreur CORS: L\'API Feedbin peut ne pas autoriser l\'accès direct depuis le navigateur. Un proxy peut être requis.', ErrorType.NETWORK, error);
                throw corsError;
            }
            // Wrap unknown errors
            if (!error.type) {
                const wrappedError = createError(error.message || 'Erreur inconnue', ErrorType.UNKNOWN, error);
                throw wrappedError;
            }
            throw error;
        }
    }

    /**
     * Teste l'authentification
     * 
     * @returns {Promise<boolean>} True si authentifié
     */
    async testAuth() {
        try {
            const response = await this.makeRequest('/authentication.json');
            return response.ok;
        } catch (error) {
            console.error('Auth test error:', error);
            // Log the error for debugging
            if (error.originalError) {
                console.error('Original error:', error.originalError);
            }
            return false;
        }
    }

    /**
     * Get Feedbin subscriptions
     * @returns {Promise<Array>} Subscriptions array
     */
    async getSubscriptions() {
        try {
            const response = await this.makeRequest('/subscriptions.json');
            if (!response.ok) {
                throw new Error(`Failed to get subscriptions: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting subscriptions:', error);
            throw error;
        }
    }

    /**
     * Get starred entries
     * @param {number} page - Page number (optional)
     * @returns {Promise<Array>} Starred entries array
     */
    async getStarredEntries(page = null) {
        try {
            let endpoint = '/starred_entries.json';
            if (page) {
                endpoint += `?page=${page}`;
            }
            const response = await this.makeRequest(endpoint);
            if (!response.ok) {
                throw new Error(`Failed to get starred entries: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting starred entries:', error);
            throw error;
        }
    }

    /**
     * Star an entry
     * @param {number} entryId - Entry ID to star
     * @returns {Promise<boolean>} Success status
     */
    async starEntry(entryId) {
        try {
            const response = await this.makeRequest('/starred_entries.json', {
                method: 'POST',
                body: JSON.stringify({ starred_entries: [entryId] })
            });
            return response.ok;
        } catch (error) {
            console.error('Error starring entry:', error);
            throw error;
        }
    }

    /**
     * Star multiple entries
     * @param {Array<number>} entryIds - Array of entry IDs
     * @returns {Promise<boolean>} Success status
     */
    async starEntries(entryIds) {
        try {
            const response = await this.makeRequest('/starred_entries.json', {
                method: 'POST',
                body: JSON.stringify({ starred_entries: entryIds })
            });
            return response.ok;
        } catch (error) {
            console.error('Error starring entries:', error);
            throw error;
        }
    }

    /**
     * Get entry by ID
     * @param {number} entryId - Entry ID
     * @returns {Promise<Object>} Entry object
     */
    async getEntry(entryId) {
        try {
            const response = await this.makeRequest(`/entries/${entryId}.json`);
            if (!response.ok) {
                throw new Error(`Failed to get entry: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting entry:', error);
            throw error;
        }
    }

    /**
     * Search for entries by URL
     * @param {string} url - URL to search for
     * @returns {Promise<Array>} Matching entries
     */
    async searchEntriesByURL(url) {
        try {
            // Feedbin API doesn't have direct URL search, so we'll need to search through entries
            // This is a simplified version - in practice, you might need to paginate through entries
            const response = await this.makeRequest(`/entries.json?per_page=100&search=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`Failed to search entries: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error searching entries by URL:', error);
            throw error;
        }
    }
}

// Export for use in modules
window.FeedbinAPI = FeedbinAPI;

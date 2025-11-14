/**
 * URLs to OPML - Main Application
 * Client-side tool to convert website URLs to OPML feed subscriptions
 */

import { validateUrls, processSite } from './modules/feedParser.js';
import { generateOPML, downloadOPML } from './modules/opmlGenerator.js';

class App {
    constructor() {
        this.feedsData = [];
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.urlsTextarea = document.getElementById('urls');
        this.findFeedsBtn = document.getElementById('findFeedsBtn');
        this.findFeedsText = document.getElementById('findFeedsText');
        this.findFeedsLoading = document.getElementById('findFeedsLoading');
        this.downloadOPMLBtn = document.getElementById('downloadOPMLBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.feedsResults = document.getElementById('feedsResults');
        this.feedsList = document.getElementById('feedsList');
    }

    initializeEventListeners() {
        this.findFeedsBtn.addEventListener('click', () => this.findFeeds());
        this.downloadOPMLBtn.addEventListener('click', () => this.downloadOPMLFile());
    }

    async findFeeds() {
        const urlText = this.urlsTextarea.value.trim();
        
        if (!urlText) {
            this.showError('Please enter at least one URL');
            return;
        }

        const urls = validateUrls(urlText);
        
        if (urls.length === 0) {
            this.showError('No valid URLs found. Please check your input.');
            return;
        }

        this.setLoading(true);
        this.hideError();
        this.feedsData = [];
        this.feedsResults.classList.add('hidden');

        try {
            // Process all sites concurrently
            const results = await Promise.all(
                urls.map(url => processSite(url))
            );

            this.feedsData = results;
            this.displayResults(results);
            this.downloadOPMLBtn.disabled = !results.some(site => site.feeds.length > 0);
        } catch (error) {
            console.error('Error finding feeds:', error);
            this.showError('Error processing URLs. Please try again. ' + error.message);
        } finally {
            this.setLoading(false);
        }
    }

    displayResults(results) {
        this.feedsList.innerHTML = '';

        if (results.length === 0) {
            return;
        }

        for (const site of results) {
            const siteDiv = document.createElement('div');
            siteDiv.style.cssText = 'padding: 1rem; border: 1px solid var(--gray-light); border-radius: 4px; margin-bottom: 1rem;';

            const siteUrlDiv = document.createElement('div');
            siteUrlDiv.style.cssText = 'font-weight: 600; margin-bottom: 0.5rem;';
            siteUrlDiv.textContent = site.site_url;
            siteDiv.appendChild(siteUrlDiv);

            if (site.feeds.length > 0) {
                for (const feed of site.feeds) {
                    const feedDiv = document.createElement('div');
                    feedDiv.style.cssText = 'font-size: 0.875rem; color: var(--gray); margin-top: 0.25rem;';
                    feedDiv.textContent = `${feed.type}: ${feed.title || feed.url}`;
                    siteDiv.appendChild(feedDiv);
                }
            } else {
                const noFeedsDiv = document.createElement('div');
                noFeedsDiv.style.cssText = 'font-size: 0.875rem; color: var(--gray); margin-top: 0.25rem;';
                noFeedsDiv.textContent = 'No feeds found';
                siteDiv.appendChild(noFeedsDiv);
            }

            this.feedsList.appendChild(siteDiv);
        }

        this.feedsResults.classList.remove('hidden');
    }

    downloadOPMLFile() {
        if (this.feedsData.length === 0 || !this.feedsData.some(site => site.feeds.length > 0)) {
            this.showError('No feeds to download');
            return;
        }

        const opmlContent = generateOPML(this.feedsData);
        downloadOPML(opmlContent);
    }

    setLoading(loading) {
        this.findFeedsBtn.disabled = loading;
        if (loading) {
            this.findFeedsText.classList.add('hidden');
            this.findFeedsLoading.classList.remove('hidden');
        } else {
            this.findFeedsText.classList.remove('hidden');
            this.findFeedsLoading.classList.add('hidden');
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});


/**
 * @module tools/feed-minitools/urls-to-opml/app
 * 
 * URLs to OPML - Main Application
 * 
 * Application cliente pour convertir des URLs de sites web en abonnements OPML
 * en détectant automatiquement leurs flux RSS/Atom.
 */

import { validateUrls, processSite } from './modules/feedParser.js';
import { generateOPML, downloadOPML } from './modules/opmlGenerator.js';
import { showError, showSuccess } from '../../../shared/utils/messages.js';

// Helper function to get shared components
function getSharedComponent(name) {
    if (window.SharedComponents && window.SharedComponents[name]) {
        return window.SharedComponents[name];
    }
    console.warn(`Shared component ${name} not available yet`);
    return null;
}

/**
 * Classe principale de l'application URLs to OPML
 * 
 * @class
 */
class App {
    /**
     * Crée une instance de l'application
     * 
     * @constructor
     */
    constructor() {
        this.feedsData = [];
        this.initializeUI();
        this.initializeElements();
        this.initializeEventListeners();
    }

    /**
     * Initialise l'UI avec les composants partagés
     * 
     * @returns {void}
     */
    initializeUI() {
        // Create Header
        const Header = getSharedComponent('Header');
        const headerContainer = document.getElementById('header-container');
        if (Header && headerContainer) {
            const header = Header({
                title: 'URLs to OPML',
                subtitle: 'Convert website URLs to OPML feed subscriptions'
            });
            header.style.cssText = 'text-align: center; margin-bottom: 2rem;';
            headerContainer.appendChild(header);
        }

        // Create Card with form
        const Card = getSharedComponent('Card');
        const FormGroup = getSharedComponent('FormGroup');
        const FormLabel = getSharedComponent('FormLabel');
        const FormInput = getSharedComponent('FormInput');
        const FormError = getSharedComponent('FormError');
        const Button = getSharedComponent('Button');
        const cardContainer = document.getElementById('card-container');
        
        if (Card && cardContainer) {
            const card = Card({ children: [] });
            card.style.cssText = 'padding: 2rem;';
            
            // Create form
            const form = document.createElement('form');
            form.setAttribute('role', 'form');
            form.setAttribute('aria-label', 'URLs to OPML converter');
            
            // Create textarea group
            const textareaGroup = FormGroup ? FormGroup({ children: [] }) : document.createElement('div');
            textareaGroup.style.cssText = 'margin-bottom: 1.5rem;';
            
            // Label
            const label = FormLabel ? FormLabel({ 
                htmlFor: 'urls', 
                children: 'Enter website URLs (one per line):' 
            }) : document.createElement('label');
            if (!FormLabel) {
                label.setAttribute('for', 'urls');
                label.textContent = 'Enter website URLs (one per line):';
                label.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;';
            }
            textareaGroup.appendChild(label);
            
            // Instructions
            const instructions = document.createElement('div');
            instructions.id = 'urls-instructions';
            instructions.style.cssText = 'font-size: 0.875rem; color: var(--gray); margin-bottom: 0.5rem;';
            instructions.innerHTML = 'Example:<br>https://example.com<br>https://another-site.com';
            textareaGroup.appendChild(instructions);
            
            // Textarea (using native element as FormInput doesn't support textarea)
            const textarea = document.createElement('textarea');
            textarea.id = 'urls';
            textarea.name = 'urls';
            textarea.style.cssText = 'width: 100%; min-height: 120px; padding: 0.75rem; border: 1px solid var(--gray-light); border-radius: 4px; font-family: inherit;';
            textarea.placeholder = 'https://example.com\nhttps://another-site.com';
            textarea.setAttribute('aria-describedby', 'urls-instructions urls-error');
            textarea.setAttribute('aria-invalid', 'false');
            textarea.setAttribute('aria-required', 'false');
            textareaGroup.appendChild(textarea);
            
            // Error message
            const errorSpan = FormError ? FormError({ children: '' }) : document.createElement('span');
            errorSpan.id = 'urls-error';
            errorSpan.className = 'error-message hidden';
            errorSpan.setAttribute('role', 'alert');
            errorSpan.setAttribute('aria-live', 'polite');
            if (!FormError) {
                errorSpan.style.cssText = 'display: block; margin-top: 0.5rem; color: var(--error);';
            }
            textareaGroup.appendChild(errorSpan);
            
            form.appendChild(textareaGroup);
            
            // Buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.cssText = 'display: flex; gap: 1rem; margin-bottom: 1.5rem;';
            
            // Find Feeds button
            const findFeedsBtn = Button ? Button({
                variant: 'primary',
                children: 'Find Feeds',
                onClick: () => this.findFeeds(),
                ariaLabel: 'Rechercher les flux RSS pour les URLs saisies'
            }) : document.createElement('button');
            if (!Button) {
                findFeedsBtn.id = 'findFeedsBtn';
                findFeedsBtn.type = 'button';
                findFeedsBtn.className = 'btn-base btn-primary';
                findFeedsBtn.textContent = 'Find Feeds';
                findFeedsBtn.addEventListener('click', () => this.findFeeds());
            }
            findFeedsBtn.style.cssText = 'flex: 0 0 auto;';
            buttonsContainer.appendChild(findFeedsBtn);
            
            // Download button
            const downloadBtn = Button ? Button({
                variant: 'secondary',
                children: 'Download OPML',
                onClick: () => this.downloadOPMLFile(),
                disabled: true,
                ariaLabel: 'Télécharger le fichier OPML généré'
            }) : document.createElement('button');
            if (!Button) {
                downloadBtn.id = 'downloadOPMLBtn';
                downloadBtn.type = 'button';
                downloadBtn.className = 'btn-base btn-secondary';
                downloadBtn.textContent = 'Download OPML';
                downloadBtn.disabled = true;
                downloadBtn.addEventListener('click', () => this.downloadOPMLFile());
            }
            downloadBtn.style.cssText = 'flex: 0 0 auto;';
            buttonsContainer.appendChild(downloadBtn);
            
            form.appendChild(buttonsContainer);
            
            // Results container
            const resultsDiv = document.createElement('div');
            resultsDiv.id = 'feedsResults';
            resultsDiv.className = 'hidden';
            resultsDiv.setAttribute('role', 'region');
            resultsDiv.setAttribute('aria-labelledby', 'feeds-results-title');
            resultsDiv.setAttribute('aria-live', 'polite');
            
            const resultsTitle = document.createElement('h3');
            resultsTitle.id = 'feeds-results-title';
            resultsTitle.style.cssText = 'margin-bottom: 1rem;';
            resultsTitle.textContent = 'Found Feeds:';
            resultsDiv.appendChild(resultsTitle);
            
            const feedsList = document.createElement('div');
            feedsList.id = 'feedsList';
            feedsList.setAttribute('role', 'list');
            resultsDiv.appendChild(feedsList);
            
            form.appendChild(resultsDiv);
            card.appendChild(form);
            cardContainer.appendChild(card);
        }
        
        // Create Footer
        const Footer = getSharedComponent('Footer');
        const footerContainer = document.getElementById('footer-container');
        if (Footer && footerContainer) {
            const footer = Footer({
                children: 'All processing happens in your browser. No data is sent to any server.'
            });
            footer.style.cssText = 'text-align: center; margin-top: 2rem; padding: 1rem; color: var(--gray); font-size: 0.875rem;';
            footerContainer.appendChild(footer);
        }
    }

    /**
     * Initialise les références aux éléments DOM
     * 
     * @returns {void}
     */
    initializeElements() {
        this.urlsTextarea = document.getElementById('urls');
        this.findFeedsBtn = document.querySelector('#card-container button:first-of-type') || document.getElementById('findFeedsBtn');
        this.findFeedsText = this.findFeedsBtn ? this.findFeedsBtn.querySelector('span') || this.findFeedsBtn : null;
        this.findFeedsLoading = null; // Will be handled differently with components
        this.downloadOPMLBtn = document.querySelector('#card-container button:last-of-type') || document.getElementById('downloadOPMLBtn');
        this.errorMessage = document.getElementById('error-message-container');
        this.successMessage = document.getElementById('success-message-container');
        this.feedsResults = document.getElementById('feedsResults');
        this.feedsList = document.getElementById('feedsList');
    }

    /**
     * Initialise les écouteurs d'événements
     * 
     * @returns {void}
     */
    initializeEventListeners() {
        this.findFeedsBtn.addEventListener('click', () => this.findFeeds());
        this.downloadOPMLBtn.addEventListener('click', () => this.downloadOPMLFile());
    }

    /**
     * Recherche les flux RSS/Atom pour les URLs saisies
     * 
     * @returns {Promise<void>}
     */
    async findFeeds() {
        const urlText = this.urlsTextarea.value.trim();
        
        if (!urlText) {
            this.showFieldError('Veuillez entrer au moins une URL');
            return;
        }

        const urls = validateUrls(urlText);
        
        if (urls.length === 0) {
            this.showFieldError('Aucune URL valide trouvée. Veuillez vérifier votre saisie.');
            return;
        }
        
        this.clearFieldError();

        this.setLoading(true);
        this.hideError();
        this.clearFieldError();
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
            
            // Afficher un message de succès si des flux ont été trouvés
            const totalFeeds = results.reduce((sum, site) => sum + site.feeds.length, 0);
            if (totalFeeds > 0) {
                const Message = getSharedComponent('Message');
                if (Message && this.successMessage) {
                    this.successMessage.innerHTML = '';
                    const messageEl = Message({
                        type: 'success',
                        children: `${totalFeeds} flux trouvé${totalFeeds > 1 ? 's' : ''} pour ${results.length} site${results.length > 1 ? 's' : ''}`
                    });
                    this.successMessage.appendChild(messageEl);
                } else if (this.successMessage) {
                    showSuccess(`${totalFeeds} flux trouvé${totalFeeds > 1 ? 's' : ''} pour ${results.length} site${results.length > 1 ? 's' : ''}`, this.successMessage);
                }
            }
        } catch (error) {
            const Message = getSharedComponent('Message');
            if (Message && this.errorMessage) {
                this.errorMessage.innerHTML = '';
                const messageEl = Message({
                    type: 'error',
                    children: 'Erreur lors du traitement des URLs. Veuillez réessayer.'
                });
                this.errorMessage.appendChild(messageEl);
            } else if (this.errorMessage) {
                showError('Erreur lors du traitement des URLs. Veuillez réessayer.', this.errorMessage);
            }
            this.showFieldError('Erreur lors du traitement. Veuillez réessayer.');
        } finally {
            this.setLoading(false);
        }
    }
    
    /**
     * Affiche une erreur de champ avec support d'accessibilité
     * 
     * @param {string} message - Message d'erreur
     * @returns {void}
     */
    showFieldError(message) {
        const errorElement = document.getElementById('urls-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        this.urlsTextarea.setAttribute('aria-invalid', 'true');
        this.urlsTextarea.classList.add('input-error');
        this.urlsTextarea.focus();
    }
    
    /**
     * Efface l'erreur de champ
     * 
     * @returns {void}
     */
    clearFieldError() {
        const errorElement = document.getElementById('urls-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
        this.urlsTextarea.setAttribute('aria-invalid', 'false');
        this.urlsTextarea.classList.remove('input-error');
    }

    /**
     * Affiche les résultats de la recherche de flux
     * 
     * @param {Array<Object>} results - Résultats de la recherche de flux
     * @returns {void}
     */
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

    /**
     * Télécharge le fichier OPML généré
     * 
     * @returns {void}
     */
    downloadOPMLFile() {
        if (this.feedsData.length === 0 || !this.feedsData.some(site => site.feeds.length > 0)) {
            const Message = getSharedComponent('Message');
            if (Message && this.errorMessage) {
                this.errorMessage.innerHTML = '';
                const messageEl = Message({
                    type: 'error',
                    children: 'Aucun flux à télécharger'
                });
                this.errorMessage.appendChild(messageEl);
            } else if (this.errorMessage) {
                showError('Aucun flux à télécharger', this.errorMessage);
            }
            return;
        }

        const opmlContent = generateOPML(this.feedsData);
        downloadOPML(opmlContent);
        
        const Message = getSharedComponent('Message');
        if (Message && this.successMessage) {
            this.successMessage.innerHTML = '';
            const messageEl = Message({
                type: 'success',
                children: 'Fichier OPML téléchargé avec succès'
            });
            this.successMessage.appendChild(messageEl);
        } else if (this.successMessage) {
            showSuccess('Fichier OPML téléchargé avec succès', this.successMessage);
        }
    }

    /**
     * Définit l'état de chargement de l'interface
     * 
     * @param {boolean} loading - État de chargement
     * @returns {void}
     */
    setLoading(loading) {
        if (this.findFeedsBtn) {
            this.findFeedsBtn.disabled = loading;
            if (loading) {
                this.findFeedsBtn.setAttribute('aria-busy', 'true');
                if (this.findFeedsText) {
                    this.findFeedsText.textContent = 'Searching...';
                } else {
                    this.findFeedsBtn.textContent = 'Searching...';
                }
            } else {
                this.findFeedsBtn.setAttribute('aria-busy', 'false');
                if (this.findFeedsText) {
                    this.findFeedsText.textContent = 'Find Feeds';
                } else {
                    this.findFeedsBtn.textContent = 'Find Feeds';
                }
            }
        }
    }

    /**
     * Masque les messages d'erreur et de succès
     * 
     * @returns {void}
     */
    hideError() {
        if (this.errorMessage) {
            this.errorMessage.innerHTML = '';
        }
        if (this.successMessage) {
            this.successMessage.innerHTML = '';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for shared components to load
    setTimeout(() => {
        new App();
    }, 100);
});


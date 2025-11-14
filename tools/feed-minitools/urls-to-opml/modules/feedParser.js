/**
 * @module tools/feed-minitools/urls-to-opml/modules/feedParser
 * 
 * Module de parsing de flux RSS/Atom
 * 
 * Détecte et parse les flux RSS/Atom depuis des URLs de sites web.
 */

/**
 * Vérifie si une URL est un flux RSS/Atom valide
 * 
 * @param {string} url - URL du flux à vérifier
 * @returns {Promise<Object|null>} Informations du flux ou null si invalide
 */
export async function checkFeed(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
            }
        });

        if (!response.ok) {
            return null;
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            return null;
        }

        // Check if it's RSS
        const rssElement = xmlDoc.querySelector('rss');
        if (rssElement) {
            const titleElement = xmlDoc.querySelector('channel > title');
            return {
                type: 'RSS',
                url: url,
                title: titleElement ? titleElement.textContent.trim() : null
            };
        }

        // Check if it's Atom
        const atomElement = xmlDoc.querySelector('feed');
        if (atomElement) {
            const titleElement = xmlDoc.querySelector('feed > title');
            return {
                type: 'Atom',
                url: url,
                title: titleElement ? titleElement.textContent.trim() : null
            };
        }

        return null;
    } catch (error) {
        console.error(`Error checking feed ${url}:`, error);
        return null;
    }
}

/**
 * Trouve les URLs de flux potentielles dans le contenu HTML
 * 
 * @param {string} baseUrl - URL de base du site web
 * @param {string} htmlContent - Contenu HTML à parser
 * @returns {Array<string>} Tableau d'URLs de flux potentielles
 */
export function findFeedsInHTML(baseUrl, htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const potentialFeeds = [];

    // Look for feed links in <link> tags
    const feedLinks = doc.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"], link[type="application/xml"], link[type="text/xml"]');
    feedLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            try {
                const fullUrl = new URL(href, baseUrl).href;
                potentialFeeds.push(fullUrl);
            } catch (e) {
                // Invalid URL, skip
            }
        }
    });

    // Look for common feed URLs
    const commonPaths = [
        '/feed',
        '/rss',
        '/feed.xml',
        '/atom.xml',
        '/rss.xml',
        '/index.xml',
        '/feeds/all.atom.xml',
        '/feeds/all.rss.xml'
    ];

    commonPaths.forEach(path => {
        try {
            const feedUrl = new URL(path, baseUrl).href;
            potentialFeeds.push(feedUrl);
        } catch (e) {
            // Invalid URL, skip
        }
    });

    // Remove duplicates
    return [...new Set(potentialFeeds)];
}

/**
 * Traite un site unique pour trouver ses flux
 * 
 * @param {string} url - URL du site web à traiter
 * @returns {Promise<Object>} Informations sur les flux du site avec site_url et feeds
 */
export async function processSite(url) {
    try {
        // Normalize URL
        let normalizedUrl = url.trim();
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
            normalizedUrl = 'https://' + normalizedUrl;
        }

        // Fetch the website
        const response = await fetch(normalizedUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });

        if (!response.ok) {
            return {
                site_url: normalizedUrl,
                feeds: []
            };
        }

        const htmlContent = await response.text();
        const potentialFeeds = findFeedsInHTML(normalizedUrl, htmlContent);

        // Check each potential feed URL
        const feedChecks = await Promise.all(
            potentialFeeds.map(feedUrl => checkFeed(feedUrl))
        );

        const validFeeds = feedChecks.filter(feed => feed !== null);

        return {
            site_url: normalizedUrl,
            feeds: validFeeds
        };
    } catch (error) {
        console.error(`Error processing site ${url}:`, error);
        return {
            site_url: url,
            feeds: []
        };
    }
}

/**
 * Valide et normalise une liste d'URLs
 * 
 * @param {string} urlText - Texte contenant des URLs (une par ligne)
 * @returns {Array<string>} Tableau d'URLs valides
 */
export function validateUrls(urlText) {
    const lines = urlText.split('\n');
    const validUrls = [];

    for (const line of lines) {
        const url = line.trim();
        if (!url) continue;

        let normalizedUrl = url;
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
            normalizedUrl = 'https://' + normalizedUrl;
        }

        try {
            const urlObj = new URL(normalizedUrl);
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
                validUrls.push(normalizedUrl);
            }
        } catch (e) {
            // Invalid URL, skip
            console.warn(`Invalid URL: ${url}`);
        }
    }

    return validUrls;
}


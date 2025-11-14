/**
 * Feed Parser Module - Client-side RSS/Atom feed detection and parsing
 */

/**
 * Check if a URL is a valid RSS/Atom feed
 * @param {string} url - Feed URL to check
 * @returns {Promise<Object|null>} Feed info or null if invalid
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
 * Find potential feed URLs in HTML content
 * @param {string} baseUrl - Base URL of the website
 * @param {string} htmlContent - HTML content to parse
 * @returns {Array<string>} Array of potential feed URLs
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
 * Process a single site to find its feeds
 * @param {string} url - Website URL to process
 * @returns {Promise<Object>} Site feeds information
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
 * Validate and normalize a list of URLs
 * @param {string} urlText - Text containing URLs (one per line)
 * @returns {Array<string>} Array of valid URLs
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


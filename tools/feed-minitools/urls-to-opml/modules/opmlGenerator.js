/**
 * OPML Generator Module - Generate OPML files from feed data
 */

/**
 * Generate OPML content from feeds data
 * @param {Array<Object>} feedsData - Array of site feeds objects
 * @returns {string} OPML XML content
 */
export function generateOPML(feedsData) {
    const dateCreated = new Date().toISOString();
    
    let outlines = '';
    
    for (const site of feedsData) {
        for (const feed of site.feeds) {
            const title = feed.title || site.site_url;
            const text = escapeXML(title);
            const xmlUrl = escapeXML(feed.url);
            const htmlUrl = escapeXML(site.site_url);
            
            outlines += `    <outline type="rss" text="${text}" xmlUrl="${xmlUrl}" htmlUrl="${htmlUrl}"/>\n`;
        }
    }
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>URLs to OPML Feed Subscriptions</title>
    <dateCreated>${dateCreated}</dateCreated>
  </head>
  <body>
${outlines}  </body>
</opml>`;
}

/**
 * Escape XML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Download OPML file
 * @param {string} opmlContent - OPML XML content
 * @param {string} filename - Filename for download (default: 'feeds.opml')
 */
export function downloadOPML(opmlContent, filename = 'feeds.opml') {
    const blob = new Blob([opmlContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


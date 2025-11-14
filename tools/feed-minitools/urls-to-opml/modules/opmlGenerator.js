/**
 * @module tools/feed-minitools/urls-to-opml/modules/opmlGenerator
 * 
 * Module de génération OPML
 * 
 * Génère des fichiers OPML à partir des données de flux.
 */

/**
 * Génère le contenu OPML à partir des données de flux
 * 
 * @param {Array<Object>} feedsData - Tableau d'objets contenant les flux des sites
 * @param {string} feedsData[].site_url - URL du site
 * @param {Array<Object>} feedsData[].feeds - Tableau de flux avec url et title
 * @returns {string} Contenu XML OPML
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
 * Échappe les caractères spéciaux XML
 * 
 * @param {string} str - Chaîne à échapper
 * @returns {string} Chaîne échappée
 * @private
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
 * Télécharge un fichier OPML
 * 
 * @param {string} opmlContent - Contenu XML OPML
 * @param {string} [filename='feeds.opml'] - Nom du fichier pour le téléchargement
 * @returns {void}
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


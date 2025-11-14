#!/usr/bin/env node
/**
 * Script pour générer automatiquement des favicons SVG pour chaque outil
 * Usage: node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');

// Configuration des couleurs depuis le design system
const COLORS = {
    primary: '#2c5aa0',      // --blue
    primaryDark: '#1e3f6b',   // --blue-dark
    primaryLight: '#4a7bc8', // --blue-light
    white: '#fff',
    dark: '#000',
    gray: '#6b7280',
};

// Configuration des outils
// Si displayName n'est pas spécifié, le nom complet formaté sera utilisé
const TOOLS = [
    { name: 'feed-minitools', displayName: 'Feed Minitools', color: COLORS.primary },
    { name: 'favorites-migrator', displayName: 'Favorites Migrator', color: COLORS.primary },
    { name: 'subscription-organizer', displayName: 'Subscription Organizer', color: COLORS.primary },
    { name: 'urls-to-opml', displayName: 'URLs to OPML', color: COLORS.primary },
    { name: 'instafed', displayName: 'InstaFed', color: COLORS.primary },
];

/**
 * Génère automatiquement un displayName à partir du nom de l'outil
 * Formate le nom : remplace les tirets par des espaces et capitalise
 */
function generateDisplayName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Génère un SVG favicon avec texte
 * Ajuste automatiquement la taille de police selon la longueur du texte
 */
function generateSVGFavicon(tool) {
    const { displayName, color } = tool;
    const size = 64; // Taille plus grande pour accommoder plus de texte
    const textLength = displayName.length;
    
    // Ajustement dynamique de la taille de police selon la longueur
    let fontSize;
    if (textLength <= 3) {
        fontSize = 20;
    } else if (textLength <= 6) {
        fontSize = 16;
    } else if (textLength <= 10) {
        fontSize = 12;
    } else if (textLength <= 15) {
        fontSize = 10;
    } else {
        fontSize = 8;
    }
    
    const fontWeight = 'bold';
    const lineHeight = fontSize * 1.2;
    
    // Calcul de la position du texte pour centrage
    const textX = size / 2;
    const textY = size / 2;
    
    // Si le texte est trop long, on peut le diviser en plusieurs lignes
    const words = displayName.split(' ');
    let textElements = '';
    
    if (words.length > 1 && textLength > 8) {
        // Texte sur plusieurs lignes pour les noms longs
        const midPoint = Math.ceil(words.length / 2);
        const line1 = words.slice(0, midPoint).join(' ');
        const line2 = words.slice(midPoint).join(' ');
        
        textElements = `
    <text 
      x="${textX}" 
      y="${textY - lineHeight / 4}" 
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      font-size="${fontSize}"
      font-weight="${fontWeight}"
      fill="${COLORS.white}"
      text-anchor="middle"
      dominant-baseline="middle"
      letter-spacing="0.3px"
    >${line1}</text>
    <text 
      x="${textX}" 
      y="${textY + lineHeight / 2}" 
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      font-size="${fontSize}"
      font-weight="${fontWeight}"
      fill="${COLORS.white}"
      text-anchor="middle"
      dominant-baseline="middle"
      letter-spacing="0.3px"
    >${line2}</text>`;
    } else {
        // Texte sur une seule ligne
        textElements = `
    <text 
      x="${textX}" 
      y="${textY}" 
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      font-size="${fontSize}"
      font-weight="${fontWeight}"
      fill="${COLORS.white}"
      text-anchor="middle"
      dominant-baseline="middle"
      letter-spacing="0.3px"
    >${displayName}</text>`;
    }
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background avec coins arrondis -->
  <rect width="${size}" height="${size}" rx="8" ry="8" fill="${color}"/>
  ${textElements}
</svg>`;
}

/**
 * Génère tous les favicons
 */
function generateAllFavicons() {
    const toolsDir = path.join(__dirname, '..', 'tools');
    const sharedAssetsDir = path.join(__dirname, '..', 'shared', 'assets');
    
    console.log('🎨 Génération des favicons SVG...\n');
    
    // Générer le favicon principal
    const mainFavicon = generateSVGFavicon({ displayName: 'AI JazTools', color: COLORS.primary });
    const mainFaviconPath = path.join(sharedAssetsDir, 'favicon.svg');
    fs.writeFileSync(mainFaviconPath, mainFavicon);
    console.log(`✓ Généré: ${mainFaviconPath}`);
    
    // Générer les favicons pour chaque outil
    TOOLS.forEach(tool => {
        // Utiliser displayName si fourni, sinon générer automatiquement
        const finalDisplayName = tool.displayName || generateDisplayName(tool.name);
        const toolWithDisplayName = { ...tool, displayName: finalDisplayName };
        
        const svg = generateSVGFavicon(toolWithDisplayName);
        
        // Déterminer le chemin de destination
        let destPath;
        if (tool.name === 'feed-minitools') {
            destPath = path.join(toolsDir, tool.name, 'favicon.svg');
        } else if (['favorites-migrator', 'subscription-organizer', 'urls-to-opml'].includes(tool.name)) {
            destPath = path.join(toolsDir, 'feed-minitools', tool.name, 'favicon.svg');
        } else {
            destPath = path.join(toolsDir, tool.name, 'favicon.svg');
        }
        
        // Créer le dossier si nécessaire
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(destPath, svg);
        console.log(`✓ Généré: ${destPath} (${finalDisplayName})`);
    });
    
    console.log('\n✨ Tous les favicons ont été générés avec succès!');
}

// Exécuter le script
if (require.main === module) {
    generateAllFavicons();
}

module.exports = { generateSVGFavicon, generateAllFavicons };


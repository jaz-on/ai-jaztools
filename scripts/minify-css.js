#!/usr/bin/env node
/**
 * Script de minification CSS simple
 * Supprime les commentaires, espaces inutiles et compacte le code
 */

const fs = require('fs');
const path = require('path');

function minifyCSS(css) {
    let minified = css;
    
    // Supprimer les commentaires (sauf ceux qui commencent par /*! pour les licences)
    minified = minified.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '');
    
    // Supprimer les espaces avant et après certains caractères
    minified = minified.replace(/\s*{\s*/g, '{');
    minified = minified.replace(/\s*}\s*/g, '}');
    minified = minified.replace(/\s*:\s*/g, ':');
    minified = minified.replace(/\s*;\s*/g, ';');
    minified = minified.replace(/\s*,\s*/g, ',');
    minified = minified.replace(/\s*>\s*/g, '>');
    minified = minified.replace(/\s*\+\s*/g, '+');
    minified = minified.replace(/\s*~\s*/g, '~');
    
    // Supprimer les espaces multiples
    minified = minified.replace(/\s+/g, ' ');
    
    // Supprimer les espaces avant et après les sélecteurs
    minified = minified.replace(/\s*{\s*/g, '{');
    minified = minified.replace(/\s*}\s*/g, '}');
    
    // Supprimer les espaces en début et fin de ligne (maintenant qu'on a tout sur une ligne)
    minified = minified.trim();
    
    // Supprimer les espaces avant les media queries et autres @rules
    minified = minified.replace(/\s*@/g, '@');
    
    return minified;
}

function processFile(inputPath, outputPath) {
    try {
        const css = fs.readFileSync(inputPath, 'utf8');
        const minified = minifyCSS(css);
        fs.writeFileSync(outputPath, minified, 'utf8');
        
        const originalSize = fs.statSync(inputPath).size;
        const minifiedSize = Buffer.byteLength(minified, 'utf8');
        const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
        
        console.log(`✓ ${path.basename(inputPath)}: ${originalSize}B → ${minifiedSize}B (${reduction}% réduction)`);
        return { originalSize, minifiedSize, reduction };
    } catch (error) {
        console.error(`✗ Erreur lors du traitement de ${inputPath}:`, error.message);
        return null;
    }
}

function main() {
    const designSystemDir = path.join(__dirname, '..', 'shared', 'design-system');
    const cssFiles = [
        'variables.css',
        'base.css',
        'components.css',
        'utilities.css'
    ];
    
    console.log('Minification des fichiers CSS du Design System...\n');
    
    let totalOriginal = 0;
    let totalMinified = 0;
    
    cssFiles.forEach(file => {
        const inputPath = path.join(designSystemDir, file);
        const outputPath = path.join(designSystemDir, file.replace('.css', '.min.css'));
        
        if (!fs.existsSync(inputPath)) {
            console.error(`✗ Fichier non trouvé: ${inputPath}`);
            return;
        }
        
        const result = processFile(inputPath, outputPath);
        if (result) {
            totalOriginal += result.originalSize;
            totalMinified += result.minifiedSize;
        }
    });
    
    if (totalOriginal > 0) {
        const totalReduction = ((1 - totalMinified / totalOriginal) * 100).toFixed(1);
        console.log(`\nTotal: ${totalOriginal}B → ${totalMinified}B (${totalReduction}% réduction)`);
    }
    
    console.log('\n✓ Minification terminée!');
}

if (require.main === module) {
    main();
}

module.exports = { minifyCSS, processFile };


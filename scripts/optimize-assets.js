#!/usr/bin/env node
/**
 * Script d'optimisation des assets du monorepo
 * 
 * Optimise les SVG et génère des rapports de taille pour tous les assets
 */

const fs = require('fs');
const path = require('path');
const { minifyCSS } = require('./minify-css');

/**
 * Optimise un fichier SVG en supprimant commentaires et espaces
 */
function optimizeSVG(svgContent) {
    let optimized = svgContent;
    
    // Supprimer les commentaires XML
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
    
    // Supprimer la déclaration XML si présente (optionnel)
    optimized = optimized.replace(/<\?xml[^>]*\?>\s*/g, '');
    
    // Supprimer les espaces multiples
    optimized = optimized.replace(/\s+/g, ' ');
    
    // Supprimer les espaces autour des balises
    optimized = optimized.replace(/\s*</g, '<');
    optimized = optimized.replace(/>\s*/g, '>');
    
    // Supprimer les espaces avant les attributs
    optimized = optimized.replace(/\s+([a-z-]+=)/gi, ' $1');
    
    // Optimiser les valeurs numériques (0.3 -> .3, mais garder les coordonnées)
    optimized = optimized.replace(/([^0-9])0\.([0-9])/g, '$1.$2');
    
    // Supprimer les espaces en début et fin
    optimized = optimized.trim();
    
    return optimized;
}

/**
 * Traite un fichier SVG
 */
function processSVG(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const optimized = optimizeSVG(content);
        const originalSize = fs.statSync(filePath).size;
        const optimizedSize = Buffer.byteLength(optimized, 'utf8');
        
        if (optimizedSize < originalSize) {
            fs.writeFileSync(filePath, optimized, 'utf8');
            const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
            return {
                path: filePath,
                originalSize,
                optimizedSize,
                reduction: parseFloat(reduction),
                optimized: true
            };
        }
        
        return {
            path: filePath,
            originalSize,
            optimizedSize: originalSize,
            reduction: 0,
            optimized: false
        };
    } catch (error) {
        console.error(`✗ Erreur lors du traitement de ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Trouve tous les fichiers SVG dans le projet
 */
function findSVGFiles(rootDir) {
    const svgFiles = [];
    
    function walkDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            // Ignorer node_modules et autres dossiers à ignorer
            if (entry.isDirectory()) {
                if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
                    walkDir(fullPath);
                }
            } else if (entry.isFile() && entry.name.endsWith('.svg')) {
                svgFiles.push(fullPath);
            }
        }
    }
    
    walkDir(rootDir);
    return svgFiles;
}

/**
 * Génère un rapport de taille pour un fichier
 */
function getFileReport(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return {
            path: filePath,
            size: stats.size,
            exists: true
        };
    } catch (error) {
        return {
            path: filePath,
            size: 0,
            exists: false
        };
    }
}

/**
 * Génère un rapport complet des assets
 */
function generateAssetReport(rootDir) {
    const report = {
        svg: [],
        css: [],
        js: [],
        ico: [],
        total: {
            svg: 0,
            css: 0,
            js: 0,
            ico: 0
        }
    };
    
    // SVG
    const svgFiles = findSVGFiles(rootDir);
    svgFiles.forEach(file => {
        const fileReport = getFileReport(file);
        if (fileReport.exists) {
            report.svg.push(fileReport);
            report.total.svg += fileReport.size;
        }
    });
    
    // CSS Design System
    const cssDir = path.join(rootDir, 'shared', 'design-system');
    const cssFiles = ['variables.css', 'base.css', 'components.css', 'utilities.css'];
    cssFiles.forEach(file => {
        const filePath = path.join(cssDir, file);
        const minPath = path.join(cssDir, file.replace('.css', '.min.css'));
        const original = getFileReport(filePath);
        const minified = getFileReport(minPath);
        
        if (original.exists) {
            report.css.push({
                file: file,
                original: original.size,
                minified: minified.exists ? minified.size : null,
                reduction: minified.exists ? ((1 - minified.size / original.size) * 100).toFixed(1) : null
            });
            report.total.css += original.size;
        }
    });
    
    // JavaScript Utils
    const jsDir = path.join(rootDir, 'shared', 'utils');
    if (fs.existsSync(jsDir)) {
        const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
        jsFiles.forEach(file => {
            const filePath = path.join(jsDir, file);
            const fileReport = getFileReport(filePath);
            if (fileReport.exists) {
                report.js.push(fileReport);
                report.total.js += fileReport.size;
            }
        });
    }
    
    // ICO
    const icoPath = path.join(rootDir, 'shared', 'assets', 'favicon.ico');
    const icoReport = getFileReport(icoPath);
    if (icoReport.exists) {
        report.ico.push(icoReport);
        report.total.ico += icoReport.size;
    }
    
    return report;
}

/**
 * Affiche le rapport
 */
function printReport(report) {
    console.log('\n=== RAPPORT D\'OPTIMISATION DES ASSETS ===\n');
    
    // SVG
    if (report.svg.length > 0) {
        console.log('📄 SVG Files:');
        report.svg.forEach(file => {
            const relPath = path.relative(process.cwd(), file.path);
            console.log(`  ${relPath}: ${file.size}B`);
        });
        console.log(`  Total SVG: ${report.total.svg}B\n`);
    }
    
    // CSS
    if (report.css.length > 0) {
        console.log('🎨 CSS Files:');
        report.css.forEach(file => {
            let line = `  ${file.file}: ${file.original}B`;
            if (file.minified) {
                line += ` → ${file.minified}B (${file.reduction}% réduction)`;
            }
            console.log(line);
        });
        console.log(`  Total CSS: ${report.total.css}B\n`);
    }
    
    // JavaScript
    if (report.js.length > 0) {
        console.log('📜 JavaScript Files:');
        report.js.forEach(file => {
            const relPath = path.relative(process.cwd(), file.path);
            console.log(`  ${relPath}: ${file.size}B`);
        });
        console.log(`  Total JS: ${report.total.js}B\n`);
    }
    
    // ICO
    if (report.ico.length > 0) {
        console.log('🖼️  ICO Files:');
        report.ico.forEach(file => {
            const relPath = path.relative(process.cwd(), file.path);
            console.log(`  ${relPath}: ${file.size}B`);
        });
        console.log(`  Total ICO: ${report.total.ico}B\n`);
    }
    
    const grandTotal = report.total.svg + report.total.css + report.total.js + report.total.ico;
    console.log(`📊 GRAND TOTAL: ${grandTotal}B (${(grandTotal / 1024).toFixed(2)}KB)`);
}

/**
 * Fonction principale
 */
function main() {
    const args = process.argv.slice(2);
    const rootDir = process.cwd();
    
    if (args.includes('--optimize-svg')) {
        console.log('Optimisation des fichiers SVG...\n');
        const svgFiles = findSVGFiles(rootDir);
        let totalOriginal = 0;
        let totalOptimized = 0;
        
        svgFiles.forEach(file => {
            const result = processSVG(file);
            if (result) {
                const relPath = path.relative(rootDir, result.path);
                if (result.optimized) {
                    console.log(`✓ ${relPath}: ${result.originalSize}B → ${result.optimizedSize}B (${result.reduction}% réduction)`);
                } else {
                    console.log(`- ${relPath}: ${result.originalSize}B (déjà optimisé)`);
                }
                totalOriginal += result.originalSize;
                totalOptimized += result.optimizedSize;
            }
        });
        
        if (totalOriginal > 0) {
            const totalReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
            console.log(`\nTotal: ${totalOriginal}B → ${totalOptimized}B (${totalReduction}% réduction)`);
        }
    } else if (args.includes('--report')) {
        const report = generateAssetReport(rootDir);
        printReport(report);
    } else {
        console.log('Usage:');
        console.log('  node optimize-assets.js --optimize-svg  # Optimise tous les SVG');
        console.log('  node optimize-assets.js --report        # Génère un rapport des assets');
    }
}

if (require.main === module) {
    main();
}

module.exports = { optimizeSVG, processSVG, generateAssetReport };


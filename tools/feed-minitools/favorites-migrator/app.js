/**
 * Favorites Migrator - Main Application Entry Point
 * Client-side migration tool for FreshRSS to Feedbin
 */

// Initialize modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AuthModule
    if (window.AuthModule) {
        window.authModule = new window.AuthModule();
        window.authModule.init();
    }

    // Initialize MigrationModule
    if (window.MigrationModule) {
        window.migrationModule = new window.MigrationModule();
    }

    // Initialize UIModule
    if (window.UIModule) {
        window.uiModule = new window.UIModule();
        window.uiModule.init();
    }

    // Initialize ValidationModule
    if (window.ValidationModule) {
        window.validationModule = new window.ValidationModule();
    }

    console.log('✅ Favorites Migrator initialized');
});


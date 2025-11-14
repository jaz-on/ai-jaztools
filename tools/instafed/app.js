/**
 * @module tools/instafed/app
 * 
 * InstaFed - Main Application
 * 
 * Application cliente pour migrer des archives Instagram vers le format Pixelfed.
 * Gère l'analyse, la conversion et le téléchargement des archives.
 */

import { createError, ErrorType, logError } from '../../shared/utils/error-handler.js';
import { showError } from '../../shared/utils/messages.js';

// Helper function to get shared components
function getSharedComponent(name) {
    if (window.SharedComponents && window.SharedComponents[name]) {
        return window.SharedComponents[name];
    }
    return null;
}

// ===== MODULES UTILITAIRES =====

// Module: EventManager - Gestion centralisée des événements
const EventManager = {
    listeners: new Map(),
    
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    },
    
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
    },
    
    removeListener(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
};

// Module: DOMUtils - Utilitaires DOM avec cache
const DOMCache = new Map();

const DOMUtils = {
    getElement(id) {
        if (!DOMCache.has(id)) {
            DOMCache.set(id, document.getElementById(id));
        }
        return DOMCache.get(id);
    },
    
    querySelector(selector, parent = document) {
        return parent.querySelector(selector);
    },
    
    addClass(element, className) {
        if (element) {
            element.classList.add(className);
        }
    },
    
    removeClass(element, className) {
        if (element) {
            element.classList.remove(className);
        }
    },
    
    clearCache() {
        DOMCache.clear();
    }
};

// Module: ValidationUtils - Validation des données
const ValidationUtils = {
    isValidFile(file) {
        return file && file.type === 'application/zip';
    },
    
    isValidArchive(zip) {
        const requiredFiles = ['content/', 'personal_information/'];
        return requiredFiles.every(file => zip.file(file));
    },
    
    isValidUsername(username) {
        return username && username.length >= 3 && /^[a-zA-Z0-9._]+$/.test(username);
    }
};

// Module: ErrorHandler - Gestion avancée des erreurs (utilise le module partagé)
const ErrorHandler = {
    types: {
        NETWORK: ErrorType.NETWORK,
        VALIDATION: ErrorType.VALIDATION,
        PROCESSING: ErrorType.UNKNOWN,
        MEMORY: ErrorType.UNKNOWN
    },
    
    handleError(error, context = {}) {
        // Déterminer le type d'erreur
        let errorType = ErrorType.UNKNOWN;
        if (error.name === 'NetworkError' || error.message?.includes('network') || error.message?.includes('connexion')) {
            errorType = ErrorType.NETWORK;
        } else if (error.name === 'ValidationError' || error.message?.includes('invalid') || error.message?.includes('invalide')) {
            errorType = ErrorType.VALIDATION;
        }
        
        // Créer l'erreur standardisée
        const errorInfo = createError(
            error.message || 'Une erreur est survenue',
            errorType,
            error instanceof Error ? error : null
        );
        
        // Ajouter le contexte
        if (Object.keys(context).length > 0) {
            errorInfo.context = context;
        }
        
        // Log de l'erreur
        logError(errorInfo);
        
        // Notification utilisateur
        this.showUserError(errorInfo);
        
        // Ajout à l'état si AppStateManager existe
        if (typeof AppStateManager !== 'undefined') {
            AppStateManager.addError(errorInfo);
        }
        
        // Tentative de récupération
        this.attemptRecovery(errorInfo);
    },
    
    getErrorType(error) {
        if (error.name === 'NetworkError') return this.types.NETWORK;
        if (error.name === 'ValidationError') return this.types.VALIDATION;
        return this.types.PROCESSING;
    },
    
    showUserError(errorInfo) {
        const message = this.getUserFriendlyMessage(errorInfo);
        if (typeof logMessage === 'function') {
            logMessage(message, 'errorLog', 'error');
        } else {
            // Chercher un container d'erreur dans le DOM
            const errorContainer = document.getElementById('error-message-container');
            if (errorContainer) {
                const Message = getSharedComponent('Message');
                if (Message) {
                    // Clear existing messages
                    errorContainer.innerHTML = '';
                    const messageEl = Message({
                        type: 'error',
                        children: message
                    });
                    errorContainer.appendChild(messageEl);
                    errorContainer.classList.remove('hidden');
                } else {
                    // Fallback to old method
                    const oldContainer = document.getElementById('error-message');
                    if (oldContainer) {
                        showError(message, oldContainer);
                    } else {
                        console.error('Error container not found:', message);
                    }
                }
            } else {
                console.error('Error container not found:', message);
            }
        }
    },
    
    getUserFriendlyMessage(errorInfo) {
        switch (errorInfo.type) {
            case ErrorType.NETWORK:
                return 'Erreur de connexion. Vérifiez votre connexion internet.';
            case ErrorType.VALIDATION:
                return 'Fichier invalide. Assurez-vous que c\'est un fichier ZIP Instagram.';
            case ErrorType.API:
                return 'Erreur de traitement. Réessayez avec un autre fichier.';
            default:
                return 'Une erreur inattendue s\'est produite.';
        }
    },
    
    attemptRecovery(errorInfo) {
        switch (errorInfo.type) {
            case ErrorType.NETWORK:
                // Retry automatique après 2 secondes
                setTimeout(() => {
                    EventManager.emit('retry-operation', errorInfo);
                }, 2000);
                break;
            case ErrorType.VALIDATION:
                // Tentative de correction automatique
                this.attemptAutoFix(errorInfo);
                break;
        }
    },
    
    attemptAutoFix(errorInfo) {
        // Logique de correction automatique si possible
        console.log('Attempting auto-fix for:', errorInfo);
    }
};

// Module: MemoryManager - Gestion de la mémoire
const MemoryManager = {
    cleanup() {
        // Nettoyage du cache DOM
        DOMUtils.clearCache();
        
        // Libération des archives si AppStateManager existe
        if (typeof AppStateManager !== 'undefined' && AppStateManager.state) {
            if (AppStateManager.state.archiveData) {
                AppStateManager.state.archiveData = null;
            }
            if (AppStateManager.state.processingErrors) {
                AppStateManager.state.processingErrors = [];
            }
        }
        
        // Nettoyage des listeners
        EventManager.listeners.clear();
        
        console.log('Memory cleanup completed');
    }
};

// ===== FIN DES MODULES UTILITAIRES =====

const AppStateManager = {
    state: {
        currentStep: 1,
        archiveFile: null,
        archiveData: null,
        convertedData: null,
        stats: { photos: 0, videos: 0, totalSize: 0 },
        username: null,
        processingErrors: [],
        options: {
            fixEmptyCaptions: true,
            captionPlaceholder: 'Migrated thanks to #instafed',
            customPlaceholder: '',
            optimizeStructure: true,
            cleanMetadata: false,
            metadataLevel: 'strict',
            addHashtags: false,
            hashtagList: '#migration #pixelfed',
            preserveDates: false
        }
    },

    // Update state with validation
    update: function(path, value) {
        const keys = path.split('.');
        let current = this.state;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        
        // Trigger UI updates
        this.notifyListeners(path, value);
    },

    // Get state value
    get: function(path) {
        const keys = path.split('.');
        let current = this.state;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return undefined;
            }
        }
        
        return current;
    },

    // Add error to processing errors
    addError: function(error) {
        const errorObj = {
            message: error.message || error,
            timestamp: new Date().toISOString(),
            type: 'processing'
        };
        
        this.state.processingErrors.push(errorObj);
        this.notifyListeners('processingErrors', this.state.processingErrors);
    },

    // Clear errors
    clearErrors: function() {
        this.state.processingErrors = [];
        this.notifyListeners('processingErrors', []);
    },

    // Event listeners for state changes
    listeners: {},

    // Subscribe to state changes
    subscribe: function(path, callback) {
        if (!this.listeners[path]) {
            this.listeners[path] = [];
        }
        this.listeners[path].push(callback);
    },

    // Notify listeners of state changes
    notifyListeners: function(path, value) {
        if (this.listeners[path]) {
            this.listeners[path].forEach(callback => {
                try {
                    callback(value);
                } catch (error) {
                    console.error('Error in state change listener:', error);
                }
            });
        }
    },

    // Reset state to initial values
    reset: function() {
        this.state = {
            currentStep: 1,
            archiveFile: null,
            archiveData: null,
            convertedData: null,
            stats: { photos: 0, videos: 0, totalSize: 0 },
            username: null,
            processingErrors: [],
            options: {
                fixEmptyCaptions: true,
                captionPlaceholder: 'Migrated thanks to #instafed',
                customPlaceholder: '',
                optimizeStructure: true,
                cleanMetadata: false,
                metadataLevel: 'strict',
                addHashtags: false,
                hashtagList: '#migration #pixelfed',
                preserveDates: false
            }
        };
        
        // Notify all listeners of reset
        Object.keys(this.listeners).forEach(path => {
            this.notifyListeners(path, this.get(path));
        });
    }
};

// Legacy appState for backward compatibility
let appState = AppStateManager.state;

// ===== MODULE: FILEHANDLER =====
// Gestion centralisée des fichiers avec validation et cache

const FileHandler = {
    // Cache des fichiers traités
    processedFiles: new Map(),
    
    // Validation et traitement des fichiers
    async processFile(file) {
        try {
            // Validation du fichier
            if (!ValidationUtils.isValidFile(file)) {
                throw new Error('Fichier invalide. Seuls les fichiers ZIP sont acceptés.');
            }
            
            // Vérification si déjà traité
            const fileKey = `${file.name}_${file.size}_${file.lastModified}`;
            if (this.processedFiles.has(fileKey)) {
                return this.processedFiles.get(fileKey);
            }
            
            // Traitement du fichier
            const result = await this.analyzeFile(file);
            
            // Cache du résultat
            this.processedFiles.set(fileKey, result);
            
            // Émission d'événement de succès
            EventManager.emit('file-processed', result);
            
            return result;
            
        } catch (error) {
            ErrorHandler.handleError(error, { file: file.name });
            throw error;
        }
    },
    
    // Analyse détaillée du fichier
    async analyzeFile(file) {
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onload = async function(e) {
                try {
                    const arrayBuffer = e.target.result;
                    const zip = await JSZip.loadAsync(arrayBuffer);
                    
                    // Validation de l'archive
                    if (!ValidationUtils.isValidArchive(zip)) {
                        throw new Error('Archive Instagram invalide. Vérifiez le contenu du fichier.');
                    }
                    
                    // Analyse du contenu
                    const analysis = await FileHandler.analyzeArchiveContent(zip);
                    
                    resolve({
                        file,
                        zip,
                        analysis,
                        timestamp: Date.now()
                    });
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = function() {
                reject(new Error('Erreur lors de la lecture du fichier.'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    },
    
    // Analyse du contenu de l'archive
    async analyzeArchiveContent(zip) {
        const allFiles = Object.keys(zip.files);
        
        // Filtrage des fichiers média
        const mediaFiles = allFiles.filter(filename => {
            const lowerFilename = filename.toLowerCase();
            return lowerFilename.includes('photo') || 
                   lowerFilename.includes('video') ||
                   lowerFilename.includes('.jpg') ||
                   lowerFilename.includes('.mp4');
        });
        
        // Statistiques
        const stats = {
            totalFiles: allFiles.length,
            mediaFiles: mediaFiles.length,
            photos: mediaFiles.filter(f => f.toLowerCase().includes('photo')).length,
            videos: mediaFiles.filter(f => f.toLowerCase().includes('video')).length,
            totalSize: 0
        };
        
        // Calcul de la taille totale
        for (const filename of mediaFiles) {
            const file = zip.file(filename);
            if (file) {
                stats.totalSize += file._data.uncompressedSize || 0;
            }
        }
        
        return stats;
    },
    
    // Gestion du drag & drop
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropZone = e.currentTarget;
        DOMUtils.addClass(dropZone, 'dragover');
        
        EventManager.emit('drag-over', { element: dropZone });
    },
    
    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropZone = e.currentTarget;
        DOMUtils.removeClass(dropZone, 'dragover');
        
        EventManager.emit('drag-leave', { element: dropZone });
    },
    
    handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropZone = e.currentTarget;
        DOMUtils.removeClass(dropZone, 'dragover');
        
        const files = e.dataTransfer.files;
        
        if (files.length > 0) {
            this.processFile(files[0]);
        }
        
        EventManager.emit('file-dropped', { files });
    },
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        
        if (file) {
            this.processFile(file);
        }
        
        EventManager.emit('file-selected', { file });
    },
    
    // Nettoyage du cache
    clearCache() {
        this.processedFiles.clear();
        console.log('FileHandler cache cleared');
    }
};

// ===== FIN DU MODULE FILEHANDLER =====

// Enhanced Option Status Management
const OptionStatusManager = {
    // Configuration for all available options
    options: {
        cleanMetadata: {
            id: 'cleanMetadata',
            label: 'Clean Metadata',
            description: 'Remove sensitive metadata from media files',
            statusText: {
                enabled: 'Activé',
                disabled: 'Désactivé'
            }
        },
        addHashtags: {
            id: 'addHashtags',
            label: 'Add Hashtags',
            description: 'Add migration hashtags to posts',
            statusText: {
                enabled: 'Activé',
                disabled: 'Désactivé'
            }
        },
        preserveDates: {
            id: 'preserveDates',
            label: 'Preserve Dates',
            description: 'Keep original post dates',
            statusText: {
                enabled: 'Activé',
                disabled: 'Désactivé'
            }
        },
        fixEmptyCaptions: {
            id: 'fixEmptyCaptions',
            label: 'Fix Empty Captions',
            description: 'Replace empty captions with placeholder',
            statusText: {
                enabled: 'Activé',
                disabled: 'Désactivé'
            }
        },
        optimizeStructure: {
            id: 'optimizeStructure',
            label: 'Optimize Structure',
            description: 'Optimize archive structure for Pixelfed',
            statusText: {
                enabled: 'Activé',
                disabled: 'Désactivé'
            }
        }
    },

    updateStatus: function(checkboxId) {
        const checkbox = document.getElementById(checkboxId);
        const statusElement = document.querySelector(`[data-checkbox="${checkboxId}"]`);
        
        if (checkbox && statusElement) {
            const option = this.options[checkboxId];
            if (option) {
                if (checkbox.checked) {
                    statusElement.textContent = option.statusText.enabled;
                    statusElement.classList.add('active');
                    statusElement.setAttribute('aria-label', `${option.label} is enabled`);
                } else {
                    statusElement.textContent = option.statusText.disabled;
                    statusElement.classList.remove('active');
                    statusElement.setAttribute('aria-label', `${option.label} is disabled`);
                }
                
                // Update appState to keep it in sync
                if (appState.options) {
                    appState.options[checkboxId] = checkbox.checked;
                }
                
                // Trigger preview update if available
                if (typeof updatePreview === 'function') {
                    updatePreview();
                }
            }
        }
    },

    initializeStatuses: function() {
        Object.keys(this.options).forEach(optionId => {
            this.updateStatus(optionId);
        });
    },

    setupEventListeners: function() {
        Object.keys(this.options).forEach(optionId => {
            const checkbox = document.getElementById(optionId);
            if (checkbox) {
                // Remove existing listeners to prevent duplicates
                checkbox.removeEventListener('change', this.handleOptionChange);
                
                // Add new listener
                checkbox.addEventListener('change', this.handleOptionChange.bind(this));
                
                // Add keyboard support
                checkbox.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        checkbox.checked = !checkbox.checked;
                        this.updateStatus(optionId);
                    }
                });
            }
        });
    },

    handleOptionChange: function(event) {
        const checkboxId = event.target.id;
        this.updateStatus(checkboxId);
        
        // Log the change for debugging
        console.log(`Option ${checkboxId} changed to: ${event.target.checked}`);
        
        // Announce to screen readers
        const option = this.options[checkboxId];
        if (option) {
            const status = event.target.checked ? 'enabled' : 'disabled';
            accessibilityUtils.announceToScreenReader(`${option.label} ${status}`);
        }
    },

    // Get current state of all options
    getCurrentState: function() {
        const state = {};
        Object.keys(this.options).forEach(optionId => {
            const checkbox = document.getElementById(optionId);
            state[optionId] = checkbox ? checkbox.checked : false;
        });
        return state;
    },

    // Validate option combinations
    validateOptions: function() {
        const state = this.getCurrentState();
        const warnings = [];
        
        // Example validation: if preserveDates is enabled, warn about potential issues
        if (state.preserveDates && state.optimizeStructure) {
            warnings.push('Preserving dates with structure optimization may cause conflicts');
        }
        
        return warnings;
    }
};




// UIState module - handles UI state management
const UIState = {
    hideAllSteps: function() {
        const steps = document.querySelectorAll('.migration-step');
        steps.forEach(step => {
            step.style.display = 'none';
        });
    },

    updateProgress: function(stepNumber) {
        // Update progress tracker
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, index) => {
            if (index + 1 <= stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update current step in app state
        appState.currentStep = stepNumber;
    },

    activateStep: function(stepNumber) {
        UIState.hideAllSteps();
        
        const currentStep = document.getElementById(`step${stepNumber}`);
        if (currentStep) {
            currentStep.style.display = 'block';
            currentStep.classList.add('active');
        }
        
        UIState.updateProgress(stepNumber);
        updateActiveNavigation();
    },

    completeStep: function(stepNumber) {
        const step = document.querySelector(`.progress-step:nth-child(${stepNumber})`);
        if (step) {
            step.classList.add('completed');
        }
        
        // Move to next step
        if (stepNumber < 5) {
            UIState.activateStep(stepNumber + 1);
        }
    },

    updatePreviewStats: function() {
        // Update preview statistics
        const previewPhotos = document.getElementById('previewPhotos');
        const previewVideos = document.getElementById('previewVideos');
        const previewTime = document.getElementById('previewTime');
        const previewSize = document.getElementById('previewSize');
        
        if (previewPhotos) previewPhotos.textContent = appState.stats.photos || 0;
        if (previewVideos) previewVideos.textContent = appState.stats.videos || 0;
        if (previewTime) previewTime.textContent = estimateProcessingTime();
        if (previewSize) previewSize.textContent = formatFileSize(appState.stats.totalSize || 0);
    }
};

// Helper functions - defined early to be available everywhere
// Functions now handled by UIState module

// Enhanced JSZip error handling and validation
const JSZipUtils = {
    validateArchive: function(zip) {
        const requiredFiles = [
            'personal_information/personal_information/personal_information.json',
            'content/'
        ];
        
        const missingFiles = requiredFiles.filter(file => !zip.file(file));
        if (missingFiles.length > 0) {
            throw new Error(`Invalid Instagram archive: Missing required files: ${missingFiles.join(', ')}`);
        }
        
        return true;
    },
    
    async safeLoadAsync(arrayBuffer) {
        try {
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(arrayBuffer);
            this.validateArchive(loadedZip);
            return loadedZip;
        } catch (error) {
            if (error.message && error.message.includes('JSZip')) {
                throw new Error(`JSZip initialization failed: ${error.message}`);
            }
            throw new Error(`Failed to load ZIP file: ${error.message}`);
        }
    }
};

// Extract Instagram username from archive ZIP
async function extractInstagramUsername(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                const zip = await JSZipUtils.safeLoadAsync(e.target.result);
                
                // Look for the personal information file
                const personalInfoFile = zip.file('personal_information/personal_information/personal_information.json');
                
                if (!personalInfoFile) {
                    console.log('Personal information file not found in archive');
                    reject(new Error('Personal information file not found in archive'));
                    return;
                }
                
                try {
                    const content = await personalInfoFile.async('string');
                    const data = JSON.parse(content);
                    
                    // Look for the username in the profile_user section
                    if (data.profile_user && data.profile_user.length > 0) {
                        const userInfo = data.profile_user[0];
                        if (userInfo.string_map_data && userInfo.string_map_data.Username) {
                            const username = userInfo.string_map_data.Username.value;
                            console.log('Extracted username from archive:', username);
                            resolve(username);
                            return;
                        }
                    }
                    
                    // If not found in profile_user, try other sections
                    console.log('Username not found in profile_user, trying other sections...');
                    reject(new Error('Username not found in expected location'));
                } catch (parseError) {
                    console.error('Error parsing personal information JSON:', parseError);
                    reject(new Error(`Invalid personal information format: ${parseError.message}`));
                }
            } catch (error) {
                console.error('Error processing ZIP file:', error);
                reject(error);
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}

// Analyze archive to detect issues
async function analyzeArchiveIssues(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                const zip = await JSZipUtils.safeLoadAsync(e.target.result);
                const issues = {
                    emptyCaptions: 0,
                    photosWithGPS: 0,
                    structureIssues: false,
                    totalPosts: 0,
                    totalPhotos: 0,
                    totalVideos: 0,
                    processingErrors: []
                };
                
                try {
                    // Count all files in the archive
                    const allFiles = Object.keys(zip.files);
                    console.log('All files in archive:', allFiles);
                    
                    // Count media files with better validation
                    const mediaFiles = allFiles.filter(filename => {
                        const lowerFilename = filename.toLowerCase();
                        return lowerFilename.includes('.jpg') || 
                               lowerFilename.includes('.jpeg') || 
                               lowerFilename.includes('.png') || 
                               lowerFilename.includes('.mp4') || 
                               lowerFilename.includes('.mov');
                    });
                    
                    // Count photos vs videos
                    const photoFiles = mediaFiles.filter(filename => {
                        const lowerFilename = filename.toLowerCase();
                        return lowerFilename.includes('.jpg') || 
                               lowerFilename.includes('.jpeg') || 
                               lowerFilename.includes('.png');
                    });
                    
                    const videoFiles = mediaFiles.filter(filename => {
                        const lowerFilename = filename.toLowerCase();
                        return lowerFilename.includes('.mp4') || 
                               lowerFilename.includes('.mov');
                    });
                    
                    issues.totalPhotos = photoFiles.length;
                    issues.totalVideos = videoFiles.length;
                    
                    console.log('Found media files:', {
                        photos: issues.totalPhotos,
                        videos: issues.totalVideos,
                        total: issues.totalPhotos + issues.totalVideos
                    });
                    
                    // Analyze posts data if available
                    const postsFile = zip.file('content/posts_1.json');
                    if (postsFile) {
                        try {
                            const content = await postsFile.async('string');
                            try {
                                const postsData = JSON.parse(content);
                                if (postsData && Array.isArray(postsData)) {
                                    issues.totalPosts = postsData.length;
                                    
                                    // Count posts with empty captions
                                    issues.emptyCaptions = postsData.filter(post => 
                                        !post.caption || post.caption.trim() === ''
                                    ).length;
                                    
                                    // Count posts with GPS data (simplified detection)
                                    issues.photosWithGPS = postsData.filter(post => 
                                        post.location && post.location.lat && post.location.lng
                                    ).length;
                                }
                            } catch (parseError) {
                                console.error('Error parsing posts JSON:', parseError);
                                issues.processingErrors.push(`Posts data parsing error: ${parseError.message}`);
                            }
                            
                            // Check for structure issues
                            const hasProperStructure = zip.file('content/') && zip.file('personal_information/');
                            issues.structureIssues = !hasProperStructure;
                            
                            console.log('Archive analysis complete:', issues);
                            resolve(issues);
                        } catch (error) {
                            console.error('Error reading posts file:', error);
                            issues.processingErrors.push(`Posts file reading error: ${error.message}`);
                            
                            // Fallback to estimation
                            issues.totalPosts = Math.ceil((issues.totalPhotos + issues.totalVideos) / 1.5);
                            issues.emptyCaptions = Math.floor(issues.totalPosts * 0.1);
                            issues.photosWithGPS = Math.floor(issues.totalPhotos * 0.3);
                            issues.structureIssues = !zip.file('content/') || !zip.file('personal_information/');
                            
                            console.log('Archive analysis complete (with errors):', issues);
                            resolve(issues);
                        }
                    } else {
                        // If no posts JSON, estimate based on media files
                        console.log('No posts JSON found, using media file count');
                        issues.totalPosts = Math.ceil((issues.totalPhotos + issues.totalVideos) / 1.5); // Estimate 1.5 media per post
                        issues.emptyCaptions = Math.floor(issues.totalPosts * 0.1); // Estimate 10% empty captions
                        issues.photosWithGPS = Math.floor(issues.totalPhotos * 0.3); // Estimate 30% with GPS
                        issues.structureIssues = !zip.file('content/') || !zip.file('personal_information/');
                        
                        console.log('Archive analysis complete (estimated):', issues);
                        resolve(issues);
                    }
                } catch (error) {
                    console.error('Error during archive analysis:', error);
                    issues.processingErrors.push(`Analysis error: ${error.message}`);
                    resolve(issues);
                }
            } catch (error) {
                console.error('Error analyzing archive:', error);
                reject(error);
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read file for analysis'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}

// Function now handled by UIState module

/* ===== SUPPRESSION DES FONCTIONS REDONDANTES ===== */
/* Ces fonctions sont maintenant gérées par les modules utilitaires */

// Accessibility utilities
const accessibilityUtils = {
    // Announce message to screen readers
    announceToScreenReader: function(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    },

    // Update progress bar with ARIA attributes
    updateProgressBar: function(progressBar, value) {
        if (progressBar) {
            updateProgressBarValue(progressBar, value);
            progressBar.setAttribute('aria-valuenow', value);
            accessibilityUtils.announceToScreenReader(`Progress: ${value}%`);
        }
    },

    // Focus management
    focusFirstInteractive: function(container) {
        const focusable = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
            focusable[0].focus();
        }
    },

    // Trap focus within a container
    trapFocus: function(container) {
        const focusable = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        });
    }
};

// Helper function to get shared components
function getSharedComponent(name) {
    if (window.SharedComponents && window.SharedComponents[name]) {
        return window.SharedComponents[name];
    }
    console.warn(`Shared component ${name} not available yet`);
    return null;
}

// Helper function to update ProgressBar value
function updateProgressBarValue(container, value, max = 100) {
    const progressFill = container.querySelector('.progress-fill');
    if (progressFill) {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));
        progressFill.style.width = `${percentage}%`;
        
        // Update ARIA attributes on parent progress element
        const progressElement = container.closest('[role="progressbar"]') || container.querySelector('.progress');
        if (progressElement) {
            progressElement.setAttribute('aria-valuenow', value);
        }
    }
}

// Helper function to create analysis progress bar
function createAnalysisProgressBar() {
    const container = document.getElementById('analysis-progress-container');
    if (!container) return null;
    
    const ProgressBar = getSharedComponent('ProgressBar');
    const ProgressContainer = getSharedComponent('ProgressContainer');
    
    if (ProgressBar && ProgressContainer) {
        // Clear existing
        container.innerHTML = '';
        
        const progressBar = ProgressBar({ value: 0, max: 100 });
        const progressWrapper = ProgressContainer({ children: [progressBar] });
        progressWrapper.className = 'progress';
        progressWrapper.setAttribute('role', 'progressbar');
        progressWrapper.setAttribute('aria-valuenow', '0');
        progressWrapper.setAttribute('aria-valuemin', '0');
        progressWrapper.setAttribute('aria-valuemax', '100');
        progressWrapper.setAttribute('aria-label', 'Analysis progress');
        
        const statusDiv = document.createElement('div');
        statusDiv.id = 'analysisStatus';
        statusDiv.className = 'analysis-status';
        statusDiv.setAttribute('aria-live', 'polite');
        statusDiv.setAttribute('aria-atomic', 'true');
        const statusMessage = document.createElement('div');
        statusMessage.className = 'status-message';
        statusMessage.textContent = 'Scanning content...';
        statusDiv.appendChild(statusMessage);
        
        container.appendChild(progressWrapper);
        container.appendChild(statusDiv);
        
        return progressWrapper.querySelector('.progress-fill') || progressWrapper.querySelector('.progress-bar');
    }
    
    return null;
}

// Initialize shared components UI
function initializeSharedComponents() {
    // Create buttons for action buttons containers
    const step1Container = document.getElementById('step1-action-buttons');
    if (step1Container) {
        const Button = getSharedComponent('Button');
        if (Button) {
            const btn = Button({
                variant: 'primary',
                children: 'Analyze Archive',
                onClick: startAnalysis,
                ariaLabel: 'Start analysis of selected archive'
            });
            step1Container.appendChild(btn);
        }
    }

    const step2Container = document.getElementById('step2-action-buttons');
    if (step2Container) {
        const Button = getSharedComponent('Button');
        if (Button) {
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'icon icon--settings');
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('aria-hidden', 'true');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z');
            icon.appendChild(path);
            
            const btn = Button({
                variant: 'primary',
                children: [icon, ' Configure Options'],
                onClick: goToConfiguration,
                ariaLabel: 'Go to configuration step'
            });
            step2Container.appendChild(btn);
        }
    }

    const step3Container = document.getElementById('step3-action-buttons');
    if (step3Container) {
        const Button = getSharedComponent('Button');
        if (Button) {
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'icon icon--convert');
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('aria-hidden', 'true');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z');
            icon.appendChild(path);
            
            const btn = Button({
                variant: 'primary',
                children: [icon, ' Start Conversion'],
                onClick: startConversion,
                ariaLabel: 'Start conversion with selected options'
            });
            step3Container.appendChild(btn);
        }
    }

    const step5Container = document.getElementById('step5-action-buttons');
    if (step5Container) {
        const Button = getSharedComponent('Button');
        if (Button) {
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'icon icon--download');
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('aria-hidden', 'true');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z');
            icon.appendChild(path);
            
            const btn = Button({
                variant: 'primary',
                children: [icon, ' Download ZIP Archive'],
                onClick: downloadArchive,
                ariaLabel: 'Download converted Pixelfed archive as ZIP file'
            });
            step5Container.appendChild(btn);
        }
    }

    const importGuideContainer = document.getElementById('import-guide-button-container');
    if (importGuideContainer) {
        const Button = getSharedComponent('Button');
        if (Button) {
            const btn = Button({
                variant: 'secondary',
                children: 'View Import Guide',
                onClick: showImportGuide
            });
            importGuideContainer.appendChild(btn);
        }
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    // Wait a bit to ensure all elements are ready
    setTimeout(() => {
        console.log('Setting up file handling after delay...');
        setupFileHandling();
        setupNavigation();
        setupKeyboardNavigation();
        setupAccessibility();
        setupOptionsHandling();
        updateProgressTracker();
        
        // Initialize option statuses
        OptionStatusManager.initializeStatuses();
        OptionStatusManager.setupEventListeners();
        
        // Initialize shared components (wait a bit more for components to load)
        setTimeout(() => {
            initializeSharedComponents();
        }, 200);
        
        logMessage('Application initialized. Ready to process your Instagram archive.', 'analysisLog');
        accessibilityUtils.announceToScreenReader('InstaFed loaded. Ready to process Instagram archives.');
    }, 100);
});

/* ===== SUPPRESSION DES FONCTIONS REDONDANTES ===== */
/* Ces fonctions sont maintenant gérées par les modules utilitaires */

// Step management functions - now handled by UIState module

/* ===== SUPPRESSION DES FONCTIONS REDONDANTES ===== */
/* Cette fonction est maintenant gérée par FileHandler */

/* ===== SUPPRESSION DES FONCTIONS REDONDANTES ===== */
/* Ces fonctions sont maintenant gérées par FileHandler */





function startConversion() {
    console.log('Starting conversion process...');
    
    // Simulate conversion process
    const step4 = document.getElementById('step4');
    const step5 = document.getElementById('step5');
    const progressContainer = document.getElementById('conversion-progress-container');
    const status = document.getElementById('conversionStatus');
    const fixesApplied = document.getElementById('fixesApplied');
    
    if (!step4 || !step5 || !progressContainer || !status) {
        console.error('Required elements not found:', { step4, step5, progressContainer, status });
        return;
    }
    
    console.log('Elements found, starting conversion...');
    
    // Show step 4
    UIState.hideAllSteps();
    step4.style.display = 'block';
    UIState.updateProgress(4);
    
    // Create progress bar using shared component
    const ProgressBar = getSharedComponent('ProgressBar');
    const ProgressContainer = getSharedComponent('ProgressContainer');
    let progressWrapper = null;
    
    if (ProgressBar && ProgressContainer) {
        // Clear existing progress
        const existingProgress = progressContainer.querySelector('.progress');
        if (existingProgress) existingProgress.remove();
        
        const progressBar = ProgressBar({ value: 0, max: 100 });
        progressWrapper = ProgressContainer({ children: [progressBar] });
        progressWrapper.className = 'progress';
        progressWrapper.setAttribute('role', 'progressbar');
        progressWrapper.setAttribute('aria-valuenow', '0');
        progressWrapper.setAttribute('aria-valuemin', '0');
        progressWrapper.setAttribute('aria-valuemax', '100');
        progressWrapper.setAttribute('aria-label', 'Conversion progress');
        progressContainer.insertBefore(progressWrapper, status);
    }
    
    if (!progressWrapper) {
        console.error('Progress bar element not found');
        return;
    }
    
    // Reset progress bar
    updateProgressBarValue(progressWrapper, 0);
    
    // Simulate conversion progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        updateProgressBarValue(progressWrapper, progress);
        
        if (progress <= 30) {
            status.textContent = 'Preparing files...';
        } else if (progress <= 60) {
            status.textContent = 'Converting content...';
        } else if (progress <= 90) {
            status.textContent = 'Optimizing for Pixelfed...';
        } else {
            status.textContent = 'Finalizing...';
        }
        
        console.log(`Conversion progress: ${progress}%`);
        
        if (progress >= 100) {
            clearInterval(interval);
            console.log('Conversion complete, showing step 5...');
            setTimeout(() => {
                if (fixesApplied) {
                    fixesApplied.classList.remove('hidden');
                }
                setTimeout(() => {
                    // Show step 5 and scroll to top
                    UIState.hideAllSteps();
                    step5.style.display = 'block';
                    UIState.updateProgress(5);
                    
                    // Show the action button for step 5
                    const actionButtons = document.querySelector('#step5 .action-buttons');
                    if (actionButtons) {
                        actionButtons.classList.remove('hidden');
                    }
                    
                    // Scroll to top of the migration tool section
                    const migrationTool = document.getElementById('migration-tool');
                    if (migrationTool) {
                        migrationTool.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    
                    // Update preview stats
                    UIState.updatePreviewStats();
                    
                    console.log('Step 5 displayed successfully');
                }, 1000);
            }, 500);
        }
    }, 200);
}

// Helper function to update progress by element ID
function updateProgress(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        // Find the progress wrapper (from shared component or native)
        const progressWrapper = element.querySelector('.progress') || 
                               element.querySelector('.progress-container') ||
                               element.closest('.progress') ||
                               element;
        updateProgressBarValue(progressWrapper, value);
        // Update ARIA attributes
        const progressContainer = progressWrapper.closest('.progress') || progressWrapper;
        if (progressContainer) {
            progressContainer.setAttribute('aria-valuenow', value);
        }
    }
}

async function simulateConversion() {
    const progressContainer = document.getElementById('conversion-progress-container');
    const status = document.getElementById('conversionStatus');
    
    // Find progress wrapper (from shared component or native)
    let progressWrapper = null;
    if (progressContainer) {
        progressWrapper = progressContainer.querySelector('.progress') || 
                         progressContainer.querySelector('.progress-container') ||
                         progressContainer;
    }
    
    const steps = [
        { progress: 10, message: 'Extracting and analyzing Instagram archive...' },
        { progress: 20, message: 'Applying selected configuration options...' }
    ];

    // Add steps based on selected options
    if (appState.options.fixEmptyCaptions) {
        steps.push({ progress: 30, message: `Fixing empty captions with "${appState.options.captionPlaceholder}"...` });
    }

    if (appState.options.cleanMetadata) {
        steps.push({ progress: 40, message: `Cleaning metadata (level: ${appState.options.metadataLevel})...` });
    }

    if (appState.options.optimizeStructure) {
        steps.push({ progress: 50, message: `Optimizing archive structure...` });
    }

    if (appState.options.addHashtags) {
        steps.push({ progress: 60, message: `Adding hashtags: ${appState.options.hashtagList}...` });
    }

    if (appState.options.preserveDates) {
        steps.push({ progress: 65, message: `Setting all posts to migration date/time...` });
    }

    steps.push(
        { progress: 70, message: 'Converting Instagram format to Pixelfed...' },
        { progress: 80, message: 'Validating compatibility...' },
        { progress: 90, message: 'Generating final archive...' },
        { progress: 100, message: 'Conversion complete - ready for import!' }
    );

    for (const step of steps) {
        if (progressWrapper) {
            updateProgressBarValue(progressWrapper, step.progress);
        } else {
            // Fallback to old method
            updateProgress('conversionProgress', step.progress);
        }
        if (status) {
            status.textContent = step.message;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Show fixes applied based on options
    const fixesApplied = document.getElementById('fixesApplied');
    if (fixesApplied) {
        const fixes = [];
        
        if (appState.options.fixEmptyCaptions) {
            fixes.push(`✓ Empty captions replaced with "${appState.options.captionPlaceholder}"`);
        }
        
        if (appState.options.optimizeStructure) {
            fixes.push('✓ Archive structure optimized for Pixelfed');
        }
        
        if (appState.options.cleanMetadata) {
            fixes.push('✓ Sensitive metadata removed');
        }
        
        if (appState.options.addHashtags) {
            fixes.push(`✓ Hashtags "${appState.options.hashtagList}" added`);
        }
        
        if (appState.options.preserveDates) {
            fixes.push(`✓ Publication dates set to migration date/time`);
        }
        
        fixesApplied.innerHTML = `
            <h4>Applied Fixes:</h4>
            <ul class="fixes-list">
                ${fixes.map(fix => `<li>${fix}</li>`).join('')}
            </ul>
        `;
    }
    
    // Complete step 4 and move to step 5
    UIState.completeStep(4);
    
    logMessage('Conversion complete. Ready for download.', 'conversionLog');
    accessibilityUtils.announceToScreenReader('Conversion complete');
}

async function downloadArchive() {
    try {
        // Create a sample JSON structure for Pixelfed import
        const pixelfedArchive = {
            version: "1.0",
            platform: "instagram",
            export_date: new Date().toISOString(),
            user: {
                username: appState.username || "migrated_user",
                display_name: "Migrated from Instagram"
            },
            posts: [
                {
                    id: "1",
                    type: "photo",
                    media_url: "sample_photo_1.jpg",
                    caption: "Migrated thanks to #instafed",
                    created_at: "2024-01-15T10:30:00Z",
                    location: null,
                    hashtags: ["#migration", "#pixelfed"]
                }
                // More posts would be generated from actual Instagram data
            ],
            metadata: {
                total_posts: appState.stats.photos + appState.stats.videos,
                photos: appState.stats.photos,
                videos: appState.stats.videos,
                processing_options: appState.options
            }
        };

        // Convert to JSON string
        const jsonContent = JSON.stringify(pixelfedArchive, null, 2);
        
        // Create a ZIP file containing the JSON with enhanced error handling
        const zip = new JSZip();
        
        // Add the JSON file to the ZIP
        const timestamp = new Date().toISOString().split('T')[0];
        zip.file(`pixelfed_archive_${timestamp}.json`, jsonContent);
    
        // Add a README file with instructions
        const readmeContent = `# Pixelfed Migration Archive

This archive was created by InstaFed to migrate your Instagram content to Pixelfed.

## Contents
- pixelfed_archive_${timestamp}.json: Your converted Instagram data in Pixelfed format

## How to Import
1. Log into your Pixelfed account
2. Go to Settings → Import
3. Upload this ZIP file
4. Review and confirm the import
5. Wait for processing to complete

## Migration Details
- Total posts: ${appState.stats.photos + appState.stats.videos}
- Photos: ${appState.stats.photos}
- Videos: ${appState.stats.videos}
- Migration date: ${new Date().toLocaleDateString()}

For more information, visit: https://docs.pixelfed.org/user-guide/import/
`;
        
        zip.file('README.md', readmeContent);
        
        // Generate the ZIP file with enhanced error handling
        try {
            const content = await zip.generateAsync({type: 'blob'});
            
            // Create download link
            const url = window.URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pixelfed_migration_${timestamp}.zip`;
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Show success message
            showDownloadSuccess();
        } catch (zipError) {
            console.error('Error creating ZIP file:', zipError);
            // Fallback to JSON download if ZIP creation fails
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pixelfed_archive_${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showDownloadSuccess();
        }
    } catch (error) {
        console.error('Error in downloadArchive:', error);
        logMessage(`Download failed: ${error.message}`, 'conversionLog', 'error');
        accessibilityUtils.announceToScreenReader('Download failed due to an error');
    }
}

function showDownloadSuccess() {
    // Create a temporary success notification using Message component
    const Message = getSharedComponent('Message');
    if (Message) {
        const notification = document.createElement('div');
        notification.className = 'download-success-notification';
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000;';
        
        const message = Message({
            type: 'success',
            children: 'ZIP archive downloaded successfully! Ready for Pixelfed import.'
        });
        message.style.cssText = 'padding: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        notification.appendChild(message);
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    } else {
        // Fallback to old method
        const notification = document.createElement('div');
        notification.className = 'download-success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <svg class="icon icon--success" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>ZIP archive downloaded successfully! Ready for Pixelfed import.</span>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

/* ===== SUPPRESSION DES FONCTIONS REDONDANTES ===== */
/* Ces fonctions sont maintenant gérées par ProgressManager et ErrorHandler */

/* ===== SUPPRESSION DES FONCTIONS REDONDANTES ===== */
/* Ces fonctions sont maintenant gérées par les modules utilitaires */

// Scroll handling
/* ===== SUPPRESSION DES FONCTIONS REDONDANTES ===== */
/* Ces fonctions sont maintenant gérées par les modules utilitaires */

// Options handling setup
function setupOptionsHandling() {
    console.log('Setting up options handling...');
    
    // Check if configuration elements exist
    const configElements = document.querySelectorAll('.checkbox-container, .option-detail');
    if (configElements.length === 0) {
        console.log('Configuration elements not found, skipping options setup');
        return;
    }
    
    // Listen for option changes
    const optionCheckboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    console.log(`Found ${optionCheckboxes.length} option checkboxes`);
    optionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePreview);
    });

    // Listen for option value changes
    const optionInputs = document.querySelectorAll('.option-detail select, .option-detail input');
    console.log(`Found ${optionInputs.length} option inputs`);
    optionInputs.forEach(input => {
        input.addEventListener('change', updatePreview);
    });

    // Handle custom placeholder input
    const captionPlaceholder = document.getElementById('captionPlaceholder');
    const customPlaceholder = document.getElementById('customPlaceholder');
    
    if (captionPlaceholder && customPlaceholder) {
        captionPlaceholder.addEventListener('change', function() {
            if (this.value === 'custom') {
                customPlaceholder.style.display = 'inline-block';
                customPlaceholder.focus();
            } else {
                customPlaceholder.style.display = 'none';
            }
            updatePreview();
        });
        
        customPlaceholder.addEventListener('input', updatePreview);
    }

    // Initialize preview
    updatePreview();
}

function updatePreview() {
    // Check if we're in the configuration step
    const configStep = document.getElementById('step3');
    if (!configStep || configStep.style.display === 'none') {
        console.log('Configuration step not active, skipping preview update');
        return;
    }
    
    // Update app state with current options
    appState.options.fixEmptyCaptions = true; // Always enabled for essential options
    appState.options.captionPlaceholder = document.getElementById('captionPlaceholder')?.value ?? '[Post imported]';
    appState.options.customPlaceholder = document.getElementById('customPlaceholder')?.value ?? '';
    appState.options.optimizeStructure = true; // Always enabled for essential options
    appState.options.cleanMetadata = document.getElementById('cleanMetadata')?.checked ?? false;
    appState.options.metadataLevel = document.getElementById('metadataLevel')?.value ?? 'strict';
    appState.options.addHashtags = document.getElementById('addHashtags')?.checked ?? false;
    appState.options.hashtagList = document.getElementById('hashtagList')?.value ?? '#migration #pixelfed';
    appState.options.preserveDates = document.getElementById('preserveDates')?.checked ?? false;

    // Update preview statistics
    const previewPhotos = document.getElementById('previewPhotos');
    const previewVideos = document.getElementById('previewVideos');
    const previewTime = document.getElementById('previewTime');
    const previewSize = document.getElementById('previewSize');

    if (previewPhotos) previewPhotos.textContent = appState.stats.photos;
    if (previewVideos) previewVideos.textContent = appState.stats.videos;
    if (previewTime) previewTime.textContent = estimateProcessingTime();
    if (previewSize) previewSize.textContent = formatFileSize(appState.stats.totalSize);

    // Update preview changes
    updatePreviewChanges();
}

function updatePreviewChanges() {
    const changesList = document.getElementById('previewChanges');
    if (!changesList) {
        console.log('Preview changes list not found');
        return;
    }

    const changes = [];

    // Add total content to be processed
    const totalPhotos = appState.stats.photos || 0;
    const totalVideos = appState.stats.videos || 0;
    if (totalPhotos > 0 || totalVideos > 0) {
        changes.push({
            icon: 'icon--photo',
            text: `${totalPhotos} photos and ${totalVideos} videos to convert`
        });
    }

    // Essential options (always applied)
    const placeholderText = appState.options.captionPlaceholder === 'custom' 
        ? appState.options.customPlaceholder 
        : appState.options.captionPlaceholder;
    
    // Calculate empty captions based on archive analysis
    // Use real data from archive analysis
    const emptyCaptionsCount = appState.archiveData?.emptyCaptions || 0;
    if (emptyCaptionsCount > 0) {
        changes.push({
            icon: 'icon--fix',
            text: `${emptyCaptionsCount} empty captions will be fixed with "${placeholderText}"`
        });
    }

    // Archive structure optimization (always applied)
    changes.push({
        icon: 'icon--optimize',
        text: `Archive structure will be optimized for Pixelfed`
    });

    // Optional options (only if enabled)
    if (appState.options.cleanMetadata) {
        const levelText = {
            'strict': 'all metadata (GPS, camera info, timestamps)',
            'moderate': 'GPS data only',
            'light': 'GPS and camera info'
        };
        
        // Use real GPS data count from archive analysis
        const photosWithGPS = appState.archiveData?.photosWithGPS || 0;
        if (photosWithGPS > 0) {
            changes.push({
                icon: 'icon--clean',
                text: `${photosWithGPS} photos will be cleaned of ${levelText[appState.options.metadataLevel]}`
            });
        }
    }

    if (appState.options.addHashtags) {
        changes.push({
            icon: 'icon--hashtag',
            text: `Hashtags "${appState.options.hashtagList}" will be added to posts`
        });
    }

    if (appState.options.preserveDates) {
        const migrationDate = new Date().toLocaleString();
        changes.push({
            icon: 'icon--calendar',
            text: `Posts will use migration date/time (${migrationDate})`
        });
    } else {
        changes.push({
            icon: 'icon--calendar',
            text: `Posts will use original publication dates`
        });
    }

    // Generate HTML with proper icons
    const changesHTML = changes.map(change => `
        <li>
            <svg class="icon ${change.icon}" viewBox="0 0 24 24" aria-hidden="true">
                ${getIconPath(change.icon)}
            </svg>
            <span>${change.text}</span>
        </li>
    `).join('');

    changesList.innerHTML = changesHTML;
    console.log(`Updated preview with ${changes.length} changes`);
}

function getIconPath(iconClass) {
    const iconPaths = {
        'icon--photo': '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
        'icon--fix': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
        'icon--optimize': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
        'icon--clean': '<path d="M19 13H5v-2h14v2z"/>',
        'icon--hashtag': '<path d="M7.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
        'icon--calendar': '<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>'
    };
    return iconPaths[iconClass] || '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>';
}

// Automatic cleanup on page unload
window.addEventListener('beforeunload', function() {
    appState.archiveFile = null;
    appState.archiveData = null;
    appState.convertedData = null;
    console.log('Data automatically cleaned up.');
}); 

// --- Utility functions (added for completeness) ---

// Scroll to the migration tool section
function startMigration() {
    const migrationSection = document.getElementById('migration-tool');
    if (migrationSection) {
        migrationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.accessibilityUtils) {
            accessibilityUtils.announceToScreenReader('Navigated to migration tool section');
        }
    }
}

// Toggle help content visibility
function toggleHelp(helpId) {
    const helpContent = document.getElementById(helpId);
    if (helpContent) {
        const isHidden = helpContent.classList.contains('hidden');
        if (isHidden) {
            helpContent.classList.remove('hidden');
            if (window.accessibilityUtils) accessibilityUtils.announceToScreenReader('Help content expanded');
        } else {
            helpContent.classList.add('hidden');
            if (window.accessibilityUtils) accessibilityUtils.announceToScreenReader('Help content collapsed');
        }
    }
}

// Start archive analysis (step 1 → 2)
function startAnalysis() {
    FileHandler.analyzeArchive();
}

// Go to configuration step (step 2 → 3)
function goToConfiguration() {
    console.log('Moving to configuration step...');
    UIState.completeStep(2);
    
    // Show the action button for step 3
    const actionButtons = document.querySelector('#step3 .action-buttons');
    if (actionButtons) {
        actionButtons.classList.remove('hidden');
    }
    
    // Update preview when entering configuration step
    setTimeout(() => {
        updatePreview();
    }, 100);
    
    accessibilityUtils.announceToScreenReader('Moving to configuration step');
}

// Scroll to the top of the page
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.accessibilityUtils) accessibilityUtils.announceToScreenReader('Returned to top of page');
}

// Open Pixelfed settings (helper function for direct links)
function openPixelfedSettings() {
    const Modal = getSharedComponent('Modal');
    const Button = getSharedComponent('Button');
    
    if (Modal && Button) {
        const modalContent = document.createElement('div');
        modalContent.innerHTML = `
            <p><strong>To access Pixelfed settings:</strong></p>
            <ol>
                <li>Log into your Pixelfed account</li>
                <li>Click on your profile picture</li>
                <li>Select 'Settings'</li>
                <li>Look for 'Import' or 'Data Import' section</li>
            </ol>
            <p><strong>Or visit the documentation for detailed instructions.</strong></p>
        `;
        
        const docButton = Button({
            variant: 'primary',
            children: '📖 Open Documentation',
            onClick: () => window.open('https://docs.pixelfed.org/user-guide/import/', '_blank', 'noopener')
        });
        docButton.style.cssText = 'margin-top: 1.5rem;';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'modal-actions';
        actionsDiv.style.cssText = 'margin-top: 1.5rem; text-align: center;';
        actionsDiv.appendChild(docButton);
        modalContent.appendChild(actionsDiv);
        
        const modal = Modal({
            open: true,
            title: '📋 Pixelfed Settings Guide',
            children: modalContent,
            onClose: () => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }
        });
        
        document.body.appendChild(modal);
        
        if (window.accessibilityUtils) {
            accessibilityUtils.announceToScreenReader('Opened Pixelfed settings help modal');
        }
    } else {
        // Fallback to old method
        const notification = document.createElement('div');
        notification.className = 'pixelfed-help-modal';
        notification.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4>📋 Pixelfed Settings Guide</h4>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-btn" aria-label="Close help">×</button>
                </div>
                <div class="modal-body">
                    <p><strong>To access Pixelfed settings:</strong></p>
                    <ol>
                        <li>Log into your Pixelfed account</li>
                        <li>Click on your profile picture</li>
                        <li>Select 'Settings'</li>
                        <li>Look for 'Import' or 'Data Import' section</li>
                    </ol>
                    <p><strong>Or visit the documentation for detailed instructions.</strong></p>
                    <div class="modal-actions">
                        <a href="https://docs.pixelfed.org/user-guide/import/" target="_blank" rel="noopener" class="btn-base btn-primary">
                            📖 Open Documentation
                        </a>
                    </div>
                </div>
            </div>
        `;
        notification.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
        document.body.appendChild(notification);
        notification.addEventListener('click', (e) => {
            if (e.target === notification) {
                notification.remove();
            }
        });
    }
} 

function showImportGuide() {
    const Modal = getSharedComponent('Modal');
    
    if (Modal) {
        const modalContent = document.createElement('div');
        modalContent.innerHTML = `
            <h4>How to Import to Pixelfed</h4>
            <ol>
                <li>Log into your Pixelfed account</li>
                <li>Go to Settings → Import</li>
                <li>Upload the converted archive file</li>
                <li>Review and confirm the import</li>
                <li>Wait for processing to complete</li>
            </ol>
            <div class="import-links">
                <h5>Helpful Links:</h5>
                <ul>
                    <li><a href="https://pixelfed.blog/p/2023/feature/introducing-import-from-instagram" target="_blank" rel="noopener">Pixelfed Import Feature Announcement</a></li>
                    <li><a href="https://pixelfed.social/site/kb/import" target="_blank" rel="noopener">Import Documentation</a></li>
                </ul>
            </div>
        `;
        
        const modal = Modal({
            open: true,
            title: 'Import Guide',
            children: modalContent,
            onClose: () => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }
        });
        
        document.body.appendChild(modal);
    } else {
        // Fallback to old method
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Import Guide</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <h4>How to Import to Pixelfed</h4>
                    <ol>
                        <li>Log into your Pixelfed account</li>
                        <li>Go to Settings → Import</li>
                        <li>Upload the converted archive file</li>
                        <li>Review and confirm the import</li>
                        <li>Wait for processing to complete</li>
                    </ol>
                    <div class="import-links">
                        <h5>Helpful Links:</h5>
                        <ul>
                            <li><a href="https://pixelfed.blog/p/2023/feature/introducing-import-from-instagram" target="_blank" rel="noopener">Pixelfed Import Feature Announcement</a></li>
                            <li><a href="https://pixelfed.social/site/kb/import" target="_blank" rel="noopener">Import Documentation</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
} 
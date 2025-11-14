/**
 * @module tools/feed-minitools/favorites-migrator/modules/auth
 * 
 * Module d'authentification pour Favorites Migrator
 * 
 * Gère l'authentification utilisateur avec l'API Feedbin.
 */

import Button from '../../../../shared/components/Button/Button.js';
import { createError, displayError, ErrorType } from '../../../../shared/utils/error-handler.js';

/**
 * Classe de gestion de l'authentification
 * 
 * @class
 */
class AuthModule {
    /**
     * Crée une instance du module d'authentification
     * 
     * @constructor
     */
    constructor() {
        this.credentials = null;
        this.isAuthenticated = false;
    }

    /**
     * Initialise le module d'authentification
     * 
     * @returns {void}
     */
    init() {
        // Bind login form events
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    /**
     * Gère la soumission du formulaire de connexion
     * 
     * @param {Event} event - Événement de soumission du formulaire
     * @returns {Promise<boolean>} Statut de succès
     */
    async handleLogin(event) {
        event.preventDefault();
        console.log('🔐 AuthModule.handleLogin called');
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        console.log('📧 Email:', email);
        console.log('🔑 Password length:', password.length);
        
        // Validate inputs
        if (!this.validateEmail(document.getElementById('email'))) {
            return false;
        }
        
        if (!this.validatePassword(document.getElementById('password'))) {
            return false;
        }
        
        // Show loading state
        const loginBtn = document.getElementById('login-btn');
        this.setButtonLoading(loginBtn, true);
        
        try {
            console.log('🌐 Testing Feedbin API authentication');
            
            // Initialize Feedbin API with credentials
            if (!window.FeedbinAPI) {
                throw new Error('FeedbinAPI module not loaded');
            }
            
            const feedbinAPI = new window.FeedbinAPI();
            feedbinAPI.setCredentials(email, password);
            
            // Test authentication
            const isAuthenticated = await feedbinAPI.testAuth();
            
            if (isAuthenticated) {
                // Store credentials (in memory only, not localStorage for security)
                this.credentials = { email, password };
                this.feedbinAPI = feedbinAPI;
                this.isAuthenticated = true;
                
                // Show success message
                this.showSuccess('Connexion réussie !');
                
                // Switch to dashboard
                setTimeout(() => {
                    this.showDashboard();
                }, 1000);
                
                return true;
            } else {
                this.showError('Échec de l\'authentification. Vérifiez vos identifiants Feedbin.');
                return false;
            }
            
        } catch (error) {
            console.error('Login error:', error);
            if (error.message.includes('CORS')) {
                this.showError('Erreur CORS: L\'API Feedbin ne permet peut-être pas l\'accès direct depuis le navigateur. Un proxy peut être nécessaire.');
            } else {
                this.showError('Erreur de connexion. Vérifiez votre connexion internet et vos identifiants.');
            }
            return false;
        } finally {
            this.setButtonLoading(loginBtn, false);
        }
    }

    /**
     * Get FeedbinAPI instance
     * @returns {FeedbinAPI} FeedbinAPI instance
     */
    getFeedbinAPI() {
        if (!this.isAuthenticated || !this.feedbinAPI) {
            throw new Error('Not authenticated');
        }
        return this.feedbinAPI;
    }

    /**
     * Logout user
     */
    logout() {
        this.credentials = null;
        this.feedbinAPI = null;
        this.isAuthenticated = false;
        
        // Reset interface
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        
        // Show login form
        this.showLoginForm();
    }

    /**
     * Show login form
     */
    showLoginForm() {
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
        this.clearMessages();
    }

    /**
     * Show dashboard
     */
    showDashboard() {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Reset interface state
        this.resetInterfaceState();
        
        // Initialize step states
        this.updateStepStatus(1, 'current');
        this.updateStepStatus(2, 'pending');
        this.updateStepStatus(3, 'pending');
        this.updateStepStatus(4, 'pending');
        
        // Ensure user starts at the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset active tab to migration
        this.switchTab('migration');
    }

    /**
     * Reset interface state
     */
    resetInterfaceState() {
        // Reset file input
        const fileInput = document.getElementById('freshrss-file');
        if (fileInput) fileInput.value = '';
        
        // Hide all results and analyses
        document.querySelectorAll('.analysis-results, .progress-container, .results-container, .final-results, .export-results').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Reset buttons
        const analyzeBtn = document.getElementById('analyze-feedbin');
        const startBtn = document.getElementById('start-migration');
        if (analyzeBtn) analyzeBtn.disabled = true;
        if (startBtn) startBtn.disabled = true;
        
        // Reset file information
        const fileInfo = document.getElementById('file-info');
        if (fileInfo) fileInfo.classList.add('hidden');
        
        // Reset cache stats
        const cacheStats = document.getElementById('cache-stats');
        if (cacheStats) cacheStats.innerHTML = '';
    }

    /**
     * Update step status
     * @param {number} stepNumber - Step number
     * @param {string} status - Step status
     */
    updateStepStatus(stepNumber, status) {
        const step = document.getElementById(`step-${stepNumber}`);
        if (!step) return;
        
        // Remove all states
        step.classList.remove('completed', 'current', 'blocked', 'pending');
        
        // Add the correct state
        switch (status) {
            case 'completed':
                step.classList.add('completed');
                break;
            case 'current':
                step.classList.add('current');
                break;
            case 'blocked':
                step.classList.add('blocked');
                break;
            case 'pending':
                step.classList.add('pending');
                break;
        }
    }

    /**
     * Switch to tab
     * @param {string} tabName - Tab name
     */
    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(`${tabName}-tab`);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }
        
        // Add active class to selected tab button
        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
    }

    /**
     * Validate email field
     * @param {HTMLInputElement} input - Email input element
     * @returns {boolean} - Validation result
     */
    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError(input, 'Email required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showFieldError(input, 'Invalid email format');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    /**
     * Validate password field
     * @param {HTMLInputElement} input - Password input element
     * @returns {boolean} - Validation result
     */
    validatePassword(input) {
        const password = input.value;
        
        if (!password) {
            this.showFieldError(input, 'Password required');
            return false;
        }
        
        if (password.length < 1) {
            this.showFieldError(input, 'Password required');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    /**
     * Show field error
     * @param {HTMLInputElement} input - Input element
     * @param {string} message - Error message
     */
    showFieldError(input, message) {
        input.classList.add('error');
        
        // Remove old error message if it exists
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    /**
     * Clear field error
     * @param {HTMLInputElement} input - Input element
     */
    clearFieldError(input) {
        input.classList.remove('error');
        const errorDiv = input.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Set button loading state
     * @param {HTMLButtonElement} button - Button element
     * @param {boolean} loading - Loading state
     */
    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const errorDiv = document.getElementById('error-message-container') || document.getElementById('error-message');
        
        // More explicit error messages (en français)
        const errorMessages = {
            'Invalid credentials': 'Email ou mot de passe incorrect. Vérifiez vos identifiants Feedbin.',
            'Network error': 'Problème de connexion. Vérifiez votre connexion internet.',
            'Rate limit exceeded': 'Trop de requêtes. Veuillez attendre quelques minutes.',
            'File format error': 'Format de fichier invalide. Utilisez un fichier JSON exporté depuis FreshRSS.',
            'Authentication failed': 'Échec de l\'authentification. Vérifiez vos identifiants Feedbin.',
            'Not authenticated': 'Session expirée. Veuillez vous reconnecter.',
            'Missing data to start migration': 'Veuillez d\'abord charger un fichier FreshRSS et analyser Feedbin.',
            'Invalid FreshRSS file format': 'Le fichier doit contenir un tableau "items" avec vos favoris FreshRSS.',
            'Unable to retrieve Feedbin subscriptions': 'Vérifiez vos identifiants Feedbin et votre connexion internet.'
        };
        
        const userMessage = errorMessages[message] || message;
        const Message = this.getSharedComponent('Message');
        if (Message && errorDiv) {
            errorDiv.innerHTML = '';
            const messageEl = Message({
                type: 'error',
                children: userMessage
            });
            errorDiv.appendChild(messageEl);
        } else if (errorDiv) {
            displayError(userMessage, errorDiv);
        }
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        const successDiv = document.getElementById('success-message-container') || document.getElementById('success-message');
        const Message = this.getSharedComponent('Message');
        if (Message && successDiv) {
            successDiv.innerHTML = '';
            const messageEl = Message({
                type: 'success',
                children: message
            });
            successDiv.appendChild(messageEl);
        } else if (successDiv) {
            displaySuccess(message, successDiv);
        }
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        const errorDiv = document.getElementById('error-message-container') || document.getElementById('error-message');
        const successDiv = document.getElementById('success-message-container') || document.getElementById('success-message');
        if (errorDiv) {
            errorDiv.innerHTML = '';
            errorDiv.classList.add('hidden');
        }
        if (successDiv) {
            successDiv.innerHTML = '';
            successDiv.classList.add('hidden');
        }
    }

    /**
     * Helper function to get shared components
     * @param {string} name - Component name
     * @returns {Function|null} Component function or null
     */
    getSharedComponent(name) {
        if (window.SharedComponents && window.SharedComponents[name]) {
            return window.SharedComponents[name];
        }
        return null;
    }
}

// Exemple d'intégration du composant Button mutualisé
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    // Trouver l'ancien bouton et le remplacer
    const oldBtn = loginForm.querySelector('button[type="submit"]');
    if (oldBtn) {
      const newBtn = Button({
        variant: 'primary',
        size: 'md',
        children: '🚀 Commencer la migration',
        onClick: (e) => {
          e.preventDefault();
          loginForm.requestSubmit();
        },
      });
      oldBtn.replaceWith(newBtn);
    }
  }
});

// Gestion des messages et du loader mutualisés
function showMutualizedMessage (type, message) {
  const msg = document.getElementById(`${type}-message-mutualized`);
  if (msg) {
    msg.textContent = message;
    msg.style.display = '';
  }
}
function hideMutualizedMessages () {
  ['error', 'success'].forEach(type => {
    const msg = document.getElementById(`${type}-message-mutualized`);
    if (msg) msg.style.display = 'none';
  });
}
async function showMutualizedLoader () {
  let loader = document.getElementById('loader-mutualized');
  if (!loader) {
    try {
      const { default: Loader } = await import('../../components/Loader/Loader.js');
      loader = Loader({ message: 'Connexion en cours...' });
      loader.id = 'loader-mutualized';
      document.body.appendChild(loader);
    } catch (error) {
      console.error('Error loading Loader component:', error);
    }
  } else {
    loader.style.display = '';
  }
}
function hideMutualizedLoader () {
  const loader = document.getElementById('loader-mutualized');
  if (loader) loader.style.display = 'none';
}
// Brancher la soumission du formulaire mutualisé
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form-mutualized');
  if (form) {
    const fieldError = form.querySelector('#field-error-mutualized');
    const emailInput = form.querySelector('#email-mutualized');
    const passwordInput = form.querySelector('#password-mutualized');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideMutualizedMessages();
      if (fieldError) fieldError.style.display = 'none';
      let hasError = false;
      if (!emailInput.value) {
        if (fieldError) {
          fieldError.textContent = 'Veuillez renseigner votre email.';
          fieldError.style.display = '';
        }
        emailInput.classList.add('error');
        hasError = true;
      } else {
        emailInput.classList.remove('error');
      }
      if (!passwordInput.value) {
        if (fieldError) {
          fieldError.textContent = 'Veuillez renseigner votre mot de passe.';
          fieldError.style.display = '';
        }
        passwordInput.classList.add('error');
        hasError = true;
      } else {
        passwordInput.classList.remove('error');
      }
      if (hasError) return;
      
      try {
        showMutualizedLoader();
        // Simuler une requête asynchrone (remplacer par la vraie logique)
        await new Promise(r => setTimeout(r, 1200));
        
        // Exemple : afficher un message d'erreur ou de succès
        const email = emailInput.value;
        const password = passwordInput.value;
        if (email === 'demo@demo.com' && password === 'demo') {
          showMutualizedMessage('success', 'Connexion réussie !');
        } else {
          showMutualizedMessage('error', 'Identifiants invalides.');
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        showMutualizedMessage('error', 'Une erreur est survenue lors de la connexion.');
      } finally {
        hideMutualizedLoader();
      }
    });
  }
});

// Export for use in main app
window.AuthModule = AuthModule; 
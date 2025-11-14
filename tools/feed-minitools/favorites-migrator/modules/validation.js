// public/js/validation.js - Frontend validation module
class ValidationModule {
    constructor() {
        this.validationRules = {
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            password: {
                required: true,
                minLength: 1,
                message: 'Password is required'
            },
            file: {
                maxSize: 50 * 1024 * 1024, // 50MB
                allowedTypes: ['application/json'],
                message: 'Please select a valid JSON file (max 50MB)'
            }
        };
    }

    /**
     * Validate email field
     * @param {HTMLInputElement} input - Email input element
     * @returns {boolean} - Validation result
     */
    validateEmail(input) {
        const email = input.value.trim();
        const rules = this.validationRules.email;
        
        // Check if required
        if (rules.required && !email) {
            this.showFieldError(input, 'Email required');
            return false;
        }
        
        // Check pattern
        if (email && !rules.pattern.test(email)) {
            this.showFieldError(input, rules.message);
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
        const rules = this.validationRules.password;
        
        // Check if required
        if (rules.required && !password) {
            this.showFieldError(input, rules.message);
            return false;
        }
        
        // Check minimum length
        if (password && password.length < rules.minLength) {
            this.showFieldError(input, rules.message);
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    /**
     * Validate file upload
     * @param {File} file - Uploaded file
     * @returns {Object} - Validation result with success and message
     */
    validateFile(file) {
        const rules = this.validationRules.file;
        
        // Check file type
        if (!rules.allowedTypes.includes(file.type)) {
            return {
                success: false,
                message: 'Please select a JSON file exported from FreshRSS'
            };
        }
        
        // Check file size
        if (file.size > rules.maxSize) {
            return {
                success: false,
                message: 'File too large (max 50MB)'
            };
        }
        
        return {
            success: true,
            message: 'File is valid'
        };
    }

    /**
     * Validate FreshRSS data structure
     * @param {Object} data - Parsed JSON data
     * @returns {Object} - Validation result with success and message
     */
    validateFreshRSSData(data) {
        // Check if data is an object
        if (!data || typeof data !== 'object') {
            return {
                success: false,
                message: 'Invalid file format: not a valid JSON object'
            };
        }
        
        // Check if items array exists
        if (!data.items || !Array.isArray(data.items)) {
            return {
                success: false,
                message: 'Invalid FreshRSS file format: missing items array'
            };
        }
        
        // Check if items array is not empty
        if (data.items.length === 0) {
            return {
                success: false,
                message: 'FreshRSS file contains no items to migrate'
            };
        }
        
        // Validate first few items to ensure proper structure
        const sampleItems = data.items.slice(0, 5);
        for (const item of sampleItems) {
            if (!item.title || !item.published) {
                return {
                    success: false,
                    message: 'Invalid FreshRSS file format: items must have title and published fields'
                };
            }
        }
        
        return {
            success: true,
            message: 'FreshRSS data is valid'
        };
    }

    /**
     * Validate form submission
     * @param {HTMLFormElement} form - Form element
     * @returns {boolean} - Validation result
     */
    validateForm(form) {
        let isValid = true;
        
        // Get all form inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const inputType = input.type || 'text';
            
            switch (inputType) {
                case 'email':
                    if (!this.validateEmail(input)) {
                        isValid = false;
                    }
                    break;
                case 'password':
                    if (!this.validatePassword(input)) {
                        isValid = false;
                    }
                    break;
                case 'file':
                    // File validation is handled separately
                    break;
                default:
                    // For other input types, check if required
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        this.showFieldError(input, 'This field is required');
                        isValid = false;
                    } else {
                        this.clearFieldError(input);
                    }
                    break;
            }
        });
        
        return isValid;
    }

    /**
     * Validate API response
     * @param {Response} response - Fetch response
     * @returns {Promise<Object>} - Validation result with data or error
     */
    async validateAPIResponse(response) {
        try {
            const data = await response.json();
            
            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || `HTTP ${response.status}: ${response.statusText}`
                };
            }
            
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: 'Invalid response format'
            };
        }
    }

    /**
     * Validate migration configuration
     * @param {Object} config - Migration configuration
     * @returns {Object} - Validation result
     */
    validateMigrationConfig(config) {
        const errors = [];
        
        // Validate retry attempts
        if (typeof config.retryAttempts !== 'number' || config.retryAttempts < 1 || config.retryAttempts > 10) {
            errors.push('Retry attempts must be between 1 and 10');
        }
        
        // Validate batch size
        if (typeof config.batchSize !== 'number' || config.batchSize < 10 || config.batchSize > 1000) {
            errors.push('Batch size must be between 10 and 1000');
        }
        
        // Validate delay between batches
        if (typeof config.delayBetweenBatches !== 'number' || config.delayBetweenBatches < 0 || config.delayBetweenBatches > 10000) {
            errors.push('Delay between batches must be between 0 and 10000ms');
        }
        
        return {
            success: errors.length === 0,
            errors: errors
        };
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
     * Show form error
     * @param {string} message - Error message
     */
    showFormError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 8000);
        }
    }

    /**
     * Show form success
     * @param {string} message - Success message
     */
    showFormSuccess(message) {
        const successDiv = document.getElementById('success-message');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.classList.remove('hidden');
            
            setTimeout(() => {
                successDiv.classList.add('hidden');
            }, 3000);
        }
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} - Validation result
     */
    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Validate date format
     * @param {string} dateString - Date string to validate
     * @returns {boolean} - Validation result
     */
    validateDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    /**
     * Sanitize input value
     * @param {string} value - Input value to sanitize
     * @returns {string} - Sanitized value
     */
    sanitizeInput(value) {
        if (typeof value !== 'string') {
            return value;
        }
        
        return value
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/&/g, '&amp;') // Escape HTML entities
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Validate numeric input
     * @param {HTMLInputElement} input - Numeric input element
     * @param {Object} options - Validation options
     * @returns {boolean} - Validation result
     */
    validateNumericInput(input, options = {}) {
        const value = parseFloat(input.value);
        const { min, max, required = true } = options;
        
        // Check if required
        if (required && (isNaN(value) || input.value === '')) {
            this.showFieldError(input, 'This field is required');
            return false;
        }
        
        // Check minimum value
        if (min !== undefined && value < min) {
            this.showFieldError(input, `Value must be at least ${min}`);
            return false;
        }
        
        // Check maximum value
        if (max !== undefined && value > max) {
            this.showFieldError(input, `Value must be at most ${max}`);
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    /**
     * Add real-time validation to input
     * @param {HTMLInputElement} input - Input element
     * @param {Function} validator - Validation function
     */
    addRealTimeValidation(input, validator) {
        input.addEventListener('blur', () => {
            validator(input);
        });
        
        input.addEventListener('input', () => {
            this.clearFieldError(input);
        });
    }

    /**
     * Initialize validation for all forms
     */
    initFormValidation() {
        // Add validation to login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                if (!this.validateForm(loginForm)) {
                    e.preventDefault();
                }
            });
        }
        
        // Add validation to migration config form
        const configForm = document.getElementById('migration-config');
        if (configForm) {
            configForm.addEventListener('submit', (e) => {
                if (!this.validateForm(configForm)) {
                    e.preventDefault();
                }
            });
        }
        
        // Add real-time validation to email fields
        document.querySelectorAll('input[type="email"]').forEach(input => {
            this.addRealTimeValidation(input, (input) => this.validateEmail(input));
        });
        
        // Add real-time validation to password fields
        document.querySelectorAll('input[type="password"]').forEach(input => {
            this.addRealTimeValidation(input, (input) => this.validatePassword(input));
        });
    }
}

// Export for use in main app
window.ValidationModule = ValidationModule; 
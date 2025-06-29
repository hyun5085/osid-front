// Utility functions for the Car Order Tracker application

const utils = {
    // Show loading spinner
    showLoading() {
        // document.getElementById('loadingSpinner').classList.remove('d-none');
        const el = document.getElementById('loadingSpinner');
        if (el) el.classList.remove('d-none');
    },

    // Hide loading spinner
    hideLoading() {
        // document.getElementById('loadingSpinner').classList.add('d-none');
        const el = document.getElementById('loadingSpinner');
        if (el) el.classList.add('d-none');
    },

    // Show toast notification
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toastId = 'toast-' + Date.now();
        
        const bgClass = {
            'success': 'bg-success',
            'error': 'bg-danger',
            'warning': 'bg-warning',
            'info': 'bg-info'
        }[type] || 'bg-info';

        const iconClass = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        }[type] || 'fas fa-info-circle';

        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="${iconClass} me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 5000
        });
        
        toast.show();

        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    },

    // Format date for display
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Format currency
    formatCurrency(amount) {
        if (amount == null || amount === '') return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Get status badge HTML
    getStatusBadge(status) {
        if (!status) return '<span class="badge bg-secondary">Unknown</span>';
        
        const statusClasses = {
            'PENDING': 'status-pending',
            'CONFIRMED': 'status-confirmed',
            'IN_PROGRESS': 'status-info',
            'COMPLETED': 'status-completed',
            'DELIVERED': 'status-completed',
            'CANCELLED': 'status-cancelled',
            'ACTIVE': 'status-confirmed',
            'INACTIVE': 'status-cancelled'
        };

        const className = statusClasses[status.toUpperCase()] || 'bg-secondary';
        return `<span class="badge ${className}">${status}</span>`;
    },

    // Debounce function for search inputs
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone format
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    // Capitalize first letter
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Sanitize HTML to prevent XSS
    sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Show confirmation modal
    showConfirmModal(title, message, onConfirm, onCancel = null) {
        const modalId = 'confirmModal-' + Date.now();
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${message}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" id="confirmBtn-${modalId}">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modalElement = document.getElementById(modalId);
        const modal = new bootstrap.Modal(modalElement);

        document.getElementById(`confirmBtn-${modalId}`).addEventListener('click', () => {
            modal.hide();
            if (onConfirm) onConfirm();
        });

        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
            if (onCancel) onCancel();
        });

        modal.show();
    },

    // Load HTML content
    async loadHTML(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error loading HTML:', error);
            return `<div class="alert alert-danger">Error loading content: ${error.message}</div>`;
        }
    },

    // Form validation helper
    validateForm(formElement) {
        const errors = [];
        const requiredFields = formElement.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                errors.push(`${field.name || field.id} is required`);
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }

            // Email validation
            if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
                errors.push('Please enter a valid email address');
                field.classList.add('is-invalid');
            }

            // Phone validation
            if (field.type === 'tel' && field.value && !this.isValidPhone(field.value)) {
                errors.push('Please enter a valid phone number');
                field.classList.add('is-invalid');
            }
        });

        return errors;
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy: ', err);
            this.showToast('Failed to copy to clipboard', 'error');
        }
    },

    // Get query parameters
    getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },

    // Update URL with params
    updateURL(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.pushState({}, '', url);
    }
};

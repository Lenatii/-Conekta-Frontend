/**
 * CONEKTA Master Control Dashboard - Admin JavaScript Utilities
 * Handles API calls, authentication, and UI interactions
 */

// Configuration
const API_BASE_URL = 'https://conekta-complete-system.onrender.com';  // Production backend URL
const TOKEN_KEY = 'conekta_admin_token';
const USER_KEY = 'conekta_admin_user';

// Authentication Functions
const Auth = {
  // Get stored token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Store token
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get stored user
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Store user
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Clear auth data
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/admin/login.html';
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Verify token with backend
  async verifyToken() {
    try {
      const response = await API.get('/api/admin/verify');
      return response.valid;
    } catch (error) {
      return false;
    }
  }
};

// API Functions
const API = {
  // Generic GET request
  async get(endpoint) {
    const token = Auth.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers
    });

    if (response.status === 401) {
      Auth.logout();
      throw new Error('Unauthorized');
    }

    return await response.json();
  },

  // Generic POST request
  async post(endpoint, data) {
    const token = Auth.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      Auth.logout();
      throw new Error('Unauthorized');
    }

    return await response.json();
  },

  // Generic PUT request
  async put(endpoint, data) {
    const token = Auth.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      Auth.logout();
      throw new Error('Unauthorized');
    }

    return await response.json();
  },

  // Generic DELETE request
  async delete(endpoint) {
    const token = Auth.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });

    if (response.status === 401) {
      Auth.logout();
      throw new Error('Unauthorized');
    }

    return await response.json();
  }
};

// UI Utilities
const UI = {
  // Show loading spinner
  showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = '<div class="spinner"></div>';
    }
  },

  // Show error message
  showError(message, elementId = 'error-message') {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `
        <div class="alert alert-error">
          <span>❌ ${message}</span>
        </div>
      `;
      setTimeout(() => {
        element.innerHTML = '';
      }, 5000);
    }
  },

  // Show success message
  showSuccess(message, elementId = 'success-message') {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `
        <div class="alert alert-success">
          <span>✅ ${message}</span>
        </div>
      `;
      setTimeout(() => {
        element.innerHTML = '';
      }, 5000);
    }
  },

  // Format date
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Format currency
  formatCurrency(amount, currency = 'KES') {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Format number
  formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
  },

  // Get status badge HTML
  getStatusBadge(status) {
    const statusMap = {
      'new': 'badge-info',
      'read': 'badge-warning',
      'resolved': 'badge-success',
      'archived': 'badge-muted',
      'active': 'badge-success',
      'inactive': 'badge-error',
      'pending': 'badge-warning',
      'approved': 'badge-success',
      'rejected': 'badge-error',
      'completed': 'badge-success',
      'cancelled': 'badge-error'
    };

    const badgeClass = statusMap[status] || 'badge-info';
    return `<span class="badge ${badgeClass}">${status}</span>`;
  },

  // Get priority badge HTML
  getPriorityBadge(priority) {
    const priorityMap = {
      'low': 'badge-info',
      'normal': 'badge-teal',
      'high': 'badge-warning',
      'urgent': 'badge-error',
      'critical': 'badge-error'
    };

    const badgeClass = priorityMap[priority] || 'badge-info';
    return `<span class="badge ${badgeClass}">${priority}</span>`;
  },

  // Create modal
  showModal(title, content, actions = []) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal glass">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        <div class="modal-footer">
          ${actions.map(action => `
            <button class="btn ${action.class}" onclick="${action.onclick}">
              ${action.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  // Confirm dialog
  async confirm(message) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal glass">
          <div class="modal-body">
            <p>${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="cancel-btn">Cancel</button>
            <button class="btn btn-primary" id="confirm-btn">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('confirm-btn').onclick = () => {
        modal.remove();
        resolve(true);
      };

      document.getElementById('cancel-btn').onclick = () => {
        modal.remove();
        resolve(false);
      };
    });
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication on protected pages
  const isLoginPage = window.location.pathname.includes('login.html');
  
  if (!isLoginPage && !Auth.isAuthenticated()) {
    window.location.href = '/admin/login.html';
  }

  // Display user info if logged in
  const user = Auth.getUser();
  if (user) {
    const userElements = document.querySelectorAll('.user-name');
    userElements.forEach(el => {
      el.textContent = user.username;
    });

    const userEmailElements = document.querySelectorAll('.user-email');
    userEmailElements.forEach(el => {
      el.textContent = user.email;
    });
  }

  // Logout button handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  }
});

// Export for use in other scripts
window.Auth = Auth;
window.API = API;
window.UI = UI;

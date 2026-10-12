// ============================================
// UTILITY FUNCTIONS
// ============================================

const Utils = {
  // Format currency
  formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  // Format time
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  },

  // Format date time
  formatDateTime(dateString) {
    return this.formatDate(dateString) + ' ' + this.formatTime(dateString);
  },

  // Get relative time
  timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
    if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
    return this.formatDate(dateString);
  },

  // Generate star rating HTML
  stars(rating, size = 16) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += `<span style="color: #ffc107; font-size: ${size}px;">★</span>`;
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        html += `<span style="color: #ffc107; font-size: ${size}px;">★</span>`;
      } else {
        html += `<span style="color: #ddd; font-size: ${size}px;">★</span>`;
      }
    }
    return html;
  },

  // Show toast notification
  toast(message, type = 'success') {
    const container = document.getElementById('toast-container') || this.createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Create toast container
  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
  },

  // Show modal
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  // Hide modal
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // Confirm dialog
  confirm(message) {
    return new Promise(resolve => {
      const result = confirm(message);
      resolve(result);
    });
  },

  // Debounce function
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

  // Get query parameter
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  // Set query parameter
  setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
  },

  // Truncate text
  truncate(text, length) {
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
  },

  // Validate email
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Validate phone
  isValidPhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
  },

  // Generate random string
  randomString(length = 8) {
    return Math.random().toString(36).substr(2, length).toUpperCase();
  },

  // Calculate distance between two points (km)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Get order status color
  getStatusColor(status) {
    const colors = {
      'pending': '#f39c12',
      'confirmed': '#3498db',
      'preparing': '#9b59b6',
      'ready': '#e67e22',
      'out_for_delivery': '#e74c3c',
      'delivered': '#27ae60',
      'cancelled': '#95a5a6'
    };
    return colors[status] || '#95a5a6';
  },

  // Get order status label
  getStatusLabel(status) {
    const labels = {
      'pending': 'Order Placed',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready for Pickup',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  },

  // Get order status icon
  getStatusIcon(status) {
    const icons = {
      'pending': '📋',
      'confirmed': '✅',
      'preparing': '👨‍🍳',
      'ready': '📦',
      'out_for_delivery': '🚗',
      'delivered': '🎉',
      'cancelled': '❌'
    };
    return icons[status] || '📋';
  }
};

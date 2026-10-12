// ============================================
// AUTHENTICATION MODULE
// ============================================

const Auth = {
  // Current logged in user
  getCurrentUser() {
    const userId = localStorage.getItem('fd_current_user');
    if (!userId) return null;
    return DB.findById('users', userId);
  },

  // Current logged in admin
  getCurrentAdmin() {
    const adminId = localStorage.getItem('fd_current_admin');
    if (!adminId) return null;
    return DB.findById('admins', adminId);
  },

  // User login
  login(email, password) {
    const user = DB.findByField('users', 'email', email);
    if (!user) return { success: false, message: 'User not found' };
    if (user.password !== password) return { success: false, message: 'Invalid password' };
    if (!user.isActive) return { success: false, message: 'Account is blocked' };
    localStorage.setItem('fd_current_user', user.id);
    return { success: true, user };
  },

  // User signup
  signup(name, email, phone, password) {
    const existing = DB.findByField('users', 'email', email);
    if (existing) return { success: false, message: 'Email already registered' };
    const user = DB.insert('users', {
      name,
      email,
      phone,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff6b35&color=fff`,
      addresses: [],
      favorites: [],
      notifications: true,
      isActive: true
    });
    localStorage.setItem('fd_current_user', user.id);
    return { success: true, user };
  },

  // Admin login
  adminLogin(email, password) {
    const admin = DB.findByField('admins', 'email', email);
    if (!admin) return { success: false, message: 'Admin not found' };
    if (admin.password !== password) return { success: false, message: 'Invalid password' };
    localStorage.setItem('fd_current_admin', admin.id);
    return { success: true, admin };
  },

  // Logout
  logout() {
    localStorage.removeItem('fd_current_user');
    window.location.href = 'index.html';
  },

  adminLogout() {
    localStorage.removeItem('fd_current_admin');
    window.location.href = 'admin-login.html';
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  // Check if admin is logged in
  isAdminLoggedIn() {
    return !!this.getCurrentAdmin();
  },

  // Require auth - redirect if not logged in
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },

  // Require admin - redirect if not logged in
  requireAdmin() {
    if (!this.isAdminLoggedIn()) {
      window.location.href = 'admin-login.html';
    }
  },

  // Redirect if already logged in
  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = 'home.html';
    }
  },

  redirectIfAdminLoggedIn() {
    if (this.isAdminLoggedIn()) {
      window.location.href = 'admin-dashboard.html';
    }
  }
};

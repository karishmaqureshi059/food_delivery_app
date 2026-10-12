import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import Toast from '../components/common/Toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminLayout = () => {
  const { user, loading, isAdmin, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Verifying administrative access..." />;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Get current page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard Overview';
    if (path.includes('/orders')) return 'Order Management';
    if (path.includes('/restaurants')) return 'Restaurant Management';
    if (path.includes('/food')) return 'Menu & Food Catalog';
    if (path.includes('/users')) return 'Customer Accounts';
    if (path.includes('/delivery-partners')) return 'Delivery Fleet';
    if (path.includes('/payments')) return 'Financial Transactions';
    if (path.includes('/reviews')) return 'Review Moderation';
    if (path.includes('/coupons')) return 'Coupons & Promotions';
    if (path.includes('/notifications')) return 'Push Notifications';
    if (path.includes('/reports')) return 'System Reports & Export';
    if (path.includes('/revenue')) return 'Revenue & Business Analytics';
    if (path.includes('/settings')) return 'Platform Settings';
    return 'Admin Center';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminHeader title={getPageTitle()} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
};

export default AdminLayout;

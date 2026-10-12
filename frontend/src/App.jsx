import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import LandingPage from './pages/user/LandingPage';
import HomePage from './pages/user/HomePage';
import RestaurantsPage from './pages/user/RestaurantsPage';
import RestaurantDetailPage from './pages/user/RestaurantDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import PaymentSuccessPage from './pages/user/PaymentSuccessPage';
import PaymentFailedPage from './pages/user/PaymentFailedPage';
import OrdersPage from './pages/user/OrdersPage';
import OrderTrackingPage from './pages/user/OrderTrackingPage';
import ProfilePage from './pages/user/ProfilePage';
import LoginPage from './pages/user/LoginPage';
import SignupPage from './pages/user/SignupPage';
import ForgotPasswordPage from './pages/user/ForgotPasswordPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage';
import AdminFoodPage from './pages/admin/AdminFoodPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminPartnersPage from './pages/admin/AdminPartnersPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminRevenuePage from './pages/admin/AdminRevenuePage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* User Storefront Routes */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-success/:orderId" element={<PaymentSuccessPage />} />
              <Route path="/payment-failed" element={<PaymentFailedPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/track/:orderId" element={<OrderTrackingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Admin Standalone Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Dashboard Protected Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="restaurants" element={<AdminRestaurantsPage />} />
              <Route path="food" element={<AdminFoodPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="delivery-partners" element={<AdminPartnersPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="revenue" element={<AdminRevenuePage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;

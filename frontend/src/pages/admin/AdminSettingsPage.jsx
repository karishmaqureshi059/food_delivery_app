import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Settings, Shield, Lock, DollarSign, Bell, Globe, Save } from 'lucide-react';

const AdminSettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotification();

  // Profile Form
  const [name, setName] = useState(user?.name || 'Admin Manager');
  const [email] = useState(user?.email || 'admin@foodhub.com');
  const [phone, setPhone] = useState(user?.phone || '+1-555-0199');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Application Settings
  const [appName, setAppName] = useState('FoodExpress');
  const [supportEmail, setSupportEmail] = useState('support@foodexpress.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Financial Settings
  const [commissionRate, setCommissionRate] = useState(15);
  const [taxRate, setTaxRate] = useState(8);
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState(40);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone });
      addToast('Admin profile updated', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'warning');
      return;
    }
    addToast('Admin password updated successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveAppSettings = (e) => {
    e.preventDefault();
    addToast('System application settings saved', 'success');
  };

  const handleSaveFinancialSettings = (e) => {
    e.preventDefault();
    addToast('Payment and tax configurations updated', 'success');
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Platform Configuration & Settings</h2>
        <p style={{ marginTop: '0.2rem' }}>Configure administrator credentials, commission structures, and platform operational modes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Card 1: Admin Profile */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={18} color="var(--primary)" /> Administrator Profile
          </h3>

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email (Primary)</label>
              <input
                type="email"
                className="form-control"
                value={email}
                disabled
                style={{ background: '#f8fafc' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={14} /> Update Profile
            </button>
          </form>
        </div>

        {/* Card 2: Security & Change Password */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={18} color="var(--primary)" /> Security & Password
          </h3>

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary btn-sm">
              <Lock size={14} /> Change Password
            </button>
          </form>
        </div>

        {/* Card 3: Platform Settings */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Globe size={18} color="var(--primary)" /> Platform Operations
          </h3>

          <form onSubmit={handleSaveAppSettings}>
            <div className="form-group">
              <label className="form-label">Application Branding Name</label>
              <input
                type="text"
                className="form-control"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Public Support Email</label>
              <input
                type="email"
                className="form-control"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                />
                <span>Maintenance Mode (Temporarily pause customer checkout)</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={14} /> Save Operations Settings
            </button>
          </form>
        </div>

        {/* Card 4: Financial & Commission Rules */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={18} color="var(--primary)" /> Commission & Taxation
          </h3>

          <form onSubmit={handleSaveFinancialSettings}>
            <div className="form-group">
              <label className="form-label">Platform Restaurant Commission (%)</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Applicable VAT / Sales Tax (%)</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Base Delivery Charge (₹)</label>
              <input
                type="number"
                step="1"
                className="form-control"
                value={defaultDeliveryFee}
                onChange={(e) => setDefaultDeliveryFee(parseFloat(e.target.value))}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={14} /> Save Financial Rules
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

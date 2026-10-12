import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Shield, Lock, Mail, KeyRound, CheckCircle, ArrowRight } from 'lucide-react';

const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@foodhub.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);

  // Security captcha math challenge (e.g., 5 + 3 = 8)
  const [num1] = useState(6);
  const [num2] = useState(7);
  const [captchaAnswer, setCaptchaAnswer] = useState('13');
  const [requireOtp, setRequireOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');

  const [loading, setLoading] = useState(false);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    // Verify Captcha
    if (parseInt(captchaAnswer) !== num1 + num2) {
      addToast('Security CAPTCHA verification failed. Please calculate correctly.', 'error');
      return;
    }

    if (requireOtp && otpCode !== '123456') {
      addToast('Invalid admin 2FA OTP code. Demo OTP: 123456', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        addToast(`Admin Session Authenticated! Welcome, ${res.user.name}.`, 'success');
        navigate('/admin');
      }
    } catch (err) {
      addToast(err.message || 'Invalid administrative credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem'
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '460px',
          width: '100%',
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #334155',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ff7a45, #ff5621)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#fff',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Shield size={32} />
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>Admin Control Center</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>
            Restricted access for platform administrators only.
          </p>
        </div>

        <form onSubmit={handleAdminSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Admin Username / Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-control"
                style={{ background: '#0f172a', borderColor: '#334155', color: '#fff', paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@foodhub.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-control"
                style={{ background: '#0f172a', borderColor: '#334155', color: '#fff', paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                required
              />
            </div>
          </div>

          {/* Security Math CAPTCHA */}
          <div className="form-group" style={{ background: '#0f172a', padding: '0.85rem', borderRadius: '10px', border: '1px solid #334155' }}>
            <label className="form-label" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              Security Challenge: What is {num1} + {num2}?
            </label>
            <input
              type="number"
              className="form-control"
              style={{ background: '#1e293b', borderColor: '#475569', color: '#fff' }}
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder="Enter sum"
              required
            />
          </div>

          {/* 2FA OTP Toggle */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <input
                type="checkbox"
                checked={requireOtp}
                onChange={(e) => setRequireOtp(e.target.checked)}
              />
              <span>Enable 2FA OTP Security Verification (Demo: 123456)</span>
            </label>

            {requireOtp && (
              <div style={{ marginTop: '0.75rem' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: '#0f172a', borderColor: '#334155', color: '#fff', letterSpacing: '3px', fontWeight: 700 }}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                />
              </div>
            )}
          </div>

          {/* Remember me & Forgot Password */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#94a3b8' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember session
            </label>
            <span
              style={{ color: '#ff7a45', cursor: 'pointer' }}
              onClick={() => addToast('Admin password reset link sent to registered server administrator.', 'info')}
            >
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? 'Verifying Admin Access...' : 'Authenticate Admin Session'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid #334155', paddingTop: '1.25rem' }}>
          <Link to="/home" style={{ color: '#38bdf8', fontSize: '0.85rem' }}>
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

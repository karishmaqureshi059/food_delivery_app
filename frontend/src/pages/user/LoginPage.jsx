import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Lock, Mail, Phone, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import api from '../../services/api';

const LoginPage = () => {
  const { login, verifyOtpLogin, loginWithGoogle } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/home';

  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'otp'
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');

  // OTP Login State
  const [phone, setPhone] = useState('+1-555-0144');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate(redirect);
      }
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) {
      addToast('Please enter your mobile number', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/otp-request', { phone });
      if (res.success) {
        setOtpSent(true);
        setOtpCode(res.demoOtp || '123456');
        addToast(`Demo OTP generated: ${res.demoOtp || '123456'}`, 'info');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtpLogin({ phone, otp: otpCode });
      if (res.success) {
        addToast('OTP verified successfully! Welcome to FoodExpress.', 'success');
        navigate(redirect);
      }
    } catch (err) {
      addToast(err.message || 'Invalid OTP code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMockLogin = async () => {
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        addToast(`Logged in as Google user: ${res.user.name}`, 'success');
        navigate(redirect);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.25rem 5rem', maxWidth: '480px' }}>
      <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍔</div>
          <h2 style={{ fontSize: '1.8rem' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            Sign in to access saved addresses and track live orders.
          </p>
        </div>

        {/* Tab switch between Password & Mobile OTP */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-alt)',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}
        >
          <button
            type="button"
            className="btn btn-sm"
            style={{
              flex: 1,
              background: authMethod === 'password' ? '#fff' : 'transparent',
              color: authMethod === 'password' ? 'var(--primary)' : '#64748b',
              boxShadow: authMethod === 'password' ? 'var(--shadow-sm)' : 'none'
            }}
            onClick={() => setAuthMethod('password')}
          >
            Email & Password
          </button>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              flex: 1,
              background: authMethod === 'otp' ? '#fff' : 'transparent',
              color: authMethod === 'otp' ? 'var(--primary)' : '#64748b',
              boxShadow: authMethod === 'otp' ? 'var(--shadow-sm)' : 'none'
            }}
            onClick={() => setAuthMethod('otp')}
          >
            Mobile Number OTP
          </button>
        </div>

        {/* Form 1: Password Login */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '1.25rem' }}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Form 2: OTP Login */}
        {authMethod === 'otp' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1-555-0144"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                  {loading ? 'Sending Code...' : 'Get OTP Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="form-group">
                  <label className="form-label">Enter 6-Digit Verification Code</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '2.5rem', letterSpacing: '4px', fontSize: '1.1rem', fontWeight: 700 }}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      required
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>
                    Demo OTP is automatically filled: 123456
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP & Log In'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' }}
                    onClick={() => setOtpSent(false)}
                  >
                    Change phone number
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Google Mock Login Button */}
        <button
          type="button"
          className="btn btn-outline btn-block"
          onClick={handleGoogleMockLogin}
          style={{ gap: '0.75rem', fontWeight: 600 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        {/* Footer Link */}
        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

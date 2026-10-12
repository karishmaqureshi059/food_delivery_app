import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🍔</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                FoodExpress
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '320px', marginBottom: '1.5rem' }}>
              Delicious meals from the finest local restaurants, delivered fresh and hot to your doorstep in minutes.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ padding: '0.4rem 0.6rem', background: '#1e293b', borderRadius: '6px', fontSize: '0.85rem' }}>⚡ 30 Min Delivery</span>
              <span style={{ padding: '0.4rem 0.6rem', background: '#1e293b', borderRadius: '6px', fontSize: '0.85rem' }}>🔒 Secure Checkout</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1.25rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><Link to="/home">Browse Home</Link></li>
              <li><Link to="/restaurants">All Restaurants</Link></li>
              <li><Link to="/restaurants?category=Pizza">Pizza Delivery</Link></li>
              <li><Link to="/restaurants?category=Burgers">Burgers & Shakes</Link></li>
              <li><Link to="/restaurants?category=Healthy">Healthy Bowls</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1.25rem' }}>Customer Help</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><Link to="/profile">Track My Order</Link></li>
              <li><Link to="/profile">Saved Addresses</Link></li>
              <li><Link to="/profile">FAQ & Support</Link></li>
              <li><Link to="/profile">Refund Policy</Link></li>
              <li><Link to="/admin/login">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1.25rem' }}>Contact & Hours</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              support@foodexpress.com
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
              +1 (800) 555-FOOD
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Service Hours: 8:00 AM - Midnight Daily
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FoodExpress Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/profile">Privacy Policy</Link>
            <Link to="/profile">Terms of Service</Link>
            <Link to="/admin/login">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

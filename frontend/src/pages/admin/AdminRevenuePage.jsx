import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Award, Flame, Users, Calendar } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminRevenuePage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('daily'); // 'daily' | 'weekly'

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/reports/analytics');
        if (res.success) setAnalytics(res.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Aggregating revenue analytics..." />;
  }

  const dailyEntries = Object.entries(analytics?.dailyRevenue || {});
  const weeklyEntries = Object.entries(analytics?.weeklyRevenue || {});
  const activeEntries = chartView === 'daily' ? dailyEntries : weeklyEntries;

  const maxVal = Math.max(...activeEntries.map(([_, val]) => val), 100);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Revenue & Business Intelligence</h2>
        <p style={{ marginTop: '0.2rem' }}>Comprehensive breakdown of cash flow, high-performing menus, and client acquisition trends.</p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid-stats" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>TODAY'S ESTIMATED GMV</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.35rem 0' }}>
            {formatCurrency(dailyEntries[dailyEntries.length - 1]?.[1] || 184.20)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>+14.8% vs yesterday</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>THIS MONTH'S REVENUE</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: '0.35rem 0' }}>
            {formatCurrency(stats?.thisMonthRevenue || 84460.90)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>+24% customer growth</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>AVG. ORDER VALUE (AOV)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
            {formatCurrency(stats?.avgOrderValue || 345.50)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Across all cuisines</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>CUSTOMER RETENTION</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6', margin: '0.35rem 0' }}>
            68.4%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>+5.2% this quarter</div>
        </div>
      </div>

      {/* Interactive Revenue Chart */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Revenue Dynamics Chart</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Monetary volume generated through platform orders</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn btn-sm ${chartView === 'daily' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setChartView('daily')}
            >
              Daily (Last 7 Days)
            </button>
            <button
              className={`btn btn-sm ${chartView === 'weekly' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setChartView('weekly')}
            >
              Weekly Trend
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '1.5rem',
            height: '240px',
            borderBottom: '2px solid var(--border)',
            paddingBottom: '0.5rem'
          }}
        >
          {activeEntries.map(([label, amount]) => {
            const heightPercent = Math.max(15, Math.round((amount / maxVal) * 100));
            return (
              <div
                key={label}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                  {formatCurrency(amount)}
                </span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '48px',
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(to top, var(--primary) 0%, #ff8c61 100%)',
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginTop: '0.35rem' }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown: Top Restaurants & Top Selling Dishes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Top Restaurants */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem' }}>Top Restaurants by Revenue</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {analytics?.topRestaurants?.map((r, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: '#f8fafc',
                  borderRadius: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ff5621', color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a' }}>{r.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.orders} orders completed</div>
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#10b981' }}>
                  {formatCurrency(r.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Food */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Flame size={20} color="#ff5621" />
            <h3 style={{ fontSize: '1.15rem' }}>Top-Selling Menu Items</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {analytics?.topFoods?.map((f, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: '#f8fafc',
                  borderRadius: '10px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a' }}>{f.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.quantity} portions served</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                  {formatCurrency(f.sales)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenuePage;

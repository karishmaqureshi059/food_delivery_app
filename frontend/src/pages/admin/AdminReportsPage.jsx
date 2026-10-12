import React, { useState, useEffect } from 'react';
import { Download, FileBarChart, Calendar, Filter } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminReportsPage = () => {
  const [reportType, setReportType] = useState('sales'); // 'sales' | 'orders' | 'users' | 'restaurants' | 'payments'
  const [dateRange, setDateRange] = useState('all'); // 'today' | '7days' | 'month' | 'all'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/export?type=${reportType}&range=${dateRange}`);
      if (res.success) {
        setData(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [reportType, dateRange]);

  const exportToCSV = () => {
    if (data.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'sales' || reportType === 'orders') {
      csvContent += 'OrderNumber,Customer,Restaurant,Total,Status,Date\n';
      data.forEach((row) => {
        csvContent += `"${row.orderNumber}","${row.userId?.name || ''}","${row.restaurantId?.name || ''}","${row.total}","${row.orderStatus}","${row.createdAt}"\n`;
      });
    } else if (reportType === 'users') {
      csvContent += 'Name,Email,Phone,Role,Status,JoinedDate\n';
      data.forEach((row) => {
        csvContent += `"${row.name}","${row.email}","${row.phone}","${row.role}","${row.isBlocked ? 'Blocked' : 'Active'}","${row.createdAt}"\n`;
      });
    } else if (reportType === 'restaurants') {
      csvContent += 'Name,Cuisine,Rating,DeliveryFee,MinOrder,Status\n';
      data.forEach((row) => {
        csvContent += `"${row.name}","${Array.isArray(row.cuisine) ? row.cuisine.join(';') : row.cuisine}","${row.rating}","${row.deliveryFee}","${row.minOrder}","${row.isActive ? 'Active' : 'Inactive'}"\n`;
      });
    } else if (reportType === 'payments') {
      csvContent += 'TransactionId,Customer,Amount,Method,Status,Date\n';
      data.forEach((row) => {
        csvContent += `"${row.transactionId}","${row.userId?.name || ''}","${row.amount}","${row.method}","${row.status}","${row.createdAt}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `foodexpress_${reportType}_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>System Intelligence & Reports</h2>
          <p style={{ marginTop: '0.2rem' }}>Generate consolidated business audit logs and export dataset files.</p>
        </div>
        <button className="btn btn-primary" onClick={exportToCSV} disabled={data.length === 0}>
          <Download size={16} /> Export to CSV ({data.length} records)
        </button>
      </div>

      {/* Control Tabs */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'sales', label: '📊 Sales Report' },
            { id: 'orders', label: '📦 Orders Report' },
            { id: 'users', label: '👥 User Growth' },
            { id: 'restaurants', label: '🏪 Restaurants Report' },
            { id: 'payments', label: '💳 Payment Ledger' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`btn btn-sm ${reportType === tab.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setReportType(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} color="#64748b" />
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today Only</option>
            <option value="7days">Last 7 Days</option>
            <option value="month">Current Month</option>
            <option value="all">All Historical Time</option>
          </select>
        </div>
      </div>

      {/* Report Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Querying dataset records..." />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                {(reportType === 'sales' || reportType === 'orders') && (
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Revenue</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                )}
                {reportType === 'users' && (
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Account Status</th>
                    <th>Joined</th>
                  </tr>
                )}
                {reportType === 'restaurants' && (
                  <tr>
                    <th>Restaurant</th>
                    <th>Cuisine</th>
                    <th>Rating</th>
                    <th>Delivery Fee</th>
                    <th>Min Order</th>
                    <th>Status</th>
                  </tr>
                )}
                {reportType === 'payments' && (
                  <tr>
                    <th>Transaction</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No data records for selected period</td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row._id}>
                      {(reportType === 'sales' || reportType === 'orders') && (
                        <>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>#{row.orderNumber}</td>
                          <td>{row.userId?.name || 'Customer'}</td>
                          <td>{row.restaurantId?.name || 'Restaurant'}</td>
                          <td style={{ fontWeight: 800 }}>{formatCurrency(row.total)}</td>
                          <td><span className="badge badge-default">{row.orderStatus}</span></td>
                          <td>{formatDate(row.createdAt)}</td>
                        </>
                      )}
                      {reportType === 'users' && (
                        <>
                          <td style={{ fontWeight: 700 }}>{row.name}</td>
                          <td>{row.email}</td>
                          <td>{row.phone}</td>
                          <td><span className="badge badge-default">{row.role}</span></td>
                          <td>
                            <span className={`badge ${row.isBlocked ? 'badge-danger' : 'badge-success'}`}>
                              {row.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td>{formatDate(row.createdAt)}</td>
                        </>
                      )}
                      {reportType === 'restaurants' && (
                        <>
                          <td style={{ fontWeight: 700 }}>{row.name}</td>
                          <td>{Array.isArray(row.cuisine) ? row.cuisine.join(', ') : row.cuisine}</td>
                          <td>★ {row.rating}</td>
                          <td>{formatCurrency(row.deliveryFee)}</td>
                          <td>{formatCurrency(row.minOrder)}</td>
                          <td><span className={`badge ${row.isActive ? 'badge-success' : 'badge-default'}`}>{row.isActive ? 'Active' : 'Inactive'}</span></td>
                        </>
                      )}
                      {reportType === 'payments' && (
                        <>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{row.transactionId}</td>
                          <td>{row.userId?.name || 'Customer'}</td>
                          <td style={{ fontWeight: 800 }}>{formatCurrency(row.amount)}</td>
                          <td>{row.method?.toUpperCase()}</td>
                          <td><span className={`badge ${row.status === 'success' ? 'badge-success' : 'badge-default'}`}>{row.status}</span></td>
                          <td>{formatDate(row.createdAt)}</td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;

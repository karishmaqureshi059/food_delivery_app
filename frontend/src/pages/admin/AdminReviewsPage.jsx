import React, { useState, useEffect } from 'react';
import { Star, Flag, Trash2, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RatingStars from '../../components/common/RatingStars';
import { useNotification } from '../../context/NotificationContext';

const AdminReviewsPage = () => {
  const { addToast } = useNotification();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [reportedOnly, setReportedOnly] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (reportedOnly) queryParams.set('reportedOnly', 'true');

      const res = await api.get(`/reviews?${queryParams.toString()}`);
      if (res.success) setReviews(res.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [reportedOnly]);

  const handleToggleReport = async (id) => {
    try {
      const res = await api.put(`/reviews/${id}/report`);
      if (res.success) {
        addToast(res.message, 'info');
        fetchReviews();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) return;
    try {
      const res = await api.delete(`/reviews/${id}`);
      if (res.success) {
        addToast('Review deleted successfully', 'success');
        fetchReviews();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Reviews & Moderation</h2>
          <p style={{ marginTop: '0.2rem' }}>Monitor customer reviews, flag inappropriate content, and maintain quality standards.</p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by customer name, restaurant or review text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchReviews()}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <button
          className={`btn btn-sm ${reportedOnly ? 'btn-danger' : 'btn-outline'}`}
          onClick={() => setReportedOnly(!reportedOnly)}
        >
          <Flag size={14} /> Reported Only
        </button>
      </div>

      {/* Reviews Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading customer feedback..." />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Rating</th>
                  <th>Review Comment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No reviews found</td>
                  </tr>
                ) : (
                  reviews.map((rev) => (
                    <tr key={rev._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{rev.userName}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{rev.restaurantName || 'Restaurant'}</td>
                      <td>
                        <RatingStars rating={rev.rating} size={14} />
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <div style={{ fontSize: '0.875rem', color: '#334155' }}>"{rev.review}"</div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {formatDate(rev.createdAt)}
                      </td>
                      <td>
                        <span className={`badge ${rev.isReported ? 'badge-danger' : 'badge-success'}`}>
                          {rev.isReported ? 'Flagged Inappropriate' : 'Published'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className={`btn btn-sm ${rev.isReported ? 'btn-outline' : 'btn-outline-primary'}`}
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                            onClick={() => handleToggleReport(rev._id)}
                            title={rev.isReported ? 'Remove flag' : 'Flag inappropriate'}
                          >
                            <Flag size={13} /> {rev.isReported ? 'Unflag' : 'Report'}
                          </button>

                          <button
                            className="btn btn-outline btn-icon"
                            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                            onClick={() => handleDelete(rev._id)}
                            title="Remove review"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
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

export default AdminReviewsPage;

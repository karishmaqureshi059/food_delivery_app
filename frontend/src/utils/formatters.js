export const formatCurrency = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'New Order':
      return 'badge-info';
    case 'Confirmed':
      return 'badge-primary';
    case 'Preparing':
      return 'badge-warning';
    case 'Ready for Pickup':
      return 'badge-secondary';
    case 'Out for Delivery':
      return 'badge-accent';
    case 'Delivered':
      return 'badge-success';
    case 'Cancelled':
      return 'badge-danger';
    default:
      return 'badge-default';
  }
};

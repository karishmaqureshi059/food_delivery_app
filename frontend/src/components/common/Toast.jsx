import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-success" color="#10b981" />;
      case 'error':
        return <AlertCircle size={18} className="text-danger" color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-warning" color="#f59e0b" />;
      default:
        return <Info size={18} className="text-info" color="#3b82f6" />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {getIcon(toast.type)}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;

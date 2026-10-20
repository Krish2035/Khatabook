import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';

const Toast = () => {
  const { toast } = useTransactions();
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(244, 63, 94, 0.95)',
        color: '#ffffff',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        animation: 'fadeIn 0.3s ease-out',
        fontWeight: 500,
        fontSize: '0.9rem',
      }}
    >
      {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span>{toast.message}</span>
    </div>
  );
};

export default Toast;

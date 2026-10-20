import React from 'react';
import Modal from '../common/Modal';
import { useCurrency } from '../../context/CurrencyContext';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, transaction }) => {
  const { format } = useCurrency();

  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Transaction" maxWidth="440px">
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-expense-subtle)',
            color: 'var(--color-expense)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            border: '1px solid rgba(244, 63, 94, 0.3)',
          }}
        >
          <AlertTriangle size={26} />
        </div>

        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Are you sure you want to delete this?
        </h4>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          This will permanently remove <strong style={{ color: 'var(--text-primary)' }}>"{transaction.title}"</strong> ({format(transaction.amount)}) from your ledger.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.65rem 1rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(transaction.id);
              onClose();
            }}
            className="btn btn-danger"
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              background: 'var(--color-expense)',
              color: '#ffffff',
              fontWeight: 700,
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;

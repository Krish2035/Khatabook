import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useCurrency } from '../../context/CurrencyContext';
import { useTransactions } from '../../context/TransactionContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_MODES } from '../../utils/formatters';
import { PlusCircle, ArrowUpRight, ArrowDownLeft, Calendar, Tag, CreditCard, AlignLeft } from 'lucide-react';

const TransactionFormModal = ({ isOpen, onClose, initialData = null }) => {
  const { currencyObj } = useCurrency();
  const { addTransaction, updateTransaction, selectedYear, selectedMonth } = useTransactions();

  const isEdit = Boolean(initialData);

  const getInitialDate = () => {
    if (initialData?.date) return initialData.date;
    const now = new Date();
    // Default to the selected month & year
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(selectedMonth).padStart(2, '0');
    return `${selectedYear}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'EXPENSE',
    category: EXPENSE_CATEGORIES[0].name,
    paymentMode: 'UPI',
    date: getInitialDate(),
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'EXPENSE',
        category: initialData.category || EXPENSE_CATEGORIES[0].name,
        paymentMode: initialData.paymentMode || 'Cash',
        date: initialData.date || getInitialDate(),
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'EXPENSE',
        category: EXPENSE_CATEGORIES[0].name,
        paymentMode: 'UPI',
        date: getInitialDate(),
        notes: '',
      });
    }
    setError('');
  }, [initialData, isOpen, selectedYear, selectedMonth]);

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: newType === 'EXPENSE' ? EXPENSE_CATEGORIES[0].name : INCOME_CATEGORIES[0].name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a description/title');
      return;
    }
    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateTransaction(initialData.id, formData);
      } else {
        await addTransaction(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const currentCategories = formData.type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Transaction' : 'Record New Transaction'}
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-expense-subtle)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--color-expense)',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Transaction Type Segmented Toggle */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: 'var(--bg-surface)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => handleTypeChange('EXPENSE')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              backgroundColor: formData.type === 'EXPENSE' ? 'var(--color-expense)' : 'transparent',
              color: formData.type === 'EXPENSE' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowDownLeft size={17} />
            <span>Expense</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('INCOME')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              backgroundColor: formData.type === 'INCOME' ? 'var(--color-income)' : 'transparent',
              color: formData.type === 'INCOME' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowUpRight size={17} />
            <span>Income</span>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            Amount ({currencyObj.code})
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                position: 'absolute',
                left: '1rem',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: formData.type === 'EXPENSE' ? 'var(--color-expense)' : 'var(--color-income)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {currencyObj.symbol}
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input"
              style={{
                paddingLeft: '2.5rem',
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            Title / Payee
          </label>
          <input
            type="text"
            required
            placeholder={formData.type === 'EXPENSE' ? 'e.g. Grocery at Supermarket' : 'e.g. Client Consultancy Payment'}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
          />
        </div>

        {/* Category & Payment Mode Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <Tag size={14} />
              <span>Category</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="select"
            >
              {currentCategories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <CreditCard size={14} />
              <span>Payment Mode</span>
            </label>
            <select
              value={formData.paymentMode}
              onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
              className="select"
            >
              {PAYMENT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            <Calendar size={14} />
            <span>Transaction Date</span>
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input"
          />
        </div>

        {/* Notes (Optional) */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            <AlignLeft size={14} />
            <span>Notes (Optional)</span>
          </label>
          <textarea
            rows="2"
            placeholder="Add any extra details or reference tags..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="textarea"
          />
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={submitting}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{
              background: formData.type === 'EXPENSE'
                ? 'linear-gradient(135deg, #f43f5e, #e11d48)'
                : 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: formData.type === 'EXPENSE'
                ? '0 4px 14px var(--color-expense-glow)'
                : '0 4px 14px var(--color-income-glow)',
            }}
          >
            {submitting ? 'Saving...' : (isEdit ? 'Update Transaction' : 'Save Transaction')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;

import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate, getCategoryColor } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, Edit2, Trash2, Tag, CreditCard } from 'lucide-react';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { format } = useCurrency();
  const isIncome = transaction.type === 'INCOME';
  const categoryColor = getCategoryColor(transaction.category);

  return (
    <div
      className="glass-card transaction-item-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        marginBottom: '0.65rem',
        borderRadius: 'var(--radius-sm)',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      {/* Left: Icon & Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isIncome ? 'var(--color-income-subtle)' : 'var(--color-expense-subtle)',
            color: isIncome ? 'var(--color-income)' : 'var(--color-expense)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${isIncome ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
            flexShrink: 0,
          }}
        >
          {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {transaction.title}
            </span>
            {/* Category Badge */}
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: `color-mix(in srgb, ${categoryColor} 15%, transparent)`,
                color: categoryColor,
                border: `1px solid color-mix(in srgb, ${categoryColor} 30%, transparent)`,
              }}
            >
              {transaction.category}
            </span>
            {/* Payment Mode */}
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <CreditCard size={11} />
              {transaction.paymentMode}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {formatDate(transaction.date)}
            </span>
            {transaction.notes && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  maxWidth: '300px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                • {transaction.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Amount & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: isIncome ? 'var(--color-income)' : 'var(--color-expense)',
            }}
          >
            {isIncome ? `+ ${format(transaction.amount)}` : `- ${format(transaction.amount)}`}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => onEdit(transaction)}
            className="btn btn-ghost btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(transaction)}
            className="btn btn-ghost btn-icon"
            style={{ width: '32px', height: '32px', color: 'var(--color-expense)' }}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;

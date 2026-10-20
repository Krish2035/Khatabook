import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const CategoryDiffBar = ({ item }) => {
  const { format } = useCurrency();
  const { category, m1Amount, m2Amount, diff, percentDiff } = item;

  const isIncrease = diff > 0;
  const isDecrease = diff < 0;
  const isNeutral = diff === 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '0.5rem',
      }}
    >
      {/* Category Name & Comparison values */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          {category}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          <span>{format(m1Amount)}</span>
          <span style={{ margin: '0 0.5rem' }}>➔</span>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{format(m2Amount)}</span>
        </div>
      </div>

      {/* Delta Amount & Percentage Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: isIncrease ? 'var(--color-expense)' : isDecrease ? 'var(--color-income)' : 'var(--text-muted)',
            }}
          >
            {isIncrease ? `+ ${format(diff)}` : isDecrease ? `- ${format(Math.abs(diff))}` : format(0)}
          </div>
        </div>

        {/* % badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.25rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: isIncrease
              ? 'var(--color-expense-subtle)'
              : isDecrease
              ? 'var(--color-income-subtle)'
              : 'var(--bg-surface-elevated)',
            color: isIncrease
              ? 'var(--color-expense)'
              : isDecrease
              ? 'var(--color-income)'
              : 'var(--text-muted)',
            border: `1px solid ${
              isIncrease
                ? 'rgba(244, 63, 94, 0.25)'
                : isDecrease
                ? 'rgba(16, 185, 129, 0.25)'
                : 'var(--border-subtle)'
            }`,
            minWidth: '72px',
            justifyContent: 'center',
          }}
        >
          {isIncrease && <ArrowUpRight size={13} />}
          {isDecrease && <ArrowDownRight size={13} />}
          {isNeutral && <Minus size={13} />}
          <span>{isIncrease ? `+${percentDiff}%` : `${percentDiff}%`}</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryDiffBar;

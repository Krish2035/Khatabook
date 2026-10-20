import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

const StatCard = ({ title, amount, icon: Icon, color, trendText, isSavingsRate, progressPercent }) => {
  const { format } = useCurrency();

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top color accent border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: color,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '0.25rem',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.02em',
            }}
          >
            {isSavingsRate ? `${amount}%` : format(amount)}
          </div>
        </div>

        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-sm)',
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
          }}
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>

      {/* Progress or Trend Information */}
      {isSavingsRate && (
        <div style={{ marginTop: '0.25rem' }}>
          <div
            style={{
              height: '6px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, amount))}%`,
                background: color,
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {amount >= 30 ? '🚀 Healthy savings rate (>30%)' : '⚠️ Low savings rate (<30%)'}
          </span>
        </div>
      )}

      {trendText && !isSavingsRate && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>{trendText}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

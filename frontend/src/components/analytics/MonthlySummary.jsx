import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { getCategoryColor } from '../../utils/formatters';
import { Flame, Clock, Award, TrendingDown } from 'lucide-react';

const MonthlySummary = ({ summary }) => {
  const { format } = useCurrency();

  if (!summary) return null;

  const { expenseBreakdown = [], dailyAverage = 0, transactionCount = 0, totalExpense = 0 } = summary;

  // Top 5 categories
  const topCategories = expenseBreakdown.slice(0, 5);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Top Spending Categories</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highest budget allocation</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-warning)' }}>
          <Flame size={15} />
          <span>Burn Rate</span>
        </div>
      </div>

      {/* Daily Average Spend Mini-Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Clock size={16} color="var(--color-accent)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Daily Average Spend</span>
        </div>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {format(dailyAverage)} / day
        </span>
      </div>

      {/* Ranked Category Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {topCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No expenses recorded for this month.
          </div>
        ) : (
          topCategories.map((item, idx) => {
            const color = getCategoryColor(item.category);
            return (
              <div key={item.category}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        width: '18px',
                        height: '18px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {format(item.amount)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.percentage}%`,
                      backgroundColor: color,
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MonthlySummary;

import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';
import MonthComparisonChart from './MonthComparisonChart';
import CategoryDiffBar from './CategoryDiffBar';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';

const MONTHS = [
  { value: 1, name: 'January' },
  { value: 2, name: 'February' },
  { value: 3, name: 'March' },
  { value: 4, name: 'April' },
  { value: 5, name: 'May' },
  { value: 6, name: 'June' },
  { value: 7, name: 'July' },
  { value: 8, name: 'August' },
  { value: 9, name: 'September' },
  { value: 10, name: 'October' },
  { value: 11, name: 'November' },
  { value: 12, name: 'December' },
];

const MonthCompareView = () => {
  const { format } = useCurrency();
  const [m1, setM1] = useState(9); // Default Sept
  const [y1, setY1] = useState(2026);
  const [m2, setM2] = useState(10); // Default Oct
  const [y2, setY2] = useState(2026);

  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsApi.compareMonths({ y1, m1, y2, m2 });
      if (res.success) {
        setCompareData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch comparison');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [m1, y1, m2, y2]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Month Selection Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
            }}
          >
            <GitCompare size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Month-to-Month Expense Comparison</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Evaluate your spend changes, budget shifts, and savings growth
            </p>
          </div>
        </div>

        {/* Dual Selectors */}
        <div className="comparison-selectors" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Month 1 Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Base:</span>
            <select
              value={m1}
              onChange={(e) => setM1(Number(e.target.value))}
              className="select"
              style={{ width: '130px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              value={y1}
              onChange={(e) => setY1(Number(e.target.value))}
              className="select"
              style={{ width: '85px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <ArrowRight size={18} color="var(--text-muted)" />

          {/* Month 2 Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Compare to:</span>
            <select
              value={m2}
              onChange={(e) => setM2(Number(e.target.value))}
              className="select"
              style={{ width: '130px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              value={y2}
              onChange={(e) => setY2(Number(e.target.value))}
              className="select"
              style={{ width: '85px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Computing comparative analysis...
        </div>
      ) : compareData ? (
        <>
          {/* Key Delta Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Expense Variance */}
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--color-expense)' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Expense Variance
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: compareData.delta.expenseDiff > 0 ? 'var(--color-expense)' : 'var(--color-income)' }}>
                  {compareData.delta.expenseDiff > 0 ? `+${format(compareData.delta.expenseDiff)}` : format(compareData.delta.expenseDiff)}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: compareData.delta.expenseDiff > 0 ? 'var(--color-expense-subtle)' : 'var(--color-income-subtle)',
                    color: compareData.delta.expenseDiff > 0 ? 'var(--color-expense)' : 'var(--color-income)',
                  }}
                >
                  {compareData.delta.expensePercentDiff > 0 ? `+${compareData.delta.expensePercentDiff}%` : `${compareData.delta.expensePercentDiff}%`}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {compareData.period1.monthName}: {format(compareData.period1.totalExpense)} ➔ {compareData.period2.monthName}: {format(compareData.period2.totalExpense)}
              </p>
            </div>

            {/* Income Variance */}
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--color-income)' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Income Inflow Variance
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: compareData.delta.incomeDiff >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }}>
                  {compareData.delta.incomeDiff > 0 ? `+${format(compareData.delta.incomeDiff)}` : format(compareData.delta.incomeDiff)}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: compareData.delta.incomeDiff >= 0 ? 'var(--color-income-subtle)' : 'var(--color-expense-subtle)',
                    color: compareData.delta.incomeDiff >= 0 ? 'var(--color-income)' : 'var(--color-expense)',
                  }}
                >
                  {compareData.delta.incomePercentDiff > 0 ? `+${compareData.delta.incomePercentDiff}%` : `${compareData.delta.incomePercentDiff}%`}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {compareData.period1.monthName}: {format(compareData.period1.totalIncome)} ➔ {compareData.period2.monthName}: {format(compareData.period2.totalIncome)}
              </p>
            </div>

            {/* Net Balance Delta */}
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--color-accent)' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Net Savings Growth
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: compareData.delta.balanceDiff >= 0 ? 'var(--color-accent)' : 'var(--color-expense)' }}>
                  {compareData.delta.balanceDiff > 0 ? `+${format(compareData.delta.balanceDiff)}` : format(compareData.delta.balanceDiff)}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-elevated)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Savings Rate: {compareData.period2.savingsRate}%
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Net savings changed from {format(compareData.period1.netBalance)} to {format(compareData.period2.netBalance)}
              </p>
            </div>
          </div>

          {/* Automated Financial Insights Box */}
          {compareData.insights && compareData.insights.length > 0 && (
            <div
              className="glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} />
                <span>Smart Financial Insights</span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {compareData.insights.map((insight, idx) => (
                  <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Charts & Category Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
            {/* Side-by-Side Category Chart */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Side-by-Side Category Spend
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {compareData.period1.monthName} vs {compareData.period2.monthName}
              </p>
              <MonthComparisonChart
                categoryComparison={compareData.categoryComparison}
                m1Name={`${compareData.period1.monthName} (${compareData.period1.year})`}
                m2Name={`${compareData.period2.monthName} (${compareData.period2.year})`}
              />
            </div>

            {/* Category Delta List */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Category-by-Category Shift</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Which expenses surged or reduced
                  </p>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {compareData.categoryComparison.length} Categories
                </span>
              </div>

              <div style={{ maxHeight: '360px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {compareData.categoryComparison.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No common categories recorded.
                  </div>
                ) : (
                  compareData.categoryComparison.map((item) => (
                    <CategoryDiffBar key={item.category} item={item} />
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default MonthCompareView;

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useCurrency } from '../../context/CurrencyContext';
import { getCategoryColor } from '../../utils/formatters';
import { PieChart, AlertCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryExpenseChart = ({ breakdown = [], totalExpense = 0 }) => {
  const { format } = useCurrency();

  if (!breakdown || breakdown.length === 0) {
    return (
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <PieChart size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
        <p style={{ fontSize: '0.9rem' }}>No expense records in this month to chart.</p>
      </div>
    );
  }

  const labels = breakdown.map((item) => item.category);
  const dataValues = breakdown.map((item) => item.amount);
  const backgroundColors = breakdown.map((item) => getCategoryColor(item.category));

  const chartData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We render a customized legend below
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const percentage = totalExpense > 0 ? ((val / totalExpense) * 100).toFixed(1) : 0;
            return ` ${format(val)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '72%',
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Expense by Category</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Where your money goes</p>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {breakdown.length} Categories
        </span>
      </div>

      {/* Doughnut Chart Canvas with Center Text */}
      <div style={{ position: 'relative', height: '220px', width: '100%', marginBottom: '1.25rem' }}>
        <Doughnut data={chartData} options={chartOptions} />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Spend
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-expense)', fontFamily: 'var(--font-mono)' }}>
            {format(totalExpense)}
          </div>
        </div>
      </div>

      {/* Category Breakdown Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto' }}>
        {breakdown.map((item) => {
          const color = getCategoryColor(item.category);
          return (
            <div
              key={item.category}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: color,
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.category}</span>
              <span style={{ color: 'var(--text-muted)' }}>{item.percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryExpenseChart;

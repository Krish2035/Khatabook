import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useCurrency } from '../../context/CurrencyContext';
import { TrendingUp, BarChart2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CashFlowTrendChart = ({ dailyTrend = [] }) => {
  const { format, currencyObj } = useCurrency();

  if (!dailyTrend || dailyTrend.length === 0) {
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
        <BarChart2 size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
        <p style={{ fontSize: '0.9rem' }}>No daily transactions to plot trend yet.</p>
      </div>
    );
  }

  // Format labels like 'Oct 01', 'Oct 05'
  const labels = dailyTrend.map((d) => {
    const parts = d.date.split('-');
    return `${parts[1]}/${parts[2]}`;
  });

  const incomeData = dailyTrend.map((d) => d.income);
  const expenseData = dailyTrend.map((d) => d.expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#94a3b8',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${format(context.raw || 0)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (value) => `${currencyObj.symbol}${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`,
        },
      },
    },
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Daily Cash Flow Trend</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Inflows vs Outflows across the month
          </p>
        </div>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CashFlowTrendChart;

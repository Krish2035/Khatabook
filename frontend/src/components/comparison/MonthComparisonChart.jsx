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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthComparisonChart = ({ categoryComparison = [], m1Name = 'Month 1', m2Name = 'Month 2' }) => {
  const { format, currencyObj } = useCurrency();

  if (!categoryComparison || categoryComparison.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No category data available to compare.
      </div>
    );
  }

  const labels = categoryComparison.map((item) => item.category);
  const m1Data = categoryComparison.map((item) => item.m1Amount);
  const m2Data = categoryComparison.map((item) => item.m2Amount);

  const chartData = {
    labels,
    datasets: [
      {
        label: m1Name,
        data: m1Data,
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: m2Name,
        data: m2Data,
        backgroundColor: 'rgba(236, 72, 153, 0.85)',
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
        ticks: { color: '#94a3b8', font: { size: 11 } },
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
    <div style={{ height: '340px', width: '100%' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default MonthComparisonChart;

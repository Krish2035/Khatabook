import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import CurrencySelector from './CurrencySelector';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  LayoutDashboard,
  GitCompare,
  History,
  Calendar,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Navbar = ({ activeTab, setActiveTab, onOpenAddModal }) => {
  const { selectedMonth, selectedYear, changeMonth, setSpecificMonth } = useTransactions();

  return (
    <header
      className="glass-card"
      style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 100,
        marginBottom: '2rem',
        padding: '0.85rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--color-accent-glow)',
          }}
        >
          <BookOpen size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Khatabook
            </h1>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              Pro Ledger
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Expense & Income Intelligence
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          gap: '0.25rem',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          className="btn"
          style={{
            padding: '0.45rem 0.9rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'overview' ? 'var(--color-accent)' : 'transparent',
            color: activeTab === 'overview' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'overview' ? 700 : 500,
          }}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className="btn"
          style={{
            padding: '0.45rem 0.9rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'compare' ? 'var(--color-accent)' : 'transparent',
            color: activeTab === 'compare' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'compare' ? 700 : 500,
          }}
        >
          <GitCompare size={16} />
          <span>Compare Months</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className="btn"
          style={{
            padding: '0.45rem 0.9rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'transactions' ? 'var(--color-accent)' : 'transparent',
            color: activeTab === 'transactions' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'transactions' ? 700 : 500,
          }}
        >
          <History size={16} />
          <span>Transactions</span>
        </button>
      </nav>

      {/* Right Controls: Month Selector, Currency Selector, Add Transaction CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Month Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.15rem 0.25rem',
          }}
        >
          <button
            onClick={() => changeMonth(-1)}
            className="btn btn-ghost btn-icon"
            style={{ width: '28px', height: '28px' }}
            title="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            style={{
              padding: '0 0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              minWidth: '130px',
              justifyContent: 'center',
            }}
          >
            <Calendar size={14} color="var(--color-accent)" />
            <span>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</span>
          </div>

          <button
            onClick={() => changeMonth(1)}
            className="btn btn-ghost btn-icon"
            style={{ width: '28px', height: '28px' }}
            title="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Currency Switcher */}
        <CurrencySelector />

        {/* Add Entry CTA */}
        <button
          onClick={onOpenAddModal}
          className="btn btn-primary"
          style={{
            padding: '0.55rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <PlusCircle size={17} />
          <span>Add Entry</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

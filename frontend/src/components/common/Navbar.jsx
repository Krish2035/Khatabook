import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import CurrencySelector from './CurrencySelector';
import OfflineBadge from './OfflineBadge';
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
  const { selectedMonth, selectedYear, changeMonth } = useTransactions();

  return (
    <header
      className="glass-card navbar-container"
      style={{
        position: 'relative',
        zIndex: 10,
        marginBottom: '1.5rem',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {/* Top Row: Brand, Offline Status, Currency & Add Entry */}
      <div
        className="navbar-top-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--color-accent-glow)',
              flexShrink: 0,
            }}
          >
            <BookOpen size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Khatabook
              </h1>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              >
                PWA
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              Smart Ledger & Offline Sync
            </p>
          </div>
        </div>

        {/* Right side controls: Offline Badge, Month Selector, Currency & Add CTA */}
        <div
          className="navbar-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Offline / Sync Badge */}
          <OfflineBadge />

          {/* Month Selector */}
          <div
            className="navbar-month-picker"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.1rem 0.2rem',
            }}
          >
            <button
              onClick={() => changeMonth(-1)}
              className="btn btn-ghost btn-icon"
              style={{ width: '26px', height: '26px' }}
              title="Previous Month"
              aria-label="Previous Month"
            >
              <ChevronLeft size={15} />
            </button>

            <div
              style={{
                padding: '0 0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 700,
                fontSize: '0.825rem',
                color: 'var(--text-primary)',
                minWidth: '115px',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <Calendar size={13} color="var(--color-accent)" />
              <span>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</span>
            </div>

            <button
              onClick={() => changeMonth(1)}
              className="btn btn-ghost btn-icon"
              style={{ width: '26px', height: '26px' }}
              title="Next Month"
              aria-label="Next Month"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Currency Switcher */}
          <CurrencySelector />

          {/* Add Entry CTA */}
          <button
            onClick={onOpenAddModal}
            className="btn btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <PlusCircle size={16} />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Bottom Row / Navigation Tabs */}
      <nav
        className="navbar-tabs"
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          gap: '0.25rem',
          marginTop: '0.75rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          className="btn tab-btn"
          style={{
            flex: 1,
            padding: '0.45rem 0.75rem',
            fontSize: '0.825rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'overview' ? 'var(--color-accent)' : 'transparent',
            color: activeTab === 'overview' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            whiteSpace: 'nowrap',
          }}
        >
          <LayoutDashboard size={15} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className="btn tab-btn"
          style={{
            flex: 1,
            padding: '0.45rem 0.75rem',
            fontSize: '0.825rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'compare' ? 'var(--color-accent)' : 'transparent',
            color: activeTab === 'compare' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'compare' ? 700 : 500,
            whiteSpace: 'nowrap',
          }}
        >
          <GitCompare size={15} />
          <span>Compare Months</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className="btn tab-btn"
          style={{
            flex: 1,
            padding: '0.45rem 0.75rem',
            fontSize: '0.825rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'transactions' ? 'var(--color-accent)' : 'transparent',
            color: activeTab === 'transactions' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'transactions' ? 700 : 500,
            whiteSpace: 'nowrap',
          }}
        >
          <History size={15} />
          <span>Transactions</span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;

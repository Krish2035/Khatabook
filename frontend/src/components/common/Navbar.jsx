import React, { useState, useRef, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useAuth } from '../../context/AuthContext';
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
  LogIn,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Navbar = ({ activeTab, setActiveTab, onOpenAddModal, onOpenAuthModal }) => {
  const { selectedMonth, selectedYear, changeMonth } = useTransactions();
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      {/* Top Row: Brand, Offline Status, User Auth, Currency & Add Entry */}
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

        {/* Right side controls: Offline Badge, Month Selector, Currency, User Profile & Add CTA */}
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

          {/* User Profile / Auth CTA */}
          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'var(--color-accent)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <span style={{ fontSize: '0.825rem', fontWeight: 600, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} style={{ opacity: 0.7 }} />
              </button>

              {userDropdownOpen && (
                <div
                  className="glass-card animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    zIndex: 1000,
                    width: '220px',
                    backgroundColor: '#0f172a',
                    padding: '0.6rem',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  <div style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        marginTop: '0.3rem',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 'var(--radius-full)',
                        background: user.authProvider === 'google' ? 'rgba(66, 133, 244, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: user.authProvider === 'google' ? '#60a5fa' : '#818cf8',
                      }}
                    >
                      {user.authProvider === 'google' ? 'Google Account' : 'Email & Password'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: '0.5rem',
                      padding: '0.45rem 0.6rem',
                      color: 'var(--color-expense)',
                      fontSize: '0.825rem',
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="btn btn-secondary"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.825rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}

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

import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/formatters';
import { Search, Filter, X } from 'lucide-react';

const TransactionFilters = () => {
  const { filters, setFilters, pagination } = useTransactions();

  const handleTypeChange = (type) => {
    setFilters((prev) => ({ ...prev, type, page: 1 }));
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const allCategories = [...new Set([...EXPENSE_CATEGORIES.map((c) => c.name), ...INCOME_CATEGORIES.map((c) => c.name)])];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem',
        marginBottom: '1.25rem',
      }}
    >
      {/* Type Toggle Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: 'var(--bg-surface)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {['ALL', 'EXPENSE', 'INCOME'].map((t) => {
          const isActive = filters.type === t;
          let label = 'All';
          let activeBg = 'var(--bg-surface-elevated)';
          let activeColor = '#fff';

          if (t === 'EXPENSE') {
            label = 'Expenses';
            activeBg = 'var(--color-expense)';
          } else if (t === 'INCOME') {
            label = 'Income';
            activeBg = 'var(--color-income)';
          }

          return (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? activeBg : 'transparent',
                color: isActive ? activeColor : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Category filter & Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
        {/* Category Dropdown */}
        <div style={{ minWidth: '160px' }}>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="select"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
          >
            <option value="">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '220px', maxWidth: '320px', flex: 1 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleSearchChange}
            className="input"
            style={{ paddingLeft: '2.25rem', paddingRight: filters.search ? '2rem' : '0.85rem', paddingBlock: '0.45rem', fontSize: '0.825rem' }}
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Total Count Badge */}
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {pagination.totalItems} entries
        </span>
      </div>
    </div>
  );
};

export default TransactionFilters;

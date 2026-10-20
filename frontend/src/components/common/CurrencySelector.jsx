import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { ChevronDown, Check, Coins } from 'lucide-react';

const CurrencySelector = () => {
  const { currency, currencyObj, currencies, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}
        title="Change Display Currency"
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-income-subtle)',
            color: 'var(--color-income)',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          {currencyObj.symbol}
        </span>
        <span>{currencyObj.code}</span>
        <ChevronDown size={15} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <div
          className="glass-card animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 1000,
            width: '220px',
            backgroundColor: '#0f172a',
            padding: '0.4rem',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div
            style={{
              padding: '0.4rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '0.3rem',
            }}
          >
            Select Currency
          </div>
          {currencies.map((c) => {
            const isSelected = c.code === currency;
            return (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.5rem 0.7rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: isSelected ? 'var(--color-income)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--border-subtle)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      width: '22px',
                      color: isSelected ? 'var(--color-income)' : 'var(--text-secondary)',
                    }}
                  >
                    {c.symbol}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.code}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.name}</div>
                  </div>
                </div>
                {isSelected && <Check size={16} color="var(--color-income)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;

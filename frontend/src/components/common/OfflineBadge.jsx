import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

const OfflineBadge = () => {
  const { isOnline, pendingSyncCount, isSyncing } = useTransactions();

  if (isOnline && pendingSyncCount === 0 && !isSyncing) {
    return null; // All normal
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.85rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.78rem',
        fontWeight: 700,
        backgroundColor: !isOnline
          ? 'rgba(245, 158, 11, 0.15)'
          : isSyncing
          ? 'rgba(99, 102, 241, 0.15)'
          : 'rgba(16, 185, 129, 0.15)',
        color: !isOnline
          ? 'var(--color-warning)'
          : isSyncing
          ? 'var(--color-accent)'
          : 'var(--color-income)',
        border: `1px solid ${
          !isOnline
            ? 'rgba(245, 158, 11, 0.35)'
            : isSyncing
            ? 'rgba(99, 102, 241, 0.35)'
            : 'rgba(16, 185, 129, 0.35)'
        }`,
        transition: 'all 0.25s ease',
      }}
    >
      {!isOnline ? (
        <>
          <WifiOff size={14} />
          <span>Offline Mode ({pendingSyncCount} pending)</span>
        </>
      ) : isSyncing ? (
        <>
          <RefreshCw size={14} className="animate-spin" />
          <span>Syncing {pendingSyncCount} entries...</span>
        </>
      ) : (
        <>
          <CheckCircle2 size={14} />
          <span>Synced to Cloud</span>
        </>
      )}
    </div>
  );
};

export default OfflineBadge;

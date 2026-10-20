import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import TransactionItem from './TransactionItem';
import TransactionFilters from './TransactionFilters';
import { ChevronLeft, ChevronRight, Inbox, PlusCircle } from 'lucide-react';

const TransactionList = ({ onEdit, onAdd }) => {
  const { transactions, loading, pagination, filters, setFilters, deleteTransaction } = useTransactions();

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <TransactionFilters />

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="animate-fade-in" style={{ fontSize: '0.95rem' }}>
            Loading transactions...
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <Inbox size={28} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No transactions found
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              No income or expense records match your current filters.
            </p>
          </div>
          <button onClick={onAdd} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <PlusCircle size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      ) : (
        <div>
          {transactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onEdit={onEdit}
              onDelete={deleteTransaction}
            />
          ))}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="btn btn-secondary btn-icon"
                  style={{ width: '32px', height: '32px', opacity: pagination.hasPrevPage ? 1 : 0.4 }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="btn btn-secondary btn-icon"
                  style={{ width: '32px', height: '32px', opacity: pagination.hasNextPage ? 1 : 0.4 }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;

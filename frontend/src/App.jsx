import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { TransactionProvider, useTransactions } from './context/TransactionContext';
import Navbar from './components/common/Navbar';
import StatCard from './components/common/StatCard';
import Toast from './components/common/Toast';
import CategoryExpenseChart from './components/analytics/CategoryExpenseChart';
import CashFlowTrendChart from './components/analytics/CashFlowTrendChart';
import MonthlySummary from './components/analytics/MonthlySummary';
import MonthCompareView from './components/comparison/MonthCompareView';
import TransactionList from './components/transactions/TransactionList';
import TransactionFormModal from './components/transactions/TransactionFormModal';
import AuthModal from './components/auth/AuthModal';
import AuthPage from './components/auth/AuthPage';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const { summary, loading } = useTransactions();

  const handleOpenAdd = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const netBalance = summary?.netBalance || 0;
  const savingsRate = summary?.savingsRate || 0;

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAdd}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Overview & Analytics Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Key Metric Stat Cards */}
          <div
            className="stat-cards-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <StatCard
              title="Total Income"
              amount={totalIncome}
              icon={TrendingUp}
              color="var(--color-income)"
              trendText={`${summary?.transactionCount || 0} transactions this month`}
            />

            <StatCard
              title="Total Expenses"
              amount={totalExpense}
              icon={TrendingDown}
              color="var(--color-expense)"
              trendText={summary?.expenseBreakdown ? `${summary.expenseBreakdown.length} active spend categories` : ''}
            />

            <StatCard
              title="Net Balance"
              amount={netBalance}
              icon={Wallet}
              color={netBalance >= 0 ? 'var(--color-accent)' : 'var(--color-expense)'}
              trendText={netBalance >= 0 ? 'Surplus / Available balance' : 'Deficit / Over budget'}
            />

            <StatCard
              title="Savings Rate"
              amount={savingsRate}
              icon={PiggyBank}
              color="var(--color-warning)"
              isSavingsRate={true}
            />
          </div>

          {/* Interactive Visualizations Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <CategoryExpenseChart
              breakdown={summary?.expenseBreakdown || []}
              totalExpense={totalExpense}
            />

            <CashFlowTrendChart dailyTrend={summary?.dailyTrend || []} />
          </div>

          {/* Bottom Analytics Row: Ranked Top Categories & Recent Transactions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <MonthlySummary summary={summary} />

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Ledger Entries</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Latest income & expense records
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                >
                  <span>View All</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <TransactionList onEdit={handleOpenEdit} onAdd={handleOpenAdd} />
            </div>
          </div>
        </div>
      )}

      {/* Compare Months Tab */}
      {activeTab === 'compare' && <MonthCompareView />}

      {/* Transactions History Tab */}
      {activeTab === 'transactions' && (
        <div className="animate-fade-in glass-card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Transaction History</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Filter, search, review, and manage all your entries
              </p>
            </div>
            <button onClick={handleOpenAdd} className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Add Entry</span>
            </button>
          </div>

          <TransactionList onEdit={handleOpenEdit} onAdd={handleOpenAdd} />
        </div>
      )}

      {/* Add / Edit Transaction Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editItem}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Notifications */}
      <Toast />
    </div>
  );
};

const MainApp = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <CurrencyProvider>
      <TransactionProvider>
        <DashboardContent />
      </TransactionProvider>
    </CurrencyProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;

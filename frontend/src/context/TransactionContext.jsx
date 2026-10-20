import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { transactionApi, analyticsApi } from '../services/api';
import {
  addToOutbox,
  getOutbox,
  syncOutboxInChunks,
  getCachedTransactions,
  setCachedTransactions,
  getCachedSummary,
  setCachedSummary,
} from '../utils/offlineSync';

const TransactionContext = createContext();

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DEFAULT_SUMMARY = {
  totalIncome: 0,
  totalExpense: 0,
  netBalance: 0,
  savingsRate: 0,
  dailyAverage: 0,
  transactionCount: 0,
  expenseBreakdown: [],
  incomeBreakdown: [],
  dailyTrend: []
};

export const TransactionProvider = ({ children }) => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  const [transactions, setTransactions] = useState(() => getCachedTransactions() || []);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [summary, setSummary] = useState(() => getCachedSummary() || DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Offline & Synchronization State
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [pendingSyncCount, setPendingSyncCount] = useState(() => getOutbox().length);
  const [isSyncing, setIsSyncing] = useState(false);

  const isSyncingRef = useRef(false);

  const [filters, setFilters] = useState({
    type: 'ALL',
    category: '',
    search: '',
    page: 1,
    limit: 50,
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // Compute local summary optimistically when offline
  const computeLocalSummary = useCallback((txList, year = selectedYear, month = selectedMonth) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const monthlyItems = txList.filter((t) => t.date && t.date.startsWith(monthStr));

    let totalIncome = 0;
    let totalExpense = 0;
    const catMap = {};
    const dayMap = {};

    monthlyItems.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'INCOME') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
        catMap[t.category] = (catMap[t.category] || 0) + amt;
      }

      if (!dayMap[t.date]) {
        dayMap[t.date] = { date: t.date, income: 0, expense: 0 };
      }
      if (t.type === 'INCOME') dayMap[t.date].income += amt;
      else dayMap[t.date].expense += amt;
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 1000) / 10 : 0;
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyAverage = Math.round((totalExpense / daysInMonth) * 100) / 100;

    const expenseBreakdown = Object.entries(catMap).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 1000) / 10 : 0,
    })).sort((a, b) => b.amount - a.amount);

    const dailyTrend = Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));

    return {
      month,
      year,
      monthName: MONTH_NAMES[month - 1],
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      netBalance: Math.round(netBalance * 100) / 100,
      savingsRate,
      dailyAverage,
      transactionCount: monthlyItems.length,
      expenseBreakdown,
      dailyTrend,
    };
  }, [selectedYear, selectedMonth]);

  const fetchSummary = useCallback(async (year = selectedYear, month = selectedMonth) => {
    try {
      const res = await analyticsApi.getMonthlySummary({ year, month });
      if (res.success) {
        setSummary(res.data);
        setCachedSummary(res.data);
      }
    } catch (err) {
      console.warn('Network error loading summary, using local cache:', err.message);
      // Fallback to local recalculation
      const cached = getCachedSummary();
      if (cached) setSummary(cached);
    }
  }, [selectedYear, selectedMonth]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        year: selectedYear,
        month: selectedMonth,
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.type && filters.type !== 'ALL') {
        params.type = filters.type;
      }
      if (filters.category) {
        params.category = filters.category;
      }
      if (filters.search) {
        params.search = filters.search;
      }

      const res = await transactionApi.getAll(params);
      if (res.success) {
        setTransactions(res.data);
        setPagination(res.pagination);
        setCachedTransactions(res.data);
      }
    } catch (err) {
      console.warn('Network error loading transactions, using offline storage:', err.message);
      const cached = getCachedTransactions();
      if (cached.length > 0) {
        setTransactions(cached);
        setPagination({ page: 1, totalPages: 1, totalItems: cached.length });
      }
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, filters]);

  const refreshAll = useCallback(() => {
    fetchSummary(selectedYear, selectedMonth);
    fetchTransactions();
    setPendingSyncCount(getOutbox().length);
  }, [fetchSummary, fetchTransactions, selectedYear, selectedMonth]);

  // Sync outbox to backend in chunks
  const triggerSync = useCallback(async () => {
    if (isSyncingRef.current || !navigator.onLine) return;

    const outboxCount = getOutbox().length;
    if (outboxCount === 0) {
      setPendingSyncCount(0);
      return;
    }

    try {
      isSyncingRef.current = true;
      setIsSyncing(true);

      const result = await syncOutboxInChunks(transactionApi.sync, 10);
      setPendingSyncCount(0);
      showToast(`⚡ Synchronized ${result.totalSynced} offline transaction(s) to cloud!`, 'success');
      refreshAll();
    } catch (err) {
      console.error('Failed to sync offline outbox:', err);
      showToast('Offline sync paused. Will retry when connection stabilizes.', 'error');
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [refreshAll, showToast]);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Internet connection restored');
      setIsOnline(true);
      showToast('🌐 Internet restored! Checking for pending offline entries...', 'success');
      triggerSync();
    };

    const handleOffline = () => {
      console.log('⚡ Working offline');
      setIsOnline(false);
      showToast('⚡ Offline Mode: Entries will be saved locally and auto-synced.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check on load
    if (navigator.onLine && getOutbox().length > 0) {
      triggerSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync, showToast]);

  useEffect(() => {
    refreshAll();
  }, [selectedYear, selectedMonth, filters]);

  const changeMonth = (delta) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const setSpecificMonth = (month, year) => {
    setSelectedMonth(Number(month));
    setSelectedYear(Number(year));
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  // Add Transaction with Offline Fallback
  const addTransaction = async (data) => {
    const tempId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRecord = {
      id: tempId,
      ...data,
      amount: Number(data.amount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If offline or if network request fails, save to outbox & update locally
    if (!navigator.onLine) {
      addToOutbox('CREATE', newRecord);
      const updatedList = [newRecord, ...transactions];
      setTransactions(updatedList);
      setCachedTransactions(updatedList);
      const updatedSummary = computeLocalSummary(updatedList);
      setSummary(updatedSummary);
      setCachedSummary(updatedSummary);
      setPendingSyncCount(getOutbox().length);
      showToast('⚡ Saved offline! Will sync automatically when online.', 'success');
      return newRecord;
    }

    try {
      const res = await transactionApi.create(data);
      showToast('Transaction recorded successfully!');
      refreshAll();
      return res.data;
    } catch (err) {
      // Network failed during request: fallback to outbox
      addToOutbox('CREATE', newRecord);
      const updatedList = [newRecord, ...transactions];
      setTransactions(updatedList);
      setCachedTransactions(updatedList);
      const updatedSummary = computeLocalSummary(updatedList);
      setSummary(updatedSummary);
      setCachedSummary(updatedSummary);
      setPendingSyncCount(getOutbox().length);
      showToast('⚡ Saved to local outbox. Will sync when back online.', 'success');
      return newRecord;
    }
  };

  // Update Transaction with Offline Fallback
  const updateTransaction = async (id, data) => {
    const updatedRecord = { ...data, id, updatedAt: new Date().toISOString() };

    if (!navigator.onLine) {
      addToOutbox('UPDATE', updatedRecord, id);
      const updatedList = transactions.map((t) => (t.id === id ? { ...t, ...updatedRecord } : t));
      setTransactions(updatedList);
      setCachedTransactions(updatedList);
      const updatedSummary = computeLocalSummary(updatedList);
      setSummary(updatedSummary);
      setCachedSummary(updatedSummary);
      setPendingSyncCount(getOutbox().length);
      showToast('⚡ Updated offline! Changes saved locally.', 'success');
      return updatedRecord;
    }

    try {
      const res = await transactionApi.update(id, data);
      showToast('Transaction updated successfully!');
      refreshAll();
      return res.data;
    } catch (err) {
      addToOutbox('UPDATE', updatedRecord, id);
      const updatedList = transactions.map((t) => (t.id === id ? { ...t, ...updatedRecord } : t));
      setTransactions(updatedList);
      setCachedTransactions(updatedList);
      const updatedSummary = computeLocalSummary(updatedList);
      setSummary(updatedSummary);
      setCachedSummary(updatedSummary);
      setPendingSyncCount(getOutbox().length);
      showToast('⚡ Updated in local outbox.', 'success');
      return updatedRecord;
    }
  };

  // Delete Transaction with Offline Fallback
  const deleteTransaction = async (id) => {
    if (!navigator.onLine) {
      addToOutbox('DELETE', null, id);
      const updatedList = transactions.filter((t) => t.id !== id);
      setTransactions(updatedList);
      setCachedTransactions(updatedList);
      const updatedSummary = computeLocalSummary(updatedList);
      setSummary(updatedSummary);
      setCachedSummary(updatedSummary);
      setPendingSyncCount(getOutbox().length);
      showToast('⚡ Deleted locally! Will sync deletion when online.', 'success');
      return;
    }

    try {
      await transactionApi.delete(id);
      showToast('Transaction deleted successfully!');
      refreshAll();
    } catch (err) {
      addToOutbox('DELETE', null, id);
      const updatedList = transactions.filter((t) => t.id !== id);
      setTransactions(updatedList);
      setCachedTransactions(updatedList);
      const updatedSummary = computeLocalSummary(updatedList);
      setSummary(updatedSummary);
      setCachedSummary(updatedSummary);
      setPendingSyncCount(getOutbox().length);
      showToast('⚡ Queued deletion in offline outbox.', 'success');
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        selectedMonth,
        selectedYear,
        transactions,
        pagination,
        summary,
        loading,
        toast,
        filters,
        isOnline,
        pendingSyncCount,
        isSyncing,
        setFilters,
        changeMonth,
        setSpecificMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshAll,
        triggerSync,
        showToast,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

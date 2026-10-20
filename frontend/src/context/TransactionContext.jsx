import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transactionApi, analyticsApi } from '../services/api';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

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
    }, 4000);
  }, []);

  const fetchSummary = useCallback(async (year = selectedYear, month = selectedMonth) => {
    try {
      const res = await analyticsApi.getMonthlySummary({ year, month });
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to load monthly summary:', err);
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
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, filters, showToast]);

  const refreshAll = useCallback(() => {
    fetchSummary(selectedYear, selectedMonth);
    fetchTransactions();
  }, [fetchSummary, fetchTransactions, selectedYear, selectedMonth]);

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

  const addTransaction = async (data) => {
    try {
      const res = await transactionApi.create(data);
      showToast('Transaction recorded successfully!');
      refreshAll();
      return res.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      const res = await transactionApi.update(id, data);
      showToast('Transaction updated successfully!');
      refreshAll();
      return res.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionApi.delete(id);
      showToast('Transaction deleted successfully!');
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
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
        setFilters,
        changeMonth,
        setSpecificMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshAll,
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

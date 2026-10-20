import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES, formatCurrency } from '../utils/formatters';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('khatabook_currency') || 'INR';
  });

  const currencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const setCurrency = (code) => {
    setCurrencyState(code);
    localStorage.setItem('khatabook_currency', code);
  };

  const format = (amount) => {
    return formatCurrency(amount, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyObj,
        currencies: CURRENCIES,
        setCurrency,
        format,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

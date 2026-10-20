export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', locale: 'en-SG' },
];

export const EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', color: '#f59e0b', icon: 'Utensils' },
  { name: 'Groceries', color: '#10b981', icon: 'ShoppingCart' },
  { name: 'Rent', color: '#6366f1', icon: 'Home' },
  { name: 'Utilities & Bills', color: '#06b6d4', icon: 'Zap' },
  { name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag' },
  { name: 'Travel & Fuel', color: '#8b5cf6', icon: 'Car' },
  { name: 'Healthcare', color: '#ef4444', icon: 'HeartPulse' },
  { name: 'Entertainment', color: '#f97316', icon: 'Film' },
  { name: 'Miscellaneous', color: '#64748b', icon: 'MoreHorizontal' },
];

export const INCOME_CATEGORIES = [
  { name: 'Salary', color: '#10b981', icon: 'Briefcase' },
  { name: 'Freelance', color: '#3b82f6', icon: 'Laptop' },
  { name: 'Business', color: '#8b5cf6', icon: 'TrendingUp' },
  { name: 'Investment', color: '#f59e0b', icon: 'Coins' },
  { name: 'Gift', color: '#ec4899', icon: 'Gift' },
  { name: 'Others', color: '#64748b', icon: 'MoreHorizontal' },
];

export const PAYMENT_MODES = [
  'Cash',
  'UPI',
  'Credit Card',
  'Debit Card',
  'Net Banking',
];

export const formatCurrency = (amount, currencyCode = 'INR') => {
  const numericAmount = Number(amount) || 0;
  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(numericAmount);
  } catch (err) {
    return `${currency.symbol}${numericAmount.toLocaleString()}`;
  }
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, parseInt(month, 10) - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getCategoryColor = (categoryName) => {
  const exp = EXPENSE_CATEGORIES.find((c) => c.name.toLowerCase() === categoryName?.toLowerCase());
  if (exp) return exp.color;
  const inc = INCOME_CATEGORIES.find((c) => c.name.toLowerCase() === categoryName?.toLowerCase());
  if (inc) return inc.color;
  return '#94a3b8';
};

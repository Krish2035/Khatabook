const transactionModel = require('../model/transactionModel');

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const analyticsService = {
  getMonthlySummary: (year, month, userId = null) => {
    const totals = transactionModel.getMonthlyTotals(year, month, userId);
    const totalIncome = Math.round((totals?.totalIncome || 0) * 100) / 100;
    const totalExpense = Math.round((totals?.totalExpense || 0) * 100) / 100;
    const netBalance = Math.round((totalIncome - totalExpense) * 100) / 100;
    
    // Savings rate
    const savingsRate = totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 1000) / 10
      : 0;

    // Days in specified month
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyAverage = totalExpense > 0
      ? Math.round((totalExpense / daysInMonth) * 100) / 100
      : 0;

    // Category breakdown for expenses
    const rawExpenseCategories = transactionModel.getCategoryBreakdown(year, month, 'EXPENSE', userId);
    const expenseBreakdown = rawExpenseCategories.map(cat => ({
      category: cat.category,
      amount: Math.round(cat.totalAmount * 100) / 100,
      count: cat.count,
      percentage: totalExpense > 0
        ? Math.round((cat.totalAmount / totalExpense) * 1000) / 10
        : 0
    }));

    // Category breakdown for income
    const rawIncomeCategories = transactionModel.getCategoryBreakdown(year, month, 'INCOME', userId);
    const incomeBreakdown = rawIncomeCategories.map(cat => ({
      category: cat.category,
      amount: Math.round(cat.totalAmount * 100) / 100,
      count: cat.count,
      percentage: totalIncome > 0
        ? Math.round((cat.totalAmount / totalIncome) * 1000) / 10
        : 0
    }));

    // Daily trend
    const dailyTrend = transactionModel.getDailyCashFlow(year, month, userId);

    return {
      month,
      year,
      monthName: MONTH_NAMES[month - 1],
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      dailyAverage,
      transactionCount: totals?.transactionCount || 0,
      expenseBreakdown,
      incomeBreakdown,
      dailyTrend
    };
  },

  compareMonths: (y1, m1, y2, m2, userId = null) => {
    const month1Summary = analyticsService.getMonthlySummary(y1, m1, userId);
    const month2Summary = analyticsService.getMonthlySummary(y2, m2, userId);

    const expenseDiff = Math.round((month2Summary.totalExpense - month1Summary.totalExpense) * 100) / 100;
    const expensePercentDiff = month1Summary.totalExpense > 0
      ? Math.round((expenseDiff / month1Summary.totalExpense) * 1000) / 10
      : (month2Summary.totalExpense > 0 ? 100 : 0);

    const incomeDiff = Math.round((month2Summary.totalIncome - month1Summary.totalIncome) * 100) / 100;
    const incomePercentDiff = month1Summary.totalIncome > 0
      ? Math.round((incomeDiff / month1Summary.totalIncome) * 1000) / 10
      : (month2Summary.totalIncome > 0 ? 100 : 0);

    const balanceDiff = Math.round((month2Summary.netBalance - month1Summary.netBalance) * 100) / 100;

    // Merge categories across both months
    const catMap = new Map();

    month1Summary.expenseBreakdown.forEach(item => {
      catMap.set(item.category, {
        category: item.category,
        m1Amount: item.amount,
        m2Amount: 0
      });
    });

    month2Summary.expenseBreakdown.forEach(item => {
      if (catMap.has(item.category)) {
        catMap.get(item.category).m2Amount = item.amount;
      } else {
        catMap.set(item.category, {
          category: item.category,
          m1Amount: 0,
          m2Amount: item.amount
        });
      }
    });

    const categoryComparison = Array.from(catMap.values()).map(cat => {
      const diff = Math.round((cat.m2Amount - cat.m1Amount) * 100) / 100;
      let percentDiff = 0;
      if (cat.m1Amount > 0) {
        percentDiff = Math.round((diff / cat.m1Amount) * 1000) / 10;
      } else if (cat.m2Amount > 0) {
        percentDiff = 100;
      }

      return {
        category: cat.category,
        m1Amount: cat.m1Amount,
        m2Amount: cat.m2Amount,
        diff,
        percentDiff
      };
    }).sort((a, b) => (b.m1Amount + b.m2Amount) - (a.m1Amount + a.m2Amount));

    // Automated Insights
    const insights = [];
    if (month1Summary.transactionCount === 0 && month2Summary.transactionCount === 0) {
      insights.push('No transactions recorded for the selected comparison period.');
    } else {
      if (expenseDiff > 0) {
        insights.push(`Total expenses rose by ${Math.abs(expensePercentDiff)}% in ${month2Summary.monthName} compared to ${month1Summary.monthName}.`);
      } else if (expenseDiff < 0) {
        insights.push(`Congratulations! Expenses reduced by ${Math.abs(expensePercentDiff)}% in ${month2Summary.monthName}.`);
      } else {
        insights.push(`Overall expenses remained stable across both months.`);
      }

      // Top increase category
      const topIncrease = [...categoryComparison].filter(c => c.diff > 0).sort((a, b) => b.diff - a.diff)[0];
      if (topIncrease) {
        insights.push(`Highest spend increase was in "${topIncrease.category}" (+${topIncrease.percentDiff}%).`);
      }

      // Top savings category
      const topSavings = [...categoryComparison].filter(c => c.diff < 0).sort((a, b) => a.diff - b.diff)[0];
      if (topSavings) {
        insights.push(`You saved the most in "${topSavings.category}" (-${Math.abs(topSavings.diff)}).`);
      }
    }

    return {
      period1: {
        year: y1,
        month: m1,
        monthName: month1Summary.monthName,
        totalIncome: month1Summary.totalIncome,
        totalExpense: month1Summary.totalExpense,
        netBalance: month1Summary.netBalance,
        savingsRate: month1Summary.savingsRate
      },
      period2: {
        year: y2,
        month: m2,
        monthName: month2Summary.monthName,
        totalIncome: month2Summary.totalIncome,
        totalExpense: month2Summary.totalExpense,
        netBalance: month2Summary.netBalance,
        savingsRate: month2Summary.savingsRate
      },
      delta: {
        expenseDiff,
        expensePercentDiff,
        incomeDiff,
        incomePercentDiff,
        balanceDiff
      },
      categoryComparison,
      insights
    };
  }
};

module.exports = analyticsService;

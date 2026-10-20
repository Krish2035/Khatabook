const { v4: uuidv4 } = require('uuid');
const db = require('./model/db');

const seedData = [
  // --- September 2026 (Month 9) ---
  // Income
  { title: 'Tech Consultancy Salary', amount: 85000, type: 'INCOME', category: 'Salary', paymentMode: 'Net Banking', date: '2026-09-01', notes: 'Monthly salary credit' },
  { title: 'Freelance UI/UX Project', amount: 22000, type: 'INCOME', category: 'Freelance', paymentMode: 'UPI', date: '2026-09-15', notes: 'Fintech dashboard design milestone' },
  { title: 'Mutual Fund Dividend', amount: 3500, type: 'INCOME', category: 'Investment', paymentMode: 'Net Banking', date: '2026-09-20', notes: 'Quarterly dividend' },

  // Expenses
  { title: 'Apartment Rent', amount: 25000, type: 'EXPENSE', category: 'Rent', paymentMode: 'Net Banking', date: '2026-09-02', notes: 'September rent' },
  { title: 'Monthly Supermarket Grocery', amount: 7800, type: 'EXPENSE', category: 'Groceries', paymentMode: 'UPI', date: '2026-09-04', notes: 'DMart monthly essentials' },
  { title: 'Electricity & Water Bill', amount: 2850, type: 'EXPENSE', category: 'Utilities & Bills', paymentMode: 'UPI', date: '2026-09-07', notes: 'Torrent Power bill' },
  { title: 'Weekend Dinner with Friends', amount: 3200, type: 'EXPENSE', category: 'Food & Dining', paymentMode: 'Credit Card', date: '2026-09-11', notes: 'Italian bistro' },
  { title: 'Petrol / Fuel Refill', amount: 2500, type: 'EXPENSE', category: 'Travel & Fuel', paymentMode: 'UPI', date: '2026-09-14', notes: 'Full tank fuel' },
  { title: 'Amazon Shopping Sale', amount: 6400, type: 'EXPENSE', category: 'Shopping', paymentMode: 'Credit Card', date: '2026-09-18', notes: 'Headphones & books' },
  { title: 'Movie Night & Popcorn', amount: 1400, type: 'EXPENSE', category: 'Entertainment', paymentMode: 'UPI', date: '2026-09-22', notes: 'IMAX tickets' },
  { title: 'Organic Vegetables & Dairy', amount: 2200, type: 'EXPENSE', category: 'Groceries', paymentMode: 'Cash', date: '2026-09-25', notes: 'Local farm market' },
  { title: 'Broadband Internet Bill', amount: 1180, type: 'EXPENSE', category: 'Utilities & Bills', paymentMode: 'Net Banking', date: '2026-09-28', notes: 'Airtel Fiber 200Mbps' },

  // --- October 2026 (Month 10) ---
  // Income
  { title: 'Tech Consultancy Salary', amount: 85000, type: 'INCOME', category: 'Salary', paymentMode: 'Net Banking', date: '2026-10-01', notes: 'Monthly salary credit' },
  { title: 'Client Mobile App Design', amount: 35000, type: 'INCOME', category: 'Freelance', paymentMode: 'UPI', date: '2026-10-12', notes: 'iOS application prototype' },
  { title: 'Stock Trading Profit', amount: 6200, type: 'INCOME', category: 'Investment', paymentMode: 'Net Banking', date: '2026-10-18', notes: 'Swing trade booked' },

  // Expenses
  { title: 'Apartment Rent', amount: 25000, type: 'EXPENSE', category: 'Rent', paymentMode: 'Net Banking', date: '2026-10-02', notes: 'October rent' },
  { title: 'DMart Grocery Shopping', amount: 9200, type: 'EXPENSE', category: 'Groceries', paymentMode: 'UPI', date: '2026-10-05', notes: 'Diwali festive supplies & sweets' },
  { title: 'Electricity & Gas Bill', amount: 2450, type: 'EXPENSE', category: 'Utilities & Bills', paymentMode: 'UPI', date: '2026-10-08', notes: 'Monthly power consumption' },
  { title: 'Family Festival Dinner', amount: 5600, type: 'EXPENSE', category: 'Food & Dining', paymentMode: 'Credit Card', date: '2026-10-10', notes: 'Grand restaurant celebration' },
  { title: 'Festive Clothes Shopping', amount: 12500, type: 'EXPENSE', category: 'Shopping', paymentMode: 'Credit Card', date: '2026-10-14', notes: 'Diwali ethnic wear' },
  { title: 'Highway Toll & Fuel', amount: 3400, type: 'EXPENSE', category: 'Travel & Fuel', paymentMode: 'UPI', date: '2026-10-16', notes: 'Road trip refill' },
  { title: 'Dental Checkup & Medicines', amount: 1800, type: 'EXPENSE', category: 'Healthcare', paymentMode: 'UPI', date: '2026-10-18', notes: 'Routine checkup' },
  { title: 'Weekend Coffee & Brunch', amount: 1250, type: 'EXPENSE', category: 'Food & Dining', paymentMode: 'UPI', date: '2026-10-19', notes: 'Roastery cafe' },
  { title: 'Broadband Fiber Bill', amount: 1180, type: 'EXPENSE', category: 'Utilities & Bills', paymentMode: 'Net Banking', date: '2026-10-20', notes: 'Airtel Xstream Fiber' }
];

const seed = () => {
  console.log('🌱 Seeding Khatabook database with realistic financial records...');
  
  // Clear existing
  db.exec('DELETE FROM transactions');

  const insert = db.prepare(`
    INSERT INTO transactions (id, title, amount, type, category, paymentMode, date, notes, createdAt, updatedAt)
    VALUES (@id, @title, @amount, @type, @category, @paymentMode, @date, @notes, datetime('now'), datetime('now'))
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run({
        id: uuidv4(),
        ...item
      });
    }
  });

  insertMany(seedData);

  const count = db.prepare('SELECT COUNT(*) as count FROM transactions').get();
  console.log(`✅ Successfully seeded ${count.count} transactions across September & October 2026!`);
};

seed();

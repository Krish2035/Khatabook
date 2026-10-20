/**
 * Architecture Pillar 78: Input Validation and Sanitization
 */
const validator = {
  validateTransaction: (req, res, next) => {
    const { title, amount, type, category, date, paymentMode } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Title is required and must be a non-empty string', status: 400 }
      });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Amount must be a positive number greater than 0', status: 400 }
      });
    }

    if (!type || !['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: { message: "Type must be either 'INCOME' or 'EXPENSE'", status: 400 }
      });
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Category is required', status: 400 }
      });
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid Date is required in YYYY-MM-DD format', status: 400 }
      });
    }

    // Sanitize string inputs
    req.body.title = title.trim();
    req.body.amount = parsedAmount;
    req.body.type = type.toUpperCase();
    req.body.category = category.trim();
    req.body.paymentMode = (paymentMode && typeof paymentMode === 'string') ? paymentMode.trim() : 'Cash';
    req.body.notes = req.body.notes ? String(req.body.notes).trim() : '';

    next();
  },

  validateMonthlyQuery: (req, res, next) => {
    let { month, year } = req.query;
    const now = new Date();

    if (!year) year = now.getFullYear();
    if (!month) month = now.getMonth() + 1;

    year = parseInt(year, 10);
    month = parseInt(month, 10);

    if (isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid year specified', status: 400 }
      });
    }

    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid month specified (1-12)', status: 400 }
      });
    }

    req.query.year = year;
    req.query.month = month;
    next();
  },

  validateCompareQuery: (req, res, next) => {
    let { m1, y1, m2, y2 } = req.query;

    m1 = parseInt(m1, 10);
    y1 = parseInt(y1, 10);
    m2 = parseInt(m2, 10);
    y2 = parseInt(y2, 10);

    if (isNaN(m1) || m1 < 1 || m1 > 12 || isNaN(y1) || y1 < 2000 || y1 > 2100) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid Month 1 or Year 1 specified', status: 400 }
      });
    }

    if (isNaN(m2) || m2 < 1 || m2 > 12 || isNaN(y2) || y2 < 2000 || y2 > 2100) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid Month 2 or Year 2 specified', status: 400 }
      });
    }

    req.query.m1 = m1;
    req.query.y1 = y1;
    req.query.m2 = m2;
    req.query.y2 = y2;
    next();
  }
};

module.exports = validator;

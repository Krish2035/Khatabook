const authService = require('../services/authService');

/**
 * Architecture Pillar 66 & 67: Authentication & Scoped Identity Middleware
 * Extracts bearer token, verifies JWT, and attaches user info (req.user, req.userId)
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    req.userId = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  // Handle guest demo session
  if (token === 'guest-demo-token') {
    req.user = {
      id: 'guest_user',
      name: 'Guest User',
      email: 'guest@khatabook.local',
      authProvider: 'guest'
    };
    req.userId = 'guest_user';
    return next();
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (error) {
    // If token expired or invalid, still allow guest/anonymous read or return 401
    req.user = null;
    req.userId = null;
    next();
  }
};

module.exports = authMiddleware;

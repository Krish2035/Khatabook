const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const apiLimiter = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Architecture Pillar 71 & 78: Helmet security headers
app.use(helmet());

// Architecture Pillar 76: CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  credentials: true
}));

// Body parsing with limits to protect from large payload attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Observability: Request tracing & logging
app.use(requestLogger);

// Traffic Ingress: Rate limiting on API routes
app.use('/api', apiLimiter);

// User Authentication & Scoped Identity
app.use(authMiddleware);

// API Routes
app.use('/api', routes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.originalUrl}`,
      status: 404
    }
  });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;

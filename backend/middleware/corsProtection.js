// ============================================================
// middleware/corsProtection.js - CORS Protection Middleware
// Handles Cross-Origin Resource Sharing securely
// ============================================================

const cors = require('cors');

// ============================================================
// CORS Configuration
// ============================================================

/**
 * Allowed Origins for CORS
 * In production, these should be your actual domain(s)
 */
const getAllowedOrigins = () => {
  const allowedOrigins = [
    'http://localhost:3000', // Local development
    'http://localhost:3001', // Alternative local port
    'http://127.0.0.1:3000', // Localhost IP
    process.env.FRONTEND_URL, // Frontend URL from env
    process.env.FRONTEND_PRODUCTION_URL, // Production frontend URL
  ].filter(Boolean); // Remove undefined values

  // In production, only allow specific domains
  if (process.env.NODE_ENV === 'production') {
    return [
      process.env.FRONTEND_PRODUCTION_URL,
      'https://smartassistant.app',
      'https://www.smartassistant.app',
    ].filter(Boolean);
  }

  return allowedOrigins;
};

/**
 * CORS Options Configuration
 */
const corsOptions = {
  // Allowed origins
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'Accept',
    'Accept-Language',
    'Content-Language',
    'Last-Event-ID',
  ],

  // Headers to expose to the client
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Number',
    'X-Page-Size',
    'RateLimit-Limit',
    'RateLimit-Remaining',
    'RateLimit-Reset',
  ],

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Max age for preflight cache (24 hours)
  maxAge: 24 * 60 * 60,

  // Preflight success status
  optionsSuccessStatus: 200,
};

/**
 * CORS Middleware
 * Apply to all routes
 */
const corsMiddleware = cors(corsOptions);

/**
 * Strict CORS Middleware
 * For sensitive endpoints (auth, payments, etc.)
 */
const strictCorsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    if (!origin) {
      // Reject requests with no origin
      callback(new Error('Origin is required'));
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
  ],
  credentials: true,
  maxAge: 24 * 60 * 60,
  optionsSuccessStatus: 200,
});

/**
 * CORS Error Handler
 * Handle CORS errors gracefully
 */
const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS' || err.message === 'Origin is required') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation. Your origin is not allowed to access this resource.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  next(err);
};

/**
 * Preflight Request Handler
 * Handle OPTIONS requests
 */
const preflightHandler = (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
};

/**
 * CSRF Token Middleware
 * Generate and validate CSRF tokens
 */
const csrfTokenMiddleware = (req, res, next) => {
  // Generate CSRF token for GET requests
  if (req.method === 'GET') {
    const crypto = require('crypto');
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.locals.csrfToken = csrfToken;
    res.setHeader('X-CSRF-Token', csrfToken);
  }

  // Validate CSRF token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;

    // Skip CSRF validation for OAuth and API token-based requests
    const isOAuthRequest = req.path.includes('/google') || req.path.includes('/facebook') || req.path.includes('/oauth');
    const hasAuthHeader = req.headers.authorization;

    if (hasAuthHeader || isOAuthRequest) {
      return next();
    }

    // For form-based requests, validate CSRF token
    if (!csrfToken) {
      return res.status(403).json({
        success: false,
        message: 'CSRF token is missing',
      });
    }

    // In production, validate the token against session
    // For now, just ensure it exists
  }

  next();
};

/**
 * Security Headers Middleware
 * Add security headers to responses
 */
const securityHeadersMiddleware = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(self), microphone=(), camera=()'
  );

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );

  next();
};

/**
 * Request Validation Middleware
 * Validate request headers and content
 */
const requestValidationMiddleware = (req, res, next) => {
  // Check Content-Type for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];

    if (!contentType) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type header is required',
      });
    }

    // Only allow JSON and form-data
    if (!contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
      return res.status(415).json({
        success: false,
        message: 'Unsupported Media Type. Only JSON and form-data are allowed.',
      });
    }
  }

  // Check request size
  const maxRequestSize = parseInt(process.env.MAX_REQUEST_SIZE) || 10 * 1024 * 1024; // 10MB
  const contentLength = parseInt(req.headers['content-length']) || 0;

  if (contentLength > maxRequestSize) {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large',
    });
  }

  next();
};

module.exports = {
  corsMiddleware,
  strictCorsMiddleware,
  corsErrorHandler,
  preflightHandler,
  csrfTokenMiddleware,
  securityHeadersMiddleware,
  requestValidationMiddleware,
  corsOptions,
};

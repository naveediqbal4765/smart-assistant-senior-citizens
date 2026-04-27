// ============================================================
// middleware/rateLimiter.js - Rate Limiting Middleware
// Prevents brute force attacks and abuse
// ============================================================

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

// ============================================================
// Redis Client (Optional - for distributed rate limiting)
// ============================================================

let redisClient = null;

// Try to connect to Redis if available
try {
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  });

  redisClient.on('error', (err) => {
    console.warn('⚠️  Redis connection failed, using memory store for rate limiting');
    redisClient = null;
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected for rate limiting');
  });
} catch (error) {
  console.warn('⚠️  Redis not available, using memory store for rate limiting');
  redisClient = null;
}

// ============================================================
// Rate Limiter Configurations
// ============================================================

/**
 * General API Rate Limiter
 * 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:general:',
      })
    : undefined,
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health check endpoints
    return req.path === '/health' || req.path === '/api/health';
  },
  keyGenerator: (req) => {
    // Use IP address as key
    return req.ip || req.connection.remoteAddress;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

/**
 * Authentication Rate Limiter
 * 5 login attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:auth:',
      })
    : undefined,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email + IP for more granular control
    return `${req.body.email || 'unknown'}:${req.ip || req.connection.remoteAddress}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after 15 minutes.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

/**
 * Signup Rate Limiter
 * 3 signup attempts per hour per IP
 */
const signupLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:signup:',
      })
    : undefined,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per window
  message: 'Too many signup attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email + IP for more granular control
    return `${req.body.email || 'unknown'}:${req.ip || req.connection.remoteAddress}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many signup attempts. Please try again after 1 hour.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

/**
 * Password Reset Rate Limiter
 * 3 password reset requests per hour per email
 */
const passwordResetLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:password-reset:',
      })
    : undefined,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per window
  message: 'Too many password reset requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email for password reset
    return req.body.email || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many password reset requests. Please try again after 1 hour.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

/**
 * OTP Verification Rate Limiter
 * 10 OTP verification attempts per 15 minutes per email
 */
const otpVerificationLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:otp-verify:',
      })
    : undefined,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: 'Too many OTP verification attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email for OTP verification
    return req.body.email || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many OTP verification attempts. Please try again after 15 minutes.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

/**
 * OTP Resend Rate Limiter
 * 3 OTP resend requests per hour per email
 */
const otpResendLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:otp-resend:',
      })
    : undefined,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per window
  message: 'Too many OTP resend requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email for OTP resend
    return req.body.email || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many OTP resend requests. Please try again after 1 hour.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

/**
 * API Endpoint Rate Limiter
 * 30 requests per minute per IP for general API endpoints
 */
const apiEndpointLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:api-endpoint:',
      })
    : undefined,
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per window
  message: 'Too many API requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again after 1 minute.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

/**
 * File Upload Rate Limiter
 * 10 uploads per hour per IP
 */
const uploadLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:upload:',
      })
    : undefined,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per window
  message: 'Too many file uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many file uploads. Please try again after 1 hour.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

/**
 * OAuth Rate Limiter
 * 10 OAuth attempts per 15 minutes per IP
 */
const oauthLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:oauth:',
      })
    : undefined,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: 'Too many OAuth attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many OAuth attempts. Please try again after 15 minutes.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  signupLimiter,
  passwordResetLimiter,
  otpVerificationLimiter,
  otpResendLimiter,
  apiEndpointLimiter,
  uploadLimiter,
  oauthLimiter,
};

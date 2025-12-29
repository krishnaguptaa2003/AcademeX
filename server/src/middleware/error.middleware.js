// server/src/middleware/error.middleware.js
// server/src/middleware/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  // Prisma errors
  if (err.code?.startsWith('P')) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'Duplicate entry found',
          field: err.meta?.target?.[0],
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found',
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Database error occurred',
          code: err.code,
        });
    }
  }

  // Validation errors
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors || err.issues,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
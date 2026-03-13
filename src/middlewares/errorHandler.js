export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
  })
}

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }

  const isCorsOriginDenied =
    error.message && error.message.startsWith('Origin not allowed by CORS:')

  const statusCode = error.statusCode || (isCorsOriginDenied ? 403 : 500)
  const code = error.code || (isCorsOriginDenied ? 'CORS_ORIGIN_DENIED' : 'INTERNAL_ERROR')

  if (statusCode >= 500) {
    console.error('Unhandled error', {
      path: req.originalUrl,
      method: req.method,
      code,
      message: error.message,
    })
  }

  res.status(statusCode).json({
    error: error.message || 'Internal server error',
    code,
  })
}
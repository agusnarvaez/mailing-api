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

  const errorMessage = typeof error.message === 'string' ? error.message : ''
  const isCorsOriginDenied = errorMessage.startsWith('Origin not allowed by CORS:')

  const statusCode = error.statusCode || (isCorsOriginDenied ? 403 : 500)
  const code = error.code || (isCorsOriginDenied ? 'CORS_ORIGIN_DENIED' : 'INTERNAL_ERROR')

  if (statusCode >= 500) {
    console.error('Unhandled error', {
      path: req.originalUrl,
      method: req.method,
      code,
      message: errorMessage,
    })
  }

  res.status(statusCode).json({
    error: errorMessage || 'Internal server error',
    code,
  })
}
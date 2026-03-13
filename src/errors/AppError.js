export class AppError extends Error {
  constructor(message, { statusCode = 500, code = 'INTERNAL_ERROR', cause } = {}) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.cause = cause
  }
}

export class MailDeliveryError extends AppError {
  constructor(message = 'No se pudo enviar el mail', options = {}) {
    super(message, {
      statusCode: 502,
      code: 'MAIL_DELIVERY_ERROR',
      ...options,
    })
  }
}
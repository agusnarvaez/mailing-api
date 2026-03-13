import { describe, expect, it, vi } from 'vitest'

import { errorHandler, notFoundHandler } from '../src/middlewares/errorHandler.js'

describe('errorHandler middlewares', () => {
  it('notFoundHandler responde 404', () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }

    notFoundHandler({}, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Route not found' })
  })

  it('errorHandler delega en next si headersSent=true', () => {
    const next = vi.fn()
    const res = {
      headersSent: true,
      status: vi.fn(),
      json: vi.fn(),
    }

    const err = new Error('boom')
    errorHandler(err, {}, res, next)

    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
  })

  it('errorHandler mapea CORS denied a 403', () => {
    const res = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }

    errorHandler(
      new Error('Origin not allowed by CORS: https://evil.example.com'),
      { originalUrl: '/mail/send', method: 'OPTIONS' },
      res,
      vi.fn()
    )

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Origin not allowed by CORS: https://evil.example.com',
      code: 'CORS_ORIGIN_DENIED',
    })
  })

  it('errorHandler usa status/code de AppError y no loggea si status < 500', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }

    errorHandler(
      { message: 'invalid payload', statusCode: 400, code: 'VALIDATION_ERROR' },
      { originalUrl: '/mail/send', method: 'POST' },
      res,
      vi.fn()
    )

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'invalid payload',
      code: 'VALIDATION_ERROR',
    })
    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('errorHandler usa defaults cuando no hay message ni code', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }

    errorHandler(
      { statusCode: 500 },
      { originalUrl: '/x', method: 'GET' },
      res,
      vi.fn()
    )

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    })
    expect(consoleSpy).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
  })

  it('errorHandler trata message vacío como internal server error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }

    errorHandler(
      { message: '', statusCode: 500 },
      { originalUrl: '/y', method: 'GET' },
      res,
      vi.fn()
    )

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    })
    expect(consoleSpy).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
  })

  it('errorHandler usa 500 por defecto cuando no hay statusCode ni CORS denied', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }

    errorHandler(
      { message: 'boom' },
      { originalUrl: '/z', method: 'GET' },
      res,
      vi.fn()
    )

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'boom',
      code: 'INTERNAL_ERROR',
    })
    expect(consoleSpy).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
  })
})
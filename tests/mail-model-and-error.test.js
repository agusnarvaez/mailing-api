import { describe, expect, it } from 'vitest'

import { AppError, MailDeliveryError } from '../src/errors/AppError.js'
import { Mail } from '../src/models/mail.js'

describe('domain objects', () => {
  it('Mail.fromRequest crea el modelo con cc por defecto en null', () => {
    const mail = Mail.fromRequest({
      from: 'sender@example.com',
      to: 'receiver@example.com',
      subject: 'Asunto',
      message: 'Texto',
      html: '<p>Texto</p>',
    })

    expect(mail).toEqual({
      from: 'sender@example.com',
      to: 'receiver@example.com',
      subject: 'Asunto',
      body: 'Texto',
      html: '<p>Texto</p>',
      cc: null,
    })
  })

  it('Mail constructor conserva cc cuando se informa', () => {
    const mail = new Mail({
      from: 'sender@example.com',
      to: 'receiver@example.com',
      subject: 'Asunto',
      message: 'Texto',
      html: '<p>Texto</p>',
      cc: 'copy@example.com',
    })

    expect(mail.cc).toBe('copy@example.com')
  })

  it('AppError conserva metadata esperada', () => {
    const cause = new Error('root')
    const error = new AppError('failure', {
      statusCode: 418,
      code: 'TEAPOT',
      cause,
    })

    expect(error.message).toBe('failure')
    expect(error.statusCode).toBe(418)
    expect(error.code).toBe('TEAPOT')
    expect(error.cause).toBe(cause)
  })

  it('MailDeliveryError hereda defaults', () => {
    const error = new MailDeliveryError()

    expect(error.message).toBe('No se pudo enviar el mail')
    expect(error.statusCode).toBe(502)
    expect(error.code).toBe('MAIL_DELIVERY_ERROR')
  })
})
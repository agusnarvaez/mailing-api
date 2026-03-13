import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MailDeliveryError } from '../src/errors/AppError.js'

const sendEmailMock = vi.hoisted(() => vi.fn())

vi.mock('../src/services/mailService.js', () => ({
  sendEmail: sendEmailMock,
}))

import app from '../src/app.js'

const validPayload = {
  from: 'sender@example.com',
  to: 'receiver@example.com',
  subject: 'Hola',
  message: 'Mensaje de prueba',
  html: '<p>Mensaje de prueba</p>',
}

describe('Mailing API', () => {
  beforeEach(() => {
    sendEmailMock.mockReset()
  })

  it('GET /health devuelve status ok', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })

  it('GET /ruta-inexistente devuelve 404', async () => {
    const response = await request(app).get('/ruta-inexistente')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Route not found' })
  })

  it('POST /mail/send devuelve 400 cuando el payload es inválido', async () => {
    const response = await request(app)
      .post('/mail/send')
      .send({
        from: 'not-an-email',
        to: 'receiver@example.com',
        subject: '',
        message: '',
        html: '',
      })

    expect(response.status).toBe(400)
    expect(Array.isArray(response.body.errors)).toBe(true)
    expect(response.body.errors.length).toBeGreaterThan(0)
  })

  it('POST /mail/send devuelve 201 y messageId cuando el envío es correcto', async () => {
    sendEmailMock.mockResolvedValue({ MessageId: 'msg-123' })

    const response = await request(app).post('/mail/send').send(validPayload)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ message: 'Mail sent', messageId: 'msg-123' })
    expect(sendEmailMock).toHaveBeenCalledTimes(1)
  })

  it('POST /mail/send devuelve 502 cuando falla la entrega de SES', async () => {
    sendEmailMock.mockRejectedValue(new MailDeliveryError('SES unavailable'))

    const response = await request(app).post('/mail/send').send(validPayload)

    expect(response.status).toBe(502)
    expect(response.body).toMatchObject({
      error: 'SES unavailable',
      code: 'MAIL_DELIVERY_ERROR',
    })
  })

  it('OPTIONS /mail/send permite origin whitelisteado', async () => {
    const response = await request(app)
      .options('/mail/send')
      .set('Origin', 'https://www.pauladallochio.com.ar')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type')

    expect(response.status).toBe(204)
    expect(response.headers['access-control-allow-origin']).toBe(
      'https://www.pauladallochio.com.ar'
    )
  })

  it('OPTIONS /mail/send bloquea origin no permitido con 403', async () => {
    const response = await request(app)
      .options('/mail/send')
      .set('Origin', 'https://evil.example.com')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type')

    expect(response.status).toBe(403)
    expect(response.body).toMatchObject({
      code: 'CORS_ORIGIN_DENIED',
    })
  })
})
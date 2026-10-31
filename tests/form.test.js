import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const sendEmailMock = vi.hoisted(() => vi.fn())

vi.mock('../src/services/mailService.js', () => ({
  sendEmail: sendEmailMock,
}))

import app from '../src/app.js'
import { env } from '../src/config/env.js'
import { MailDeliveryError } from '../src/errors/AppError.js'

const contacto = {
  site: 'mendezprop',
  name: 'Juan <img src=x onerror=alert(1)>',
  email: 'juan@example.com',
  phone: '"><b>1234</b>',
  subject: '<a href="https://phishing.example">Click</a>',
  message: 'Hola\n<script>alert(2)</script>',
  fields: [{ label: 'Barrio', value: '<i>Moreno</i>' }],
  link: '/catalogo/12',
}

// Cada test usa su propia IP para no chocar con el rate limit.
let ip = 0
const post = (body, headers = {}) =>
  request(app).post('/mail/form').set('X-Forwarded-For', `10.0.0.${++ip}`).set(headers).send(body)

describe('POST /mail/form', () => {
  beforeEach(() => {
    sendEmailMock.mockReset()
    sendEmailMock.mockResolvedValue({ MessageId: 'msg-1' })
  })

  it('manda aviso al sitio y confirmación al visitante, con remitente y destinatario fijos', async () => {
    const res = await post(contacto, { Origin: 'https://mendezprop.com.ar' })

    expect(res.status).toBe(201)
    const [[aviso], [confirmacion]] = sendEmailMock.mock.calls
    expect(aviso).toMatchObject({
      from: 'no_reply@mendezprop.com.ar',
      to: 'mendezprop.inmobiliaria@gmail.com',
      replyTo: 'juan@example.com',
    })
    expect(confirmacion).toMatchObject({ from: 'no_reply@mendezprop.com.ar', to: 'juan@example.com' })
  })

  it('escapa todo lo que manda el visitante', async () => {
    await post(contacto)

    const [[aviso], [confirmacion]] = sendEmailMock.mock.calls
    for (const mail of [aviso, confirmacion]) {
      expect(mail.html).not.toContain('<img src=x')
      expect(mail.html).not.toContain('<a href="https://phishing.example">')
      expect(mail.html).not.toContain('<script>')
      expect(mail.html).not.toContain('<b>1234</b>')
    }
    expect(aviso.html).toContain('Juan &lt;img src=x onerror=alert(1)&gt;')
    expect(aviso.html).toContain('Hola<br>&lt;script&gt;')
    expect(aviso.html).toContain('&lt;i&gt;Moreno&lt;/i&gt;')
    expect(aviso.html).toContain('href="https://mendezprop.com.ar/catalogo/12"')
  })

  it('ignora remitente, destinatario y html que mande el cliente', async () => {
    await post({ ...contacto, from: 'ceo@banco.com', to: 'victima@example.com', html: '<h1>phishing</h1>' })

    const [[aviso]] = sendEmailMock.mock.calls
    expect(aviso.from).toBe('no_reply@mendezprop.com.ar')
    expect(aviso.to).toBe('mendezprop.inmobiliaria@gmail.com')
    expect(aviso.html).not.toContain('<h1>phishing</h1>')
  })

  it('sin confirmación para sitios que no la usan ni cuando no hay email', async () => {
    await post({ site: 'azimap', subject: 'Sugerencia: modo oscuro', message: 'Detalle' })

    expect(sendEmailMock).toHaveBeenCalledTimes(1)
    expect(sendEmailMock.mock.calls[0][0].to).toBe('agus.narvaez@outlook.com')
  })

  it('el asunto no lleva saltos de línea', async () => {
    await post({ ...contacto, name: 'Juan\r\nBcc: otro@example.com' })

    expect(sendEmailMock.mock.calls[0][0].subject).not.toMatch(/[\r\n]/)
  })

  it('rechaza sitio desconocido, links fuera del sitio y datos de más', async () => {
    for (const body of [
      { ...contacto, site: 'otro' },
      { ...contacto, link: '//phishing.example' },
      { ...contacto, link: 'https://phishing.example' },
      { ...contacto, message: 'x'.repeat(5001) },
      { ...contacto, fields: Array.from({ length: 21 }, () => ({ label: 'a', value: 'b' })) },
    ]) {
      expect((await post(body)).status).toBe(400)
    }
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('rechaza el formulario de un sitio mandado desde otro dominio', async () => {
    const res = await post(contacto, { Origin: 'https://veritokillian.ar' })

    expect(res.status).toBe(403)
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('corta después de 5 envíos por IP y vuelve a dejar pasados 10 minutos', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      const enviar = () =>
        request(app).post('/mail/form').set('X-Forwarded-For', '10.9.9.9').send(contacto)
      for (let i = 0; i < 5; i++) expect((await enviar()).status).toBe(201)
      expect((await enviar()).status).toBe(429)

      vi.setSystemTime(Date.now() + 10 * 60_000)
      expect((await enviar()).status).toBe(201)
    } finally {
      vi.useRealTimers()
    }
  })

  it('descarta un link que se va del sitio aunque parezca una ruta', async () => {
    const res = await post({ ...contacto, link: '/\\phishing.example' })

    expect(res.status).toBe(201)
    expect(sendEmailMock.mock.calls[0][0].html).not.toContain('Ver publicación')
  })

  it('sin nombre ni mensaje el mail igual se arma', async () => {
    await post({ site: 'mendezprop', subject: 'Consulta', email: 'ana@example.com' })

    const [[aviso], [confirmacion]] = sendEmailMock.mock.calls
    expect(aviso.subject).toBe('Consulta')
    expect(confirmacion.html).toContain('Hola! - Gracias')
  })

  it('devuelve 502 si SES no puede mandar el aviso', async () => {
    sendEmailMock.mockRejectedValue(new MailDeliveryError('SES unavailable'))

    expect((await post(contacto)).status).toBe(502)
  })

  it('si falla sólo la confirmación al visitante, el envío cuenta como hecho', async () => {
    sendEmailMock.mockResolvedValueOnce({ MessageId: 'msg-1' }).mockRejectedValueOnce(new Error('rebote'))

    expect((await post(contacto)).status).toBe(201)
    expect(sendEmailMock).toHaveBeenCalledTimes(2)
  })
})

describe('POST /mail/send con MAIL_API_KEY', () => {
  const payload = { from: 'a@example.com', to: 'b@example.com', subject: 'Hola', message: 'Hola', html: '<p>Hola</p>' }

  beforeEach(() => {
    sendEmailMock.mockReset()
    sendEmailMock.mockResolvedValue({ MessageId: 'msg-2' })
    env.mailApiKey = 'clave-de-prueba'
    return () => {
      env.mailApiKey = ''
    }
  })

  it('sin key o con key incorrecta devuelve 401', async () => {
    expect((await request(app).post('/mail/send').send(payload)).status).toBe(401)
    expect((await request(app).post('/mail/send').set('x-api-key', 'otra').send(payload)).status).toBe(401)
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('con la key manda', async () => {
    const res = await request(app).post('/mail/send').set('x-api-key', 'clave-de-prueba').send(payload)

    expect(res.status).toBe(201)
  })
})

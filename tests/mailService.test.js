import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MailDeliveryError } from '../src/errors/AppError.js'

const sendEmailCommandMock = vi.hoisted(() =>
  vi.fn().mockImplementation(function SendEmailCommandMock(input) {
    this._command = 'SendEmailCommand'
    this.input = input
  })
)

const getSesClientMock = vi.hoisted(() => vi.fn())

vi.mock('@aws-sdk/client-ses', () => ({
  SendEmailCommand: sendEmailCommandMock,
}))

vi.mock('../src/services/awsConfig.js', () => ({
  getSesClient: getSesClientMock,
}))

import { sendEmail } from '../src/services/mailService.js'

describe('mailService', () => {
  beforeEach(() => {
    sendEmailCommandMock.mockClear()
    getSesClientMock.mockReset()
  })

  it('envía mail sin cc', async () => {
    const sendMock = vi.fn().mockResolvedValue({ MessageId: 'message-no-cc' })
    getSesClientMock.mockReturnValue({ send: sendMock })

    const response = await sendEmail({
      from: 'sender@example.com',
      to: 'receiver@example.com',
      subject: 'Asunto',
      body: 'Texto',
      html: '<p>Texto</p>',
      cc: null,
    })

    expect(response).toEqual({ MessageId: 'message-no-cc' })
    expect(sendEmailCommandMock).toHaveBeenCalledTimes(1)

    const payload = sendEmailCommandMock.mock.calls[0][0]
    expect(payload.Destination).toEqual({
      ToAddresses: ['receiver@example.com'],
    })
    expect(payload.Message.Subject.Data).toBe('Asunto')
    expect(sendMock).toHaveBeenCalledTimes(1)
  })

  it('incluye CcAddresses cuando hay cc', async () => {
    const sendMock = vi.fn().mockResolvedValue({ MessageId: 'message-with-cc' })
    getSesClientMock.mockReturnValue({ send: sendMock })

    await sendEmail({
      from: 'sender@example.com',
      to: 'receiver@example.com',
      subject: 'Asunto',
      body: 'Texto',
      html: '<p>Texto</p>',
      cc: 'copy@example.com',
    })

    const payload = sendEmailCommandMock.mock.calls[0][0]
    expect(payload.Destination).toEqual({
      ToAddresses: ['receiver@example.com'],
      CcAddresses: ['copy@example.com'],
    })
  })

  it('transforma errores de SES en MailDeliveryError', async () => {
    const sesError = new Error('SES down')
    const sendMock = vi.fn().mockRejectedValue(sesError)
    getSesClientMock.mockReturnValue({ send: sendMock })

    await expect(
      sendEmail({
        from: 'sender@example.com',
        to: 'receiver@example.com',
        subject: 'Asunto',
        body: 'Texto',
        html: '<p>Texto</p>',
      })
    ).rejects.toBeInstanceOf(MailDeliveryError)
  })
})
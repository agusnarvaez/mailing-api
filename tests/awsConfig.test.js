import { beforeEach, describe, expect, it, vi } from 'vitest'

const sesClientCtorMock = vi.hoisted(() =>
  vi.fn().mockImplementation(function SesClientMock(config) {
    this.config = config
  })
)

vi.mock('@aws-sdk/client-ses', () => ({
  SESClient: sesClientCtorMock,
}))

describe('awsConfig', () => {
  beforeEach(() => {
    vi.resetModules()
    sesClientCtorMock.mockClear()
  })

  it('crea cliente SES con config válida y cachea la instancia', async () => {
    vi.doMock('../src/config/env.js', () => ({
      env: {
        aws: {
          accessKeyId: 'key',
          secretAccessKey: 'secret',
          region: 'us-east-1',
        },
      },
    }))

    const { getSesClient } = await import('../src/services/awsConfig.js')

    const first = getSesClient()
    const second = getSesClient()

    expect(first).toBe(second)
    expect(sesClientCtorMock).toHaveBeenCalledTimes(1)
    expect(sesClientCtorMock).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: 'key',
        secretAccessKey: 'secret',
      },
      region: 'us-east-1',
    })
  })

  it('lanza AppError cuando falta configuración AWS', async () => {
    vi.doMock('../src/config/env.js', () => ({
      env: {
        aws: {
          accessKeyId: 'key',
          secretAccessKey: '',
          region: 'us-east-1',
        },
      },
    }))

    const { getSesClient } = await import('../src/services/awsConfig.js')

    expect(() => getSesClient()).toThrowError('AWS SES configuration is incomplete')
  })
})
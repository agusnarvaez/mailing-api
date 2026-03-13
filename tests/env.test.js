import { afterEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_ENV = { ...process.env }

const resetTrackedEnv = () => {
  process.env.PORT = ORIGINAL_ENV.PORT
  process.env.CORS_ALLOWED_ORIGINS = ORIGINAL_ENV.CORS_ALLOWED_ORIGINS
  process.env.AWS_ACCESS_KEY_ID = ORIGINAL_ENV.AWS_ACCESS_KEY_ID
  process.env.AWS_SECRET_ACCESS_KEY = ORIGINAL_ENV.AWS_SECRET_ACCESS_KEY
  process.env.AWS_REGION = ORIGINAL_ENV.AWS_REGION
  process.env.AWS_ACCESS_KEY = ORIGINAL_ENV.AWS_ACCESS_KEY
  process.env.AWS_ACCESS_KEY_SECRET = ORIGINAL_ENV.AWS_ACCESS_KEY_SECRET
  process.env.AWS_ACCESS_KEY_REGION = ORIGINAL_ENV.AWS_ACCESS_KEY_REGION
}

const loadEnvModule = async () => {
  vi.resetModules()
  return import('../src/config/env.js')
}

describe('env config', () => {
  afterEach(() => {
    resetTrackedEnv()
  })

  it('usa defaults cuando no hay CORS_ALLOWED_ORIGINS', async () => {
    process.env.CORS_ALLOWED_ORIGINS = ''
    process.env.PORT = ''

    const { env } = await loadEnvModule()

    expect(env.port).toBe(3000)
    expect(env.corsOrigins).toContain('https://www.pauladallochio.com.ar')
  })

  it('parsea y normaliza CORS_ALLOWED_ORIGINS', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'https://a.com/, https://b.com '
    process.env.PORT = '4001'

    const { env, normalizeRequestOrigin } = await loadEnvModule()

    expect(env.port).toBe(4001)
    expect(env.corsOrigins).toEqual(['https://a.com', 'https://b.com'])
    expect(normalizeRequestOrigin('https://x.com/')).toBe('https://x.com')
  })

  it('prioriza variables AWS nuevas y fallback a legacy', async () => {
    process.env.AWS_ACCESS_KEY_ID = ''
    process.env.AWS_SECRET_ACCESS_KEY = ''
    process.env.AWS_REGION = ''
    process.env.AWS_ACCESS_KEY = 'legacy-key'
    process.env.AWS_ACCESS_KEY_SECRET = 'legacy-secret'
    process.env.AWS_ACCESS_KEY_REGION = 'legacy-region'

    const { env } = await loadEnvModule()

    expect(env.aws).toEqual({
      accessKeyId: 'legacy-key',
      secretAccessKey: 'legacy-secret',
      region: 'legacy-region',
    })
  })

  it('devuelve string vacío cuando no existe ninguna variable AWS', async () => {
    process.env.AWS_ACCESS_KEY_ID = ''
    process.env.AWS_SECRET_ACCESS_KEY = ''
    process.env.AWS_REGION = ''
    process.env.AWS_ACCESS_KEY = ''
    process.env.AWS_ACCESS_KEY_SECRET = ''
    process.env.AWS_ACCESS_KEY_REGION = ''

    const { env } = await loadEnvModule()

    expect(env.aws).toEqual({
      accessKeyId: '',
      secretAccessKey: '',
      region: '',
    })
  })
})
import dotenv from 'dotenv'

dotenv.config()

const DEFAULT_CORS_ORIGINS = [
  'https://bapps.com.ar',
  'https://www.bapps.com.ar',
  'https://bapps-803f0.web.app',
  'https://bapps-803f0.firebaseapp.com',
  'https://pauladallochio.com.ar',
  'https://www.pauladallochio.com.ar',
  'https://veritokillian.ar',
  'https://www.veritokillian.ar',
  'https://mendezprop.com.ar',
  'https://azimap.bapps.com.ar',
  // TODO: cuando el dominio migre a azimap.com.ar, agregar acá
]

const normalizeOrigin = (origin) => origin.replace(/\/$/, '')

const parseOrigins = (origins) => {
  if (!origins) {
    return DEFAULT_CORS_ORIGINS
  }

  return origins
    .split(',')
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean)
}

const getFirstDefinedEnv = (...keys) => {
  for (const key of keys) {
    if (process.env[key]) {
      return process.env[key]
    }
  }

  return ''
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  corsOrigins: parseOrigins(process.env.CORS_ALLOWED_ORIGINS),
  aws: {
    accessKeyId: getFirstDefinedEnv('AWS_ACCESS_KEY_ID', 'AWS_ACCESS_KEY'),
    secretAccessKey: getFirstDefinedEnv('AWS_SECRET_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET'),
    region: getFirstDefinedEnv('AWS_REGION', 'AWS_ACCESS_KEY_REGION'),
  },
}

export const normalizeRequestOrigin = normalizeOrigin

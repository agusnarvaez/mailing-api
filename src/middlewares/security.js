import { timingSafeEqual } from 'node:crypto'

import { env } from '../config/env.js'
import { SITES } from '../config/sites.js'

const iguales = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))

// /mail/send acepta HTML y remitente libres: sólo para servers con la key (ej. el API de azimap).
// Sin MAIL_API_KEY configurada queda abierto, para poder migrar los sitios antes de cerrarlo.
export const requireApiKey = (req, res, next) => {
  if (!env.mailApiKey) return next()
  const key = req.get('x-api-key') ?? ''
  if (iguales(key, env.mailApiKey)) return next()
  res.status(401).json({ error: 'API key inválida', code: 'UNAUTHORIZED' })
}

// Un navegador no puede mandar el formulario de un sitio desde otro dominio.
export const requireSiteOrigin = (req, res, next) => {
  const origin = req.get('origin')
  const site = SITES[req.body.site]
  if (!origin || site.origins.includes(origin.replace(/\/$/, '')) || /^http:\/\/localhost(:\d+)?$/.test(origin)) return next()
  res.status(403).json({ error: 'Origen no permitido para este sitio', code: 'FORBIDDEN_ORIGIN' })
}

// ponytail: memoria de un solo proceso (Fly corre una máquina); si se escala, pasar a Redis o al rate limit de Fly.
export const rateLimit = ({ max, windowMs }) => {
  const hits = new Map()
  return (req, res, next) => {
    const ahora = Date.now()
    const previo = hits.get(req.ip)
    const entrada = previo && ahora - previo.desde < windowMs ? previo : { desde: ahora, n: 0 }
    entrada.n += 1
    hits.set(req.ip, entrada)
    if (hits.size > 10_000) hits.clear()
    if (entrada.n <= max) return next()
    res.status(429).json({ error: 'Demasiados envíos, probá en unos minutos', code: 'RATE_LIMITED' })
  }
}

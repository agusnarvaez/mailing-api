// Importo express
import express from 'express'

// Utilizo el módulo de morgan para registrar solicitudes HTTP en la consola
import morgan from 'morgan'

// Utilizo el módulo de cors para permitir solicitudes de otros dominios
import cors from 'cors'

// ##### Importo rutas de la API #####
import mailRoutes from './routes/mail.routes.js'
import { env, normalizeRequestOrigin } from './config/env.js'
import { SITES } from './config/sites.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'

// Inicializo la aplicación
const app = express()

// Además de CORS_ALLOWED_ORIGINS, cada sitio de src/config/sites.js (prod y testing) puede llamar a la API.
const allowedOrigins = new Set([
  ...env.corsOrigins,
  ...Object.values(SITES).flatMap((site) => [...site.origins, site.testing]),
])

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true)
      return
    }

    const normalizedOrigin = normalizeRequestOrigin(origin)

    if (allowedOrigins.has(normalizedOrigin)) {
      callback(null, true)
      return
    }

    callback(new Error(`Origin not allowed by CORS: ${origin}`))
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'x-api-key'],
}

// ### Inicializo middlewares ###

// Configuro el puerto
app.set('port', env.port)
// Fly agrega un proxy adelante: req.ip tiene que ser la IP del visitante para el rate limit
app.set('trust proxy', 1)

// Para que el servidor entienda cors
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(morgan('dev')) // Mensaje formateado como dev
app.use(express.json({ limit: '100kb' })) // Para que el servidor entienda json

// Rutas de la API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/mail', mailRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app

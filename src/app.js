// Importo express
import express from "express"

// Importo el módulo de swagger para documentar la API
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

// Utilizo el módulo de morgan para registrar solicitudes HTTP en la consola
import morgan from "morgan"

// Utilizo el módulo de cors para permitir solicitudes de otros dominios
import cors from "cors"

// ##### Importo rutas de la API #####
import mailRoutes from "./routes/mail.routes.js"

// Inicializo la aplicación
const app = express()

// ### Inicializo middlewares ###


// Configuro el puerto
app.set('port',process.env.PORT || 3000)

// Para que el servidor entienda cors
app.use(cors({
  origin: ['https://pauladallochio.com.ar','https://veritokillian.ar','https://testing.veritokillian.ar/','https://djabuk.com','https://www.djabuk.com'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}))
app.options('*', cors())
app.use(morgan('dev')) // Mensaje formateado como dev
app.use(express.json()) // Para que el servidor entienda json

// Inicializo documentación de la API
const options = {
    definition: {
      openapi: '1.0.0',
      info: {
        title: 'API para envío de mails',
        version: '1.0.0',
        description: 'Documentación de la API',
      },
    },
    apis: ['./src/routes/user.routes.js','./src/routes/question.routes.js']
}
// swaggerJSDoc genera un objeto swaggerDoc que se pasa a swaggerUi.setup
const swaggerSpec = swaggerJSDoc(options)


// Rutas de la API
/* app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
 */
app.use('/mail',mailRoutes)

console.log(
    "La versión 1 de api-docs está disponible en la ruta /api-docs"
)

export default app
// Importaciones de paquetes
import express from "express"
const router = express.Router()

// Controllers
import mailController from "../controllers/mailController.js"

// Importo middleware de validaciones
import { validateSend } from "../middlewares/mailValidations.js"

/**
 * @openapi
 * /users:
 *  post:
 *      tags:
 *      - Usuarios
 *      description: Agrega un usuario
 *      requestBody:
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *         description: Created
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/User'
 *        400:
 *          description: Bad Request
 * components:
 *  schemas:
 *    Mail:
 *     type: object
 *     properties:
 *      name:
 *       type: string
 *      responses:
 *       type: array
 *       items:
 *        type: object
 *        properties:
 *          question:
 *           type: string
 *          response:
 *           type: string
 */
router.post('/send',validateSend,mailController.send) // Ruta para crear usuario

export default router
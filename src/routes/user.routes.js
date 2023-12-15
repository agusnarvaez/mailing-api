// Importaciones de paquetes
import express from "express"
const router = express.Router()

// Controllers
import userController from "../controllers/userController.js"

// Importo middleware de validaciones
import { validateCreate } from "../middlewares/userValidations.js"

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *        description: Bad Request
 * components:
 *  schemas:
 *    User:
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
router.get('/',userController.index) // Ruta para obtener todos los usuarios
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
 *    User:
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
router.post('/',validateCreate,userController.create) // Ruta para crear usuario

/**
 * @openapi
 * /users/export:
 *  get:
 *   tags:
 *    - Usuarios
 *   description: Exporta los usuarios en formato excel
 *   responses:
 *      200:
 *       description: OK
 *      400:
 *       description: Bad Request
 */
// Ruta para exportar planilla en formato csv
router.get('/export',userController.export)


/**
 * @openapi
 * /users/view:
 *  get:
 *   tags:
 *    - Usuarios
 *   description: Vista de usuarios
 *   responses:
 *    200:
 *     description: OK
 *    400:
 *     description: Bad Request
 */
router.get('/view',userController.view)

export default router
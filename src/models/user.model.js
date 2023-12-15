//* Importo mongoose y el Schema para crear el modelo de datos
import {model, Schema } from "mongoose"

/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *     type: object
 *     properties:
 *      name:
 *       type: string
 *      responses:
 *          type: array
 *          items:
 *              type: object
 *              properties:
 *                  question:
 *                      type: string
 *                  response:
 *                      type: string
 *              required:
 *                  - question
 *                  - response
 *    required:
 *      - name
 *      - responses
 */

//* Creo el modelo de datos de usuario
const userSchema = new Schema({
    name: {type: String, required: true, trim:true},
    responses: [
        {
            question: {type: String, required: true, trim:true},
            answer: {type: String, required: true, trim:true}
        }
    ]
},{
    timestamps: true //* Crea la fecha de creación y actualización
})

export default model('User',userSchema)

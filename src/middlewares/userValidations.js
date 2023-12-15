import { check,validationResult,param } from "express-validator"

// Importo el modelo de datos de usuario
import  User  from '../models/user.model.js'

const validateCreate = [
    check("name")
        .exists().bail().withMessage("El campo no existe")
        .isString().bail().withMessage("El nombre debe ser un valor alfanumérico")
        .not().isEmpty().bail().withMessage("El nombre es requerido"),
    check('responses')
        .exists().bail().withMessage("El campo no existe")
        .isArray().bail().withMessage("Las respuestas deben ser un array"),
    check('responses')
        .custom((value) => {
            if(value.length < 1){
                throw new Error("Debe haber al menos una respuesta")
            }
            return true
        }),
    check('responses.*.question')
        .exists().bail().withMessage("El campo no existe")
        .not().isEmpty().bail().withMessage("La pregunta es requerida")
        .isString().bail().withMessage("La pregunta debe ser un valor alfanumérico"),
    check('responses.*.answer')
        .exists().bail().withMessage("El campo no existe")
        .not().isEmpty().bail().withMessage("La respuesta es requerida")
        .isString().bail().withMessage("La respuesta debe ser un valor alfanumérico"),
    (req,res,next) => validateResult(req, res, next)
]

const validateGetById = [
    param('id')
        .custom(async (value,{req}) => {
            //* Verifica que el usuario exista
            const result = await User.findById(req.params.id)
            if(!result){
                throw new Error("El usuario no existe!")
            }
            return true
        }),
    (req,res,next) => validateResult(req, res, next)
]

const validateUpdate = [
    validateGetById,
    check("document")
        .optional(true)
        .exists().bail().withMessage("El campo no existe")
        .isNumeric().bail().withMessage("El documento debe ser un valor numérico")
        .not().isEmpty().bail().withMessage("El documento es requerido")
        .isLength({min:8}).bail().withMessage("El documento debe tener al menos 8 caracteres"),
    check("name")
        .optional(true)
        .exists().bail().withMessage("El campo del nombre no existe")
        .isString().bail().withMessage("El nombre debe ser un valor alfanumérico"),
    check('lastName')
        .optional(true)
        .exists().bail().withMessage("El campo del apellido no existe")
        .isString().bail().withMessage("El apellido debe ser un valor alfanumérico"),
    check('birth')
        .exists().bail().withMessage("El campo no existe")
        .custom((value) => {
            const date = new Date(value)
            if (isNaN(date.getTime())) {
                throw new Error("La fecha de nacimiento no es válida")
            }
            return true
        })
        .withMessage("La fecha de nacimiento es requerida"),
    check('livesInGBA')
        .optional(true)
        .isBoolean().bail().withMessage("El campo vive en GBA debe ser un valor booleano"),
    (req,res,next) => validateResult(req, res, next)
]

const validateResult = (req,res,next) => {
    try{
        validationResult(req).throw()
        next()
    }catch(err){
        res.status(400).json({errors: err.array()})
    }
}

export {validateCreate,validateUpdate,validateGetById}
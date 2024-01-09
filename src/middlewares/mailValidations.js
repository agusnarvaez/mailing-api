import { check,validationResult } from "express-validator"

export const validateSend = [
    check("from")
        .exists().bail().withMessage("El campo from no existe")
        .isString().bail().withMessage("El campo from debe ser un valor alfanumérico")
        .not().isEmpty().bail().withMessage("El campo from no debe estar vacío")
        .isEmail().bail().withMessage("El campo from debe ser un email válido"),
    check("to")
        .exists().bail().withMessage("El campo to no existe")
        .isString().bail().withMessage("El campo to debe ser un valor alfanumérico")
        .not().isEmpty().bail().withMessage("El campo to no debe estar vacío")
        .isEmail().bail().withMessage("El campo to debe ser un email válido"),
    check("subject")
        .exists().bail().withMessage("El campo subject no existe")
        .isString().bail().withMessage("El campo subject debe ser un valor alfanumérico")
        .not().isEmpty().bail().withMessage("El campo subject no debe estar vacío"),
    check("message")
        .exists().bail().withMessage("El campo message no existe")
        .isString().bail().withMessage("El campo message debe ser un valor alfanumérico")
        .not().isEmpty().bail().withMessage("El campo message no debe estar vacío"),
    check("html")
        .exists().bail().withMessage("El campo html no existe")
        .isString().bail().withMessage("El campo html debe ser un valor alfanumérico")
        .not().isEmpty().bail().withMessage("El campo html no debe estar vacío"),
    check("cc")
        .optional({nullable: true})
        .isString().bail().withMessage("El campo cc debe ser un valor alfanumérico")
        .not().isEmpty().bail().withMessage("El campo cc no debe estar vacío"),
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


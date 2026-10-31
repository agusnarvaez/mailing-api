import { body, validationResult } from 'express-validator'
import { SITES } from '../config/sites.js'

export const validateSend = [
    body('from')
        .exists({ checkFalsy: true }).withMessage('El campo from es obligatorio')
        .bail()
        .isEmail().withMessage('El campo from debe ser un email válido')
        .normalizeEmail(),
    body('to')
        .exists({ checkFalsy: true }).withMessage('El campo to es obligatorio')
        .bail()
        .isEmail().withMessage('El campo to debe ser un email válido')
        .normalizeEmail(),
    body('subject')
        .exists({ checkFalsy: true }).withMessage('El campo subject es obligatorio')
        .bail()
        .isString().withMessage('El campo subject debe ser un texto')
        .trim(),
    body('message')
        .exists({ checkFalsy: true }).withMessage('El campo message es obligatorio')
        .bail()
        .isString().withMessage('El campo message debe ser un texto')
        .trim(),
    body('html')
        .exists({ checkFalsy: true }).withMessage('El campo html es obligatorio')
        .bail()
        .isString().withMessage('El campo html debe ser un texto'),
    body('cc')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('El campo cc debe ser un email válido')
        .normalizeEmail(),
    (req, res, next) => validateResult(req, res, next),
]


const validateResult = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        next()
        return
    }

    res.status(400).json({ errors: errors.array() })
}


const texto = (campo, max) =>
    body(campo)
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage(`El campo ${campo} debe ser un texto`)
        .bail()
        .trim()
        .isLength({ max }).withMessage(`El campo ${campo} admite hasta ${max} caracteres`)

export const validateForm = [
    body('site')
        .isString().withMessage('El campo site es obligatorio')
        .bail()
        .custom((site) => Object.hasOwn(SITES, site)).withMessage('Sitio desconocido'),
    body('subject')
        .exists({ checkFalsy: true }).withMessage('El campo subject es obligatorio')
        .bail()
        .isString().withMessage('El campo subject debe ser un texto')
        .trim()
        .isLength({ max: 150 }).withMessage('El campo subject admite hasta 150 caracteres'),
    texto('name', 100),
    texto('phone', 40),
    texto('message', 5000),
    body('email')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('El campo email debe ser un email válido'),
    body('fields')
        .optional({ nullable: true })
        .isArray({ max: 20 }).withMessage('El campo fields debe ser una lista de hasta 20 datos'),
    body('fields.*.label').isString().trim().isLength({ min: 1, max: 60 }).withMessage('Cada dato necesita un label de hasta 60 caracteres'),
    body('fields.*.value').optional({ nullable: true }).isString().trim().isLength({ max: 1000 }).withMessage('Cada dato admite hasta 1000 caracteres'),
    body('link')
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .matches(/^\/(?!\/)[^\s]{0,199}$/).withMessage('El link tiene que ser una ruta del sitio, ej. /catalogo/123'),
    (req, res, next) => validateResult(req, res, next),
]

import { body, validationResult } from 'express-validator'

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


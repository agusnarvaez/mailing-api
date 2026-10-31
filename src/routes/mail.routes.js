import express from "express"
const router = express.Router()

import mailController from "../controllers/mailController.js"
import { validateForm, validateSend } from "../middlewares/mailValidations.js"
import { rateLimit, requireApiKey, requireSiteOrigin } from "../middlewares/security.js"

// Formularios de los sitios: mandan sólo datos, el HTML lo arma la API (src/services/formMail.js).
router.post('/form', rateLimit({ max: 5, windowMs: 10 * 60_000 }), validateForm, requireSiteOrigin, mailController.form)

// Envío libre (HTML, remitente y destinatario a elección): sólo con x-api-key.
router.post('/send', requireApiKey, validateSend, mailController.send)

export default router

import {sendEmail} from "../services/mailService.js"
import {buildFormMails} from "../services/formMail.js"
import {SITES} from "../config/sites.js"

import {Mail} from '../models/mail.js'

const controller = {
    send: async (req, res, next) => {
        try{
            const mail = Mail.fromRequest(req.body)
            const response = await sendEmail(mail)

            res.status(201).json({message: "Mail sent", messageId: response.MessageId})
        }
        catch(err){
            next(err)
        }
    },
    form: async (req, res, next) => {
        try{
            const [notification, confirmation] = buildFormMails(SITES[req.body.site], req.body)
            const response = await sendEmail(notification)
            // La confirmación al visitante es secundaria: si falla, el mensaje igual llegó.
            if (confirmation) await sendEmail(confirmation).catch(() => {})

            res.status(201).json({message: "Mail sent", messageId: response.MessageId})
        }
        catch(err){
            next(err)
        }
    }
}

export default controller

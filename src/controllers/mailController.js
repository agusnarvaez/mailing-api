
/* import {mailService} from "../services/mailService.js" */
import {sendEmail} from "../services/mailService.js"

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
    }
}

export default controller
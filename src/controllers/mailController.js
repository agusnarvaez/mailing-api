
/* import {mailService} from "../services/mailService.js" */
import {sendEmail} from "../services/mailService.js"

import {Mail} from '../models/mail.js'

const controller = {
    send: async (req, res) => {
        try{
            // Creo un nuevo usuario con los datos del body
            const mail = new Mail(req.body.from, req.body.to, req.body.subject, req.body.message,req.body.html)
            // Guardo el usuario en la base de datos

            await sendEmail(mail)
            // Devuelvo el usuario guardado
            res.status(201).json({message: "Mail sent"})
        }
        catch(err){
            res.status(400).json({error: err.message})
        }
    }
}

export default controller
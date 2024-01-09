
/* import {mailService} from "../services/mailService.js" */
import {sendEmail} from "../services/mailService.js"

import {Mail} from '../models/mail.js'

const controller = {
    send: async (req, res) => {
        try{
            // Creo un nuevo usuario con los datos del body
            const mail = new Mail(req.body.from, req.body.to, req.body.subject, req.body.message,req.body.html)
            // Si existe cc, entonces lo agrego al mail, pero con if ternario
            if (req.body.cc) mail.setCC(req.body.cc)

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
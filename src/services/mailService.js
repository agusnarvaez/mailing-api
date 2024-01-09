import { SendEmailCommand } from "@aws-sdk/client-ses"
import { sesClient } from "./awsConfig.js"

export const sendEmail = async (mail) => {
    // Creación del objeto Destination
    const destination = {
      ToAddresses: [mail.to]
    }

    // Añadir CcAddresses solo si mail.cc tiene un valor
    if (mail.cc) destination.CcAddresses = [mail.cc];

    const emailParams = {
      Source: mail.from, // Debe ser una dirección verificada en SES
      Destination: destination,
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: mail.subject
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `${mail.html}`
          },
          Text: {
            Charset: 'UTF-8',
            Data: mail.body
          }
        }
      }
    }

    try{
      const sendEmailCommand = new SendEmailCommand(emailParams)
      const res = await sesClient.send(sendEmailCommand)
      console.log('The email has been sent!',res)
    }catch(error){
      console.log(error)
      throw new Error(error)
    }
}

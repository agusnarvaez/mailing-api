import { SendEmailCommand } from '@aws-sdk/client-ses'

import { MailDeliveryError } from '../errors/AppError.js'
import { getSesClient } from './awsConfig.js'

const buildDestination = (mail) => {
  const destination = {
    ToAddresses: [mail.to],
  }

  if (mail.cc) {
    destination.CcAddresses = [mail.cc]
  }

  return destination
}

const buildEmailParams = (mail) => ({
  Source: mail.from,
  Destination: buildDestination(mail),
  Message: {
    Subject: {
      Charset: 'UTF-8',
      Data: mail.subject,
    },
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: mail.html,
      },
      Text: {
        Charset: 'UTF-8',
        Data: mail.body,
      },
    },
  },
})

export const sendEmail = async (mail) => {
  try {
    const sendEmailCommand = new SendEmailCommand(buildEmailParams(mail))
    return await getSesClient().send(sendEmailCommand)
  } catch (error) {
    console.error('SES sendEmail failed', {
      name: error.name,
      message: error.message,
    })

    throw new MailDeliveryError(undefined, { cause: error })
  }
}

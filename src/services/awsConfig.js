import { SESClient } from '@aws-sdk/client-ses'

import { AppError } from '../errors/AppError.js'
import { env } from '../config/env.js'

let sesClient

const buildSesConfig = () => {
  const { accessKeyId, secretAccessKey, region } = env.aws
  const missingConfig = [
    ['AWS_ACCESS_KEY_ID', accessKeyId],
    ['AWS_SECRET_ACCESS_KEY', secretAccessKey],
    ['AWS_REGION', region],
  ].filter(([, value]) => !value)

  if (missingConfig.length > 0) {
    throw new AppError('AWS SES configuration is incomplete', {
      statusCode: 500,
      code: 'AWS_SES_CONFIG_ERROR',
    })
  }

  return {
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region,
  }
}

export const getSesClient = () => {
  if (!sesClient) {
    sesClient = new SESClient(buildSesConfig())
  }

  return sesClient
}
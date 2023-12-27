import { SESClient } from "@aws-sdk/client-ses"

import dotenv from "dotenv"

dotenv.config()

const SES_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
  region: process.env.AWS_ACCESS_KEY_REGION
}

export const sesClient = new SESClient(SES_CONFIG)
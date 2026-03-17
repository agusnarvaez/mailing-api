import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const badgesDir = path.join(__dirname, '..', 'badges')

// Asegurar que el directorio badges existe
if (!fs.existsSync(badgesDir)) {
  fs.mkdirSync(badgesDir, { recursive: true })
}

const FLY_HEALTH_URL = 'https://mailing-api.fly.dev/health'
const TIMEOUT = 5000

function generateBadgeSVG(status, color, text) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="170" height="20" role="img" aria-label="deployment: ${text}">
    <title>deployment: ${text}</title>
    <linearGradient id="s" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb"/>
      <stop offset="1" stop-color="#999"/>
    </linearGradient>
    <clipPath id="r">
      <rect width="170" height="20" rx="3" fill="#fff"/>
    </clipPath>
    <g clip-path="url(#r)">
      <rect width="119" height="20" fill="#555"/>
      <rect x="119" width="51" height="20" fill="${color}"/>
      <rect width="170" height="20" fill="url(#s)" opacity="0.1"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
      <text aria-hidden="true" x="605" y="150" fill="#010101" fill-opacity="0.3" transform="scale(.1)" textLength="1090">Deployment</text>
      <text x="605" y="140" transform="scale(.1)" fill="#fff" textLength="1090">Deployment</text>
      <text aria-hidden="true" x="1435" y="150" fill="#010101" fill-opacity="0.3" transform="scale(.1)" textLength="410">${text}</text>
      <text x="1435" y="140" transform="scale(.1)" fill="#fff" textLength="410">${text}</text>
    </g>
  </svg>`
}

async function checkHealth() {
  return new Promise((resolve) => {
    const startTime = Date.now()
    
    const request = https.get(FLY_HEALTH_URL, { timeout: TIMEOUT }, (res) => {
      const responseTime = Date.now() - startTime
      
      if (res.statusCode === 200) {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data)
            if (parsed.status === 'ok') {
              resolve({
                status: 'success',
                color: '#28a745',
                text: `online (${responseTime}ms)`,
                message: 'Deployment is healthy'
              })
              return
            }
          } catch (e) {
            // Continue to error case
          }
          resolve({
            status: 'error',
            color: '#dc3545',
            text: 'unhealthy',
            message: 'Health check returned invalid response'
          })
        })
      } else {
        resolve({
          status: 'error',
          color: '#dc3545',
          text: 'offline',
          message: `HTTP ${res.statusCode}`
        })
      }
    })

    request.on('error', (err) => {
      console.error('Health check error:', err.message)
      resolve({
        status: 'error',
        color: '#ffc107',
        text: 'unreachable',
        message: err.message
      })
    })

    request.on('timeout', () => {
      request.destroy()
      resolve({
        status: 'error',
        color: '#ffc107',
        text: 'timeout',
        message: `Timeout after ${TIMEOUT}ms`
      })
    })
  })
}

async function main() {
  try {
    console.log('🔍 Checking deployment health...')
    const result = await checkHealth()
    
    const badgeSVG = generateBadgeSVG(
      result.status,
      result.color,
      result.text
    )
    
    const badgePath = path.join(badgesDir, 'deployment-status.svg')
    fs.writeFileSync(badgePath, badgeSVG, 'utf-8')
    
    console.log(`✅ ${result.message}`)
    console.log(`📊 Badge saved to: ${badgePath}`)
  } catch (err) {
    console.error('Error generating deployment badge:', err)
    process.exit(1)
  }
}

main()

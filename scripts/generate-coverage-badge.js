import fs from 'node:fs'
import path from 'node:path'

const coverageSummaryPath = path.resolve('coverage/coverage-summary.json')
const badgePath = path.resolve('badges/coverage.svg')

if (!fs.existsSync(coverageSummaryPath)) {
  throw new Error('No se encontró coverage/coverage-summary.json. Ejecutá npm run test:coverage primero.')
}

const summary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf-8'))
const coverageValue = Number(summary.total.lines.pct)
const coverageLabel = `${coverageValue.toFixed(2)}%`

const pickColor = (value) => {
  if (value >= 95) return '#2ea043'
  if (value >= 80) return '#a371f7'
  if (value >= 60) return '#d29922'
  return '#cf222e'
}

const color = pickColor(coverageValue)

const escapeXml = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const leftText = 'coverage'
const rightText = coverageLabel
const leftWidth = 82
const rightWidth = Math.max(46, rightText.length * 8 + 14)
const width = leftWidth + rightWidth

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="coverage: ${escapeXml(
  rightText
)}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${width}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="20" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${color}"/>
    <rect width="${width}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11">
    <text x="${leftWidth / 2}" y="15">${escapeXml(leftText)}</text>
    <text x="${leftWidth + rightWidth / 2}" y="15">${escapeXml(rightText)}</text>
  </g>
</svg>`

fs.mkdirSync(path.dirname(badgePath), { recursive: true })
fs.writeFileSync(badgePath, svg)

console.log(`Badge generado en ${badgePath}`)
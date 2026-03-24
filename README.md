# mailing-api

[![Build](https://github.com/agusnarvaez/mailing-api/actions/workflows/ci.yml/badge.svg)](https://github.com/agusnarvaez/mailing-api/actions/workflows/ci.yml)
[![Coverage](./badges/coverage.svg)](#quality-and-testing)
[![Deployment Status](./badges/deployment-status.svg)](#deployment)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Fly.io](https://img.shields.io/badge/Deploy-Fly.io-7B3FF2)](https://fly.io/)

Transactional mailing API built with Express and AWS SES, with HTTP tests, coverage reporting, and a lightweight deployment flow.

API transaccional de mailing construida con Express y AWS SES, con tests HTTP, reporte de cobertura y un flujo liviano de despliegue.

## Overview

### ES

`mailing-api` expone un endpoint para enviar correos y un endpoint de salud, con validaciones, manejo centralizado de errores y configuracion de CORS basada en variables de entorno.

### EN

`mailing-api` exposes a mail-sending endpoint plus a health endpoint, with request validation, centralized error handling, and CORS configuration driven by environment variables.

## Stack

- Node.js 20+
- Express
- AWS SES
- Vitest + Supertest
- Fly.io

## Setup

1. Install dependencies.

```bash
npm install
```

2. Create a local `.env` file from the provided example.

```bash
copy .env.example .env
```

3. Start the API.

```bash
npm run dev
```

The default URL is `http://localhost:3000`.

## Environment Variables

```bash
PORT=3000
CORS_ALLOWED_ORIGINS=https://pauladallochio.com.ar,https://www.pauladallochio.com.ar
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_REGION=YOUR_AWS_REGION
```

Legacy keys are still supported for backward compatibility:

- `AWS_ACCESS_KEY`
- `AWS_ACCESS_KEY_SECRET`
- `AWS_ACCESS_KEY_REGION`

## API Surface

- `POST /mail/send`
- `GET /health`

Example request body:

```json
{
  "from": "origen@dominio.com",
  "to": "destino@dominio.com",
  "subject": "Asunto",
  "message": "Version texto del mail",
  "html": "<p>Version HTML del mail</p>",
  "cc": "copia@dominio.com"
}
```

## Scripts

```bash
npm run start
npm run dev
npm run test
npm run test:watch
npm run test:coverage
npm run test:ci
```

## Quality and Testing

- HTTP integration and unit-style tests run with Vitest and Supertest.
- Coverage reporting is part of CI and updates the local badge asset.
- The repo now includes `.env.example` to make local setup reproducible without exposing secrets.

## Deployment

- Production deployment target: Fly.io
- CI workflow validates the test suite with coverage on pushes to `main`, `dev`, and pull requests

## Operational Notes

- Verify senders or domains in AWS SES before using the service in production.
- Keep CORS origins synchronized with the domains that consume the API.
- Avoid changing environment variable names unless you also update the compatibility layer in `src/config/env.js`.

## Author

- Agustin Narvaez
- [GitHub](https://github.com/agusnarvaez)
- [LinkedIn](https://www.linkedin.com/in/narvaezagustin/)

## License

MIT. See [LICENSE](./LICENSE).

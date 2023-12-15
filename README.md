# challenge-sportclub
## Descripción
Este proyecto es un desafío de programación para la empresa SportClub. El mismo consiste en una microaplicación web que permite al ver una lista de usuarios, filtrarla y realizar acciones CRUD sobre la misma.

## Tecnologías
- Backend:
  - NodeJS: V20.1.0
  - Express: V4.18.2
  - express-validator": V7.0.1
  - mongoose": V7.5.1
  - MongoDB Atlas

## Instalación
Para instalar el proyecto, se debe clonar el repositorio y luego instalar las dependencias con el comando `npm install`.

## Ejecución
Para ejecutar el proyecto de manera local, una vez agregadas las variables de entorno correspondientes y se debe ejecutar el comando `npm run dev` en cada carpeta (backend)

## API
La API cuenta con los siguientes endpoints:
- GET /users: Devuelve la lista de usuarios
- POST /users/create: Crea un nuevo usuario
- GET /users/export: Exporta archivo .xlsx con la lista de usuarios
- GET /users/view: Muestra la tabla de usuarios en línea
- /api-docs (Swagger): Documentación de la API

## Deployment
- El proyecto backend se encuentra deployado en Fly.io en la siguiente URL:
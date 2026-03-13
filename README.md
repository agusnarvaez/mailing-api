# Mailing Api 📧
## Descripción
Este proyecto es un servicio de mailing propio.

## Tecnologías
- Backend:
  - NodeJS: V20.1.0
  - Express: V4.18.2
  - express-validator": V7.0.1
  - AWS SES

## Instalación
1. Clonar el repositorio
2. Instalar las dependencias
```bash
npm install
```
3. Crear un archivo .env en la raíz del proyecto con las siguientes variables de entorno:
```bash
PORT=3000
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_REGION=YOUR_AWS_REGION
```
4. Iniciar el servidor
```bash
npm start
```
5. Realizar una petición POST a la siguiente URL:
```bash
http://localhost:3000/mail/send
```
Con el siguiente body:
```json
{
    "from": "From",
    "to": "to",
    "subject": "subject",
    "body": "message",
    "html": "html"
}
```
## Registro de cuentas
Para utilizar el servicio de mailing, es necesario registrar una cuenta en AWS y configurar el servicio de SES (Simple Email Service).
1. Crear una cuenta en AWS: https://aws.amazon.com/
2. Configurar el servicio de SES: https://docs.aws.amazon.com/ses/latest/
3. Obtener las credenciales de acceso (Access Key ID y Secret Access Key) y la región.
4. Configurar las variables de entorno en el archivo .env.
5. Ingresar a Identidades para 

## Autor
- Agustín Narvaez
  - [GitHub](https://github.com/agusnarvaez)
  - [Linkedin](https://www.linkedin.com/in/narvaezagustin/)

## Licencia
[MIT](https://choosealicense.com/licenses/mit/)
```


// Importo el modelo de datos de usuario
import  User  from '../models/user.model.js'
import Excel from "exceljs"
import moment from "moment"


const controller = {
    index: async (req, res) => {
        try{
            // Obtengo todos los usuarios y le agrego el texto de la pregunta
            const users = await User.find().exec()

            res.status(200).json(users)
        }
        catch(err){
            res.status(400).json({error: err.message})
        }
    },
    create: async (req, res) => {
        try{
            // Creo un nuevo usuario con los datos del body
            const user = new User(req.body)
            // Guardo el usuario en la base de datos
            await user.save()
            // Devuelvo el usuario guardado
            res.status(201).json(user)
        }
        catch(err){
            res.status(400).json({error: err.message})
        }
    },
    export: async (req, res) => {
        const workbook = new Excel.Workbook()
        const worksheet = workbook.addWorksheet('Usuarios')

        // Obtengo todos los usuarios y le agrego el texto de la pregunta
        const usersData = await User.find().exec()

        // Obtener todas las preguntas únicas
        const allQuestions = new Set()

        usersData.forEach(user => {
            user.responses.forEach(response => {
                allQuestions.add(response.question)
            })
        })

        // Convertir el set de preguntas a un array y ordenarlas alfabéticamente
        const questionsArray = Array.from(allQuestions)/* .sort() */

        // Definir encabezados
        const headers = ['N°','Nombre','Fecha', ...questionsArray]
        worksheet.columns = headers.map(header => ({ header, key: header, width: 20 }))

        // Llenar la tabla con los datos
        usersData.forEach((user,key) => {

            const row = {'N°': key+1, Nombre: user.name, Fecha: moment(user.createdAt).format('DD/MM/YYYY') }

            questionsArray.forEach(question => {
                const response = user.responses.find(r => r.question === question)
            row[question] = response ? response.answer : ''
            })
            worksheet.addRow(row)
        })

        // Envía el archivo Excel como una descarga
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx')

        workbook.xlsx.write(res)
            .then(() => {
                console.log('Archivo Excel enviado correctamente.')
            })
            .catch(err => {
                console.error('Error al enviar el archivo Excel:', err)
            })
    },
    view: async (req, res) => {

        const usersData = await User.find().exec()

        const htmlTable = `
            <html>
            <head>
                <title>Tabla de Usuarios</title>
                <style>
                table {
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                }
                </style>
            </head>
            <body>
                <h1>Tabla de Usuarios</h1>
                <table>
                <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    ${usersData[0].responses.map(response => `<th>${response.question}</th>`).join('')}
                </tr>
                ${
                    usersData.map((user,key) => `
                    <tr>
                    <td>${key+1}</td>
                    <td>${user.name}</td>
                    <td>${moment(user.createdAt).format('DD/MM/YYYY')}</td>
                    ${user.responses.map(response => `
                        <td>${response.answer}</td>
                    `).join('')}
                    </tr>
                `).join('')}
                </table>
            </body>
            </html>`

        res.send(htmlTable)
    }
}

export default controller
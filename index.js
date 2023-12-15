// Importo app.js
import app from "./src/app.js"
import {connectDB} from "./src/database/database.js"

// Conecto la base de datos
connectDB()

// Inicializo el servidor
app.listen(app.get('port'), '0.0.0.0', () => {
    console.log("Server on port http://localhost:" + app.get('port'))
})

// Exporto la aplicación
export {app}
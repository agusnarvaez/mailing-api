// Importo mongoose que es el ORM que voy a utilizar para conectarme a la base de datos MongoDB
import mongoose from "mongoose"
import dotenv from "dotenv"

// Configuro dotenv para obtener la variable de entorno de la URI de la base de datos
dotenv.config()
// Obtengo la URI de la base de datos
const URI = process.env.MONGO_URI

// Función para conectarme a la base de datos
const connectDB = async () => {
    try{
        console.log("Intentando conectar...")
        // Conecto la base de datos
        await mongoose.connect(URI,{
            dbName: 'prod', // Aquí especifica el nombre de tu base de datos
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB is connected')
    }catch(e){
        // Si hay errores los devuelvo
        console.error(e)
    }
}

// Exporto la función para conectarme a la base de datos para utilizarla en index.js
export{ connectDB }
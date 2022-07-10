const mongoose = require('mongoose');

const connectDB = async() => {
    
        const conn = await mongoose.connect(process.env.MONGO_URI); // Conectamos a la base de datos

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);  // Mostramos el host de la base de datos
    
}

module.exports = connectDB;
const express = require('express');                     // Modulo de express
require('dotenv').config();                             // que tiene acceso al .env archivo
const colors = require('colors');                       // Modulo de colors
const cors = require('cors');

const { graphqlHTTP } = require('express-graphql');     // Modulo de graphql
const schema = require('./schema/schema');              // schema de graphql

const connectDB = require('./config/db');               // Configuracion de la base de datos

const port = process.env.PORT || 5000;                  // Número de puerto

const app = express();                                  // Instancia de express

connectDB();                                            // Conectamos a la base de datos

app.use(cors());

app.use('/graphql', graphqlHTTP({                       // graphql endpoint
    schema,                                             // que usará el schema
    graphiql: process.env.NODE_ENV === 'development'    // y un IDE para desarrollo    
}))


app.listen(port, console.log(`Server running on port ${port}`)); // server running on port 5000
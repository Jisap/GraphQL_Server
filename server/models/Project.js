

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    description:{
        type: String,
    },
    status:{
        type: String,
        enum:['Not Started', 'In Progress', 'Completed'],
    },
    clientId:{
        type: mongoose.Schema.Types.ObjectId,   // Tipo de dato ObjectId de mongoose
        ref: 'Client',                          // Referencia a la colección Client
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
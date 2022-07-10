
//const { projects, clients } = require('../sampleData'); // Importamos los datos de prueba

// Mongoose Models
const Project = require('../models/Project');
const Client = require('../models/Client');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require ('graphql');      // Importamos GraphQLObjectType

//Tipos de Project
const ProjectType = new GraphQLObjectType({ // Creamos un nuevo tipo de project
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client:{ 
            type: ClientType,
            resolve(parent, args){
                //return clients.find((client) => client.id === parent.clientId); // Buscamos el cliente que corresponde al proyecto (project tiene un campo = clientId)
                return Client.findById(parent.clientId);                          // Buscamos el cliente en BD que corresponde al proyecto (project tiene un campo = clientId)
            },
        },
    }),
});


//Tipos de cliente
const ClientType = new GraphQLObjectType({ // Creamos un nuevo tipo de cliente
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({   // Creamos las querys 
    name: 'RootQueryType',                      
    fields: {
        projects:{                                           // Peticiones para obtener los projects    
            type: new GraphQLList(ProjectType),
            resolve( parent, args ) {
                return Project.find();                      
            }
        },
        project: {                                           // Peticiones para obtener información de un project según su id
            type: ProjectType,
            args: { id: { type: GraphQLID } }, 
            resolve( parent, args ) {
                //return projects.find( project => project.id === args.id ); // Buscamos el project en la lista de projects según el id proporcionado por GraphQLID
                return Project.findById(args.id);                            // Buscamos el project en la base de datos segun el id proporcionado por GraphQLID
            }
        },
        clients:{                                           // Peticiones para obtener los clientes    
            type: new GraphQLList(ClientType),
            resolve( parent, args ) {
                return Client.find();
            }
        },
        client: {                                           // Peticiones para obtener información de un cliente según su id
            type: ClientType,
            args: { id: { type: GraphQLID } }, 
            resolve( parent, args ) {
                //return clients.find( client => client.id === args.id ); // Buscamos el cliente en la lista de clientes según el id proporcionado por GraphQLID
                return Client.findById(args.id);                          // Buscamos el cliente en la base de datos segun el id proporcionado por GraphQLID
            }
        }
    }
});

//Mutations 
const mutation = new GraphQLObjectType({ 
    name: 'Mutation',
    fields:{
        // Añadir cliente
        addClient:{
            type: ClientType,
            args:{ 
                name: { type: GraphQLNonNull(GraphQLString) }, // Campo obligatorio
                email: { type: GraphQLNonNull(GraphQLString) }, // Campo obligatorio
                phone: { type: GraphQLNonNull(GraphQLString) } // Campo obligatorio
            }, 
            resolve( parent, args) {                // Función que se ejecuta cuando se hace una petición de agregar un cliente
                const client = new Client({         // Creamos un nuevo cliente tipo mongoose model
                    name: args.name,                // Le asignamos los campos proporcionados por los args de GraphQL
                    email: args.email,
                    phone: args.phone
                });
                return client.save();               // Guardamos el cliente en la base de datos
            },
        },
        // Borrar cliente
        deleteClient:{
            type: ClientType,
            args:{
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve( parent, args ) {
                Project.find({ clientId: args.id })             // Buscamos todos los proyectos que sean del cliente que se quiere borrar
                    .then((projects) => {                       // encontrados esos proyectos
                       projects.forEach((project) => {          // los recorremos 
                        project.remove()                        // y los borramos
                       })     
                    }); 
                return Client.findByIdAndDelete(args.id);
            },
        },
        // Añadir project
        addProject:{ 
            type: ProjectType,
            args:{ 
                name: { type: GraphQLNonNull(GraphQLString) }, // Campo obligatorio
                description: { type: GraphQLNonNull(GraphQLString) }, // Campo obligatorio
                status:{ 
                    type: new GraphQLEnumType({ 
                        name: 'ProjectStatus',
                        values: {
                            'new': { value: 'Not Started' },
                            'progress': { value: 'In Progress' },
                            'completed': { value: 'Completed' },
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: { type: GraphQLNonNull(GraphQLID) } // Campo obligatorio
            },
            resolve( parent, args ) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                });
                return project.save();
            }
        },
        // Borrar project
        deleteProject:{ 
            type: ProjectType,
            args:{ 
                id:{ type: GraphQLNonNull(GraphQLID) }
            },
            resolve( parent, args ) {
                return Project.findByIdAndDelete(args.id);
            }
        },
        // Actualizar project
        updateProject:{
            type: ProjectType,
            args:{ 
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status:{ 
                    type: new GraphQLEnumType({ 
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': { value: 'Not Started' },
                            'progress': { value: 'In Progress' },
                            'completed': { value: 'Completed' },
                        },
                    }),
                },
            },
            resolve( parent, args ) {
                return Project.findByIdAndUpdate(
                    args.id,
                    { 
                        $set: { 
                            name: args.name, 
                            description: args.description, 
                            status: args.status 
                        }, 
                    }, 
                    { new: true });
            }
        }
    }
})

module.exports = new GraphQLSchema({    // Exportamos el schema basado en el RootQuery
    query: RootQuery,
    mutation,
})
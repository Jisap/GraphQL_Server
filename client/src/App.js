
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Project from "./pages/Project";


const cache = new InMemoryCache({             // Creamos el cache de Apollo
  typePolicies: {                             // Configuramos las politicas de campos
    Query: {                                  // para los queries                
      fields: {    // lectura//escritura      // los campos de los queries
        clients: { // cache    cache          // y dentro de estas, el campo clients
          merge: (existing, incoming) => {    // con merge definimos que sucede cuando se actualiza un cliente
            return incoming;                  // Si existe un cliente con el mismo id, lo actualizamos
          }                                   // Con los datos que vienen del servidor
        },
        projets:{
          merge: (existing, incoming) => {    // Si existe un proyecto con el mismo id, lo actualizamos
            return incoming;                  // Con los datos que vienen del servidor
          },   
        },
      },
    },
  }
});       

const client = new ApolloClient({       // Creamos el cliente de Apollo
  uri: 'http://localhost:5000/graphql', // URL del servidor de Apollo
  cache
})

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<Project />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;

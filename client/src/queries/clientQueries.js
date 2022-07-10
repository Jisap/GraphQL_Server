import { gql } from '@apollo/client';


// GraphQL query to get all clients
const GET_CLIENTS = gql`  
  query GetClients {
    clients{
      id
      name
      email
      phone
    }
  }  
`

export { GET_CLIENTS };
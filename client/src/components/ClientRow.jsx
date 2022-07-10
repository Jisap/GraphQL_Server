import { FaTrash } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { DELETE_CLIENT } from '../mutations/clientMutations';
import { GET_CLIENTS } from '../queries/clientQueries';
import { GET_PROJECTS } from '../queries/projectQueries';

const ClientRow = ({ client }) => {

  const [deleteClient] = useMutation( DELETE_CLIENT, { 
    variables: { id: client.id },
    refetchQueries: [{ query: GET_CLIENTS }, { query: GET_PROJECTS }]  // refetch the clients and projects queries
    // update(cache, { data: { deleteClient } }) {                     // Actualizamos el cache de Apollo
    //   const { clients } = cache.readQuery({ query: GET_CLIENTS });  // Obtenemos los clientes del cache
    //   cache.writeQuery({                                            // Escribimos los clientes actualizados
    //     query: GET_CLIENTS,                                                           // Query que se ejecutará  
    //     data: { clients: clients.filter(client => client.id !== deleteClient.id) },   // Filtramos los clientes que no coincidan con el que se eliminó
    //   })
    // }
  });

  return (
    <tr>
        <td>{ client.name }</td>
        <td>{ client.email }</td>
        <td>{ client.phone }</td>
        <td>
            <button 
              className="btn btn-danger btn-sm"
              onClick={ deleteClient}
            >
                <FaTrash />
            </button>
        </td>
    </tr>
  )
}

export default ClientRow
  


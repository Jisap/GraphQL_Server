import { gql, useQuery } from '@apollo/client';
import ClientRow from './ClientRow';
import Spinner from './Spinner';
import { GET_CLIENTS } from '../queries/clientQueries';



export default function Clients() {

  const { loading, error, data } = useQuery( GET_CLIENTS ); // Obtenemos los datos de la query

  if(loading) return <Spinner />;
  if(error) return <p>Something went wrong</p>;

  return (
    <>
      { !loading && !error && (
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { data.clients.map( client => (                       // mapeamos los clientes y los enviamos a ClientRow
              <ClientRow key={ client.id } client={ client } />
            ))}
          </tbody>
        </table>
      ) }
    </>
  )
}


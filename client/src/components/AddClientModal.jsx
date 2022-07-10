import React from 'react'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useMutation } from '@apollo/client';
import { ADD_CLIENT } from '../mutations/clientMutations';
import { GET_CLIENTS } from '../queries/clientQueries';


const AddClientModal = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [addClient] = useMutation(ADD_CLIENT, {                           // Obtenemos la mutation para agregar un cliente

        variables: { name, email, phone },                                  // Le pasamos los datos del formulario. addClient graba en bd el nuevo cliente

        update(cache, { data: { addClient } }) {                            // Actualizamos el cache de Apollo con los nuevos datos para visualizar el resultado de la mutation, 
            
            const { clients } = cache.readQuery({ query: GET_CLIENTS });    // 1º Obtenemos todos los clientes del cache usando una query ( GET_CLIENTS )

            cache.writeQuery({                                              // 2º Escribimos en la cache los clientes actualizados
                query: GET_CLIENTS,                                         // usando como base la query GET_CLIENTS (los clientes existentes) 
                data: { clients: [...clients, addClient] },                 // agregamos la nueva data -> el nuevo cliente al array de clientes de la cache existente
            });                                                             // Se modifica así la respuesta que dará el query GET_CLIENTS  
        },
    }); // El resultado final es un array de clientes con el nuevo cliente agregado

    const onSubmit = (e) => {
        e.preventDefault();

        if (name === '' || email === '' || phone === '') {
        return alert('Please fill in all fields');
        }

        addClient(name, email, phone);

        setName('');
        setEmail('');
        setPhone('');
    };

  return (
    <>
        <button 
            type="button" 
            className="btn btn-secondary" 
            data-bs-toggle="modal" 
            data-bs-target="#addClientModal">
            <div className="d-flex align-items-center">
                <FaUser className='icon'/>
                <div>Add Client</div>
            </div>
        </button>


        <div 
            className="modal fade" 
            id="addClientModal" 
            aria-labelledby="addClientModalLabel" 
            aria-hidden="true"
        >
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 
                    className="modal-title" 
                    id="addClientModalLabel"
                >
                    Add Client
                </h5>
                <button 
                    type="button" 
                    className="btn-close" 
                    data-bs-dismiss="modal" 
                    aria-label="Close">    
                </button>
            </div>
            <div className="modal-body">
                <form onSubmit={ onSubmit }>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={ name }
                            onChange={ (e) => setName(e.target.value) }
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label'>Email</label>
                        <input
                            type='email'
                            className='form-control'
                            id='email'
                            value={ email }
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label'>Phone</label>
                        <input
                            type='text'
                            className='form-control'
                            id='phone'
                            value={ phone }
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <button
                        type='submit'
                        data-bs-dismiss='modal'
                        className='btn btn-secondary'
                    >
                  Submit
                </button>
                </form>
            </div>
            
            </div>
        </div>
        </div>
    </>
  )
}

export default AddClientModal
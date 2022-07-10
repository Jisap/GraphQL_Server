import React from 'react'
import AddClientModal from '../components/AddClientModal'
import AddProjectModal from '../components/AddProjectModal'
import Clients from '../components/Clients'
import Projects from '../components/Projects'

const Home = () => {
  return (
    <>
        <div className="d-flex gap-3 meb-4">
            
            <AddClientModal />
            <AddProjectModal />
        </div>
        <h2 className="mt-5">Projects</h2>
        <Projects />
        <hr />
        <h2>Clients</h2>
        <Clients />
    </>
  )
}

export default Home
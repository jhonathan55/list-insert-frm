import React, { useState } from 'react';
import './App.css';
//impor List
import List from './components/List';
import Insert from './components/Insert';
import data from './data/data'
import Nav from './components/Nav';
// const collaboratorExistsByName = collaborators.some(
    //   (existingCollaborator) =>
    //     existingCollaborator.name.toLowerCase() ===
    //     collaborator.name.toLowerCase()
    // );
    // Verificar si el colaborador ya existe por email
    // const collaboratorExistsByEmail = collaborators.some(
    //   (existingCollaborator) =>
    //     existingCollaborator.email.toLowerCase() ===
    //     collaborator.email.toLowerCase()
    // );
    // if (collaboratorExistsByName) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "El colaborador ya existe con ese nombre!",
    //     footer: "<a href=''>Necesitas ayuda?</a>",
    //   });
    //   return;
    // }
//
import Swal from "sweetalert2";
function App() {

  const [collaborators, setCollaborators] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextId, setNextId] = useState(data.length + 1);
  const handleAddCollaborator = (collaborator) => {
    
    const errorMessages = {
      name: "El colaborador ya existe con ese nombre!",
      email: "El colaborador ya existe con ese email!",
    };

    // Verificar si el colaborador ya existe por nombre o email nav busqueda
    const collaboratorExists = (field) =>
      collaborators.some((existingCollaborator) =>
          existingCollaborator[field].toLowerCase() ===
          collaborator[field].toLowerCase()
      );
    for (const field in errorMessages) {
      if (collaboratorExists(field)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessages[field],
          footer: "<a href=''>Necesitas ayuda?</a>",
        });
        return;
      }
    }

    // Agregar el colaborador
    const updatedCollaborator = {
      ...collaborator,
      id: nextId,
    };
    //
    setCollaborators([...collaborators, updatedCollaborator])
    setNextId(nextId + 1);
  }
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  return (
    <div className="container-fluid">
      <Nav onSearchChange={handleSearchChange} />
      <div className="container">
        <h1>Lista de colaboradores</h1>
        <Insert setCollaborators={collaborators} onSubmit={handleAddCollaborator} />
        <List collaborators={collaborators} searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default App;

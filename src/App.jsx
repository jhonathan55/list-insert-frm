import React, { useState, useEffect } from 'react';
import './App.css';
//impor List
import List from './components/List';
import Insert from './components/Insert';
import Nav from './components/Nav';
import { db } from "./firebase";
import Swal from "sweetalert2";
//firebase
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
function App() {

  const [collaborators, setCollaborators] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [collaboratorToUpdate, setCollaboratorToUpdate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCollection = collection(db, "collaborators");
        const snapshot = await getDocs(getCollection);
        const collaborators = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCollaborators(collaborators);
        console.log("cbt", collaborators);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
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
    };
    //
    setCollaborators([...collaborators, updatedCollaborator])

  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCollection = collection(db, "collaborators");
        const snapshot = await getDocs(getCollection);
        const collaborators = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCollaborators(collaborators);
        console.log('cbt', collaborators);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  const updateCollaborator = async (collaborator) => {
    try {

      const collaboratorRef = doc(db, "collaborators", collaborator.id);
      const payload = {
        name: collaborator.name,
        email: collaborator.email,
      };
      await updateDoc(collaboratorRef, payload);
      const updatedCollaborators = collaborators.map((item) => {
        if (item.id === collaborator.id) {
          return { ...item, ...payload };
        }
        return item;
      });
      setCollaborators(updatedCollaborators);
      setIsUpdating(false);
      setCollaboratorToUpdate(null);
      setFilteredData(updatedCollaborators);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  const handleUpdateCollaborator = (isUpdating, collaboratorToUpdate) => {
    setIsUpdating(isUpdating);
    setCollaboratorToUpdate(collaboratorToUpdate);
  }
  return (
    <div className="container-fluid">
      <Nav onSearchChange={handleSearchChange} />
      <div className="container">
        <h1>Lista de colaboradores</h1>
        <Insert
          onSubmit={handleAddCollaborator}
          onUpdateCollaborator={updateCollaborator}
          isUpdating={isUpdating}
          collaboratorToUpdate={collaboratorToUpdate} />
        <List collaboratorsData={collaborators} searchTerm={searchTerm} onUpdateCollaborator={handleUpdateCollaborator}  />
      </div>
    </div>
  );
}

export default App;

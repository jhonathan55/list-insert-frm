import React, { useState, useEffect } from "react";
import Button from "./Button";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
const List = ({ collaboratorsData, searchTerm,onUpdateCollaborator }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [isUpdating, setIsUpdating] = useState(false);
  // const [collaboratorToUpdate, setCollaboratorToUpdate] = useState(null);

  const itemsPerPage = 2;
  const totalPages = filteredData ? Math.ceil(filteredData?.length / itemsPerPage) : 0;

  useEffect(() => {
    setData(collaboratorsData);

    if (searchTerm === "" || !collaboratorsData) {
      setFilteredData(collaboratorsData);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = collaboratorsData.filter(item =>
        item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.email.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredData(filtered);
    }
  }, [collaboratorsData, searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }
    setCurrentPage(newPage);
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Deseas eliminar el colaborador?',
      text: "Eliminaras permanentemente este colaborador!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado!',
          'Colaborador eliminado con exito.',
          'success'
        )
        deleteCollaborator(id);
      }
    })
  };
  
  const onUpdate=(item)=> {
    console.log(item, "update item");
    onUpdateCollaborator(true, { ...item });

    
  }

  const deleteCollaborator = async (id) => {
    try {
      const docRef = doc(db, "collaborators", id);
      await deleteDoc(docRef);
      const filtered = collaboratorsData.filter((item) => item.id !== id);
      setData(filtered);
      setFilteredData(filtered);
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>email</th>
          <th>actions</th>

        </tr>
      </thead>
      <tbody>
        {filteredData.length === 0 && searchTerm !== "" ? (
          <tr>
            <td colSpan="2" className="text-center">
              No se encontraron coincidencias
            </td>
          </tr>
        ) : (
          filteredData
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((item, index) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>
                  <Button type='warning' icon="edit" onClick={(e) => onUpdate(item)} />
                  <Button type='danger' icon="delete" onClick={(e) => handleDelete(item.id)} />
               </td>
              </tr>
            ))
        )}
      </tbody>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(1)}
            >
              First
            </button>
          </li>
          <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          {currentPage > 1 && (
            <li className="page-item">
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                {currentPage - 1}
              </button>
            </li>
          )}
          <li className="page-item active">
            <button className="page-link" onClick={() => handlePageChange(currentPage)}>
              {currentPage}
            </button>
          </li>
          {currentPage < totalPages && (
            <li className="page-item">
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                {currentPage + 1}
              </button>
            </li>
          )}
          <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
          <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(totalPages)}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    </table>
  );
};

export default List;

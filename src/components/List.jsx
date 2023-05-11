
import React, { useState } from 'react';


const List = ({ collaborators, searchTerm }) => {
    // const [collaborators, setCollaborators] = useState(data);
    const filteredCollaborators = collaborators.filter((collaborator) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        collaborator.name.toLowerCase().includes(searchValue) ||
        collaborator.email.toLowerCase().includes(searchValue) ||
        collaborator.id.toString().includes(searchValue)
      );
    });
    return (
        <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredCollaborators.map((collaborator) => (
            <tr key={collaborator.id}>
              <td>{collaborator.id}</td>
              <td>{collaborator.name}</td>
              <td>{collaborator.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
}
export default List;
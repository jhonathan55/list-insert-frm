import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const Insert = ({ onSubmit, onUpdateCollaborator, isUpdating, collaboratorToUpdate }) => {
    const [Collaborator, setCollaborator] = useState({
        name: '',
        email: ''
    });
    const [inputClasses, setInputClasses] = useState({
        name: "form-control",
        email: "form-control"
    });
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    // const nameInputRef = useRef(null);
    // const emailInputRef = useRef(null);
    useEffect(() => {
        if (isUpdating && collaboratorToUpdate) {
            setIsUpdateMode(true);
            setCollaborator(collaboratorToUpdate);
            setInputClasses({
                name: "form-control is-valid",
                email: "form-control is-valid",
            });
        } else {
            setIsUpdateMode(false);
            resetForm();
        }
    }, [isUpdating, collaboratorToUpdate]);
    const handleChange = (e) => {
        setCollaborator({
            ...Collaborator,
            [e.target.id]: e.target.value
        })
        setInputClasses({
            ...inputClasses,
            [e.target.id]: e.target.value.trim() === "" ? "form-control is-invalid" : "form-control is-valid"
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdateMode) {
            onUpdateCollaborator(Collaborator);
            setIsUpdateMode(false);
        } else {
            try {
                const docRef = await addDoc(collection(db, "collaborators"), {
                    ...Collaborator,
                    createdAt: serverTimestamp()
                });
                if (!docRef) {
                    return Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    });
                }
                console.log(docRef);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Collaborator added successfully',
                    showConfirmButton: false,
                    timer: 1500,

                })
                onSubmit({
                    id: docRef.id,
                    ...Collaborator,
                    createdAt: new Date(),
                });
                resetForm();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const resetForm = () => {
        setCollaborator({
            name: '',
            email: ''
        });
        setInputClasses({
            name: "form-control",
            email: "form-control"
        });
        // nameInputRef.current.focus();
    };

    return (
        <form onSubmit={(event) => handleSubmit(event)}>
            <div className="mb-3">
                <label for="name" className="form-label">Name</label>
                <input type="text" className={inputClasses.name} id="name" value={Collaborator.name} onChange={handleChange}  />
            </div>
            <div className="mb-3">
                <label for="email" className="form-label">email</label>
                <input type="text" className={inputClasses.email} id="email" value={Collaborator.email} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary" >  {isUpdateMode ? "Actualizar" : "Guardar"}</button>
        </form>
    )
}
export default Insert;
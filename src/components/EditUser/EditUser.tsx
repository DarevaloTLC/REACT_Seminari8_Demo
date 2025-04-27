import React, { useState, useEffect } from 'react';
import styles from './EditUser.module.css';
import { updateUser } from '../../services/usersService'; // Importar el servicio

interface User {
    _id: string; // ID del usuario
    name: string;
    email?: string; // Email obligatorio
    age: number;
}

interface EditUserProps {
    user: User | null; // Usuario a editar
    onSave: (updatedUser: User) => void; // Función para guardar los cambios
    onCancel: () => void; // Función para cancelar la edición
}

const EditUser: React.FC<EditUserProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<User>({
        _id: '', // Inicializamos el ID
        name: '',
        email: '',
        age: 0,
    });

    // Inicializa el formulario con los datos del usuario seleccionado
    useEffect(() => {
        if (user) {
            setFormData({
                _id: user._id, // Asegúrate de que el ID se copie correctamente
                name: user.name,
                email: user.email || '', // Proporcionar un valor predeterminado si es undefined
                age: user.age,
            });
        }
    }, [user]);

    // Maneja los cambios en los campos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value, 10) || 0 : value,
        }));
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData._id) {
            alert('User ID is missing. Cannot update user.');
            return;
        }

        try {
            // Llamar al servicio para actualizar el usuario en el backend
            const updatedUser = await updateUser(formData._id, formData);

            // Llamar a la función onSave con los datos actualizados
            onSave(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.');
        }
    };

    return (
        <div className={styles.editUserContainer}>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit} className={styles.editUserForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.saveButton}>
                        Save
                    </button>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
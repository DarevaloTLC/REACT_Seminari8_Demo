import React, { useState, useEffect } from "react";
import { User } from '../../types';
import EditUser from '../EditUser/EditUser'; // Importar el componente EditUser
import styles from './UsersList.module.css'; // Import CSS module
import { fetchUsers } from '../../services/usersService'; // Importar el servicio para obtener usuarios

interface Props {
    users: User[];
}

const UsersList: React.FC<Props> = ({ users }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // Estado para el usuario seleccionado
    const [userList, setUserList] = useState<User[]>([]); // Estado para la lista de usuarios

    // Actualizar userList cuando el prop users cambie
    useEffect(() => {
        setUserList(users);
    }, [users]);

    const handleEditClick = (user: User) => {
        setSelectedUser(user); // Seleccionar un usuario para editar
    };

    const handleSave = async (updatedUser: User) => {
        try {
            // Actualizar la lista de usuarios localmente
            setUserList((prevList) =>
                prevList.map((user) =>
                    user._id === updatedUser._id ? updatedUser : user
                )
            );

            // Hacer una nueva solicitud al backend para obtener la lista actualizada
            const updatedUsers = await fetchUsers();
            setUserList(updatedUsers); // Actualizar el estado con los usuarios actualizados

            setSelectedUser(null); // Cerrar el formulario de edición
        } catch (error) {
            console.error('Error fetching updated users:', error);
            alert('Failed to fetch updated users. Please try again.');
        }
    };

    const handleCancel = () => {
        setSelectedUser(null); // Cerrar el formulario de edición sin guardar
    };

    const renderList = (): React.ReactNode[] => {
        return userList.map((user) => (
            <li key={user._id} className={styles.listItem}>
                <div className={styles.userInfo}>
                    <h2 className={styles.user}>{user.name}</h2>
                    <h3 className={styles.age}>Age: {user.age}</h3>
                    <p className={styles.email}>Email: {user.email}</p>
                    <p className={styles.id}>ID: {user._id}</p> {/* Mostrar el _id */}
                    <button
                        className={styles.editButton}
                        onClick={() => handleEditClick(user)} // Manejar clic en el botón de editar
                    >
                        Edit
                    </button>
                </div>
            </li>
        ));
    };

    return (
        <div>
            {selectedUser ? (
                <EditUser
                    user={selectedUser}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <ul className={styles.list}>
                    {renderList()}
                </ul>
            )}
        </div>
    );
};

export default UsersList;
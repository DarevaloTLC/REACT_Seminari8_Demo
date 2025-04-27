import React, { useReducer } from 'react';
import { User } from '../../types';
import styles from './Form.module.css';
import { addUser } from '../../services/usersService';

interface FormProps {
    onNewUser: (newUser: User) => void;
}

const INITIAL_STATE: User = {
    _id: '', // ID del usuario, se espera que sea un string
    name: '',
    age: 0,
    email: '',
    password: '',
    phone: 0
};

type FormReducerAction =
    | { 
        type: "change_value"; 
        payload: { 
            inputName: keyof User; 
            inputValue: string | number 
        } 
      }
    | { type: "clear" };

const formReducer = (state: User, action: FormReducerAction): User => {
    switch (action.type) {
        case "change_value":
            return {
                ...state,
                [action.payload.inputName]: action.payload.inputValue
            };
        case "clear":
            return INITIAL_STATE;
        default:
            return state;
    }
};

const Form = ({ onNewUser }: FormProps) => {
    const [inputValues, dispatch] = useReducer(formReducer, INITIAL_STATE);

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (!inputValues.name || !inputValues.age || !inputValues.email || !inputValues.password) {
            alert('Please fill out all required fields.');
            return;
        }
        try {
            // Llamar al servicio para agregar un nuevo usuario
            const addedUser = await addUser(inputValues);
            onNewUser(addedUser); // Notificar al componente padre sobre el nuevo usuario
            dispatch({ type: "clear" }); // Limpiar el formulario
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        dispatch({
            type: "change_value",
            payload: {
                inputName: name as keyof User,
                inputValue: name === 'age' || name === 'phone' ? Number(value) : value
            }
        });
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.name}
                        type='text'
                        name="name"
                        id="name"
                        placeholder="Enter your name"
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="age" className={styles.label}>Age</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.age || ''}
                        type='number'
                        name="age"
                        id="age"
                        placeholder="Enter your age"
                        className={styles.input}
                        required
                        min="0"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.email}
                        type='email'
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        onChange={handleChange}
                        value={inputValues.password}
                        type='password'
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button 
                        type="button" 
                        onClick={() => dispatch({ type: "clear" })} 
                        className={styles.button}
                    >
                        Clear
                    </button>
                    <button type="submit" className={styles.button}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;
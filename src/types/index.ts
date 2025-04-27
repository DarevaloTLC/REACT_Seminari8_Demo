export interface User {
    _id: string; // ID del usuario, se espera que sea un string
    name: string;
    age: number;
    email?: string;
    password?: string;
    phone?: number;
}


/*
// EXEMPLE SI LA API ENS RETORNES ATRIBUTS AMB DIF NOM DEL NOSTRE
export type UsersResponseFromApi = Array<{
    nombre: string;
    edad: number;
    correo?: string;
}>;
*/

//
import {signInWithEmailAndPassword} from 'firebase/auth';
import {Alert} from 'react-native';
// En el firebase-config.js se importa el auth
import {auth} from './firebase-config';

/**
 * Función para iniciar sesión
 * @param {string} email
 * @param {string} password
 */

export const loginWithEmailPass = async(email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        Alert.alert("Error", error.message)
    }
};

/** funcion para cerrar la sesion actual */
export const logoutAuth = async() => {
    try {
        await auth.signOut();
    } catch (error) {
        Alert.alert("Error", error.message)
    }
};
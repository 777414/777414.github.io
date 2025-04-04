import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './firebase';

// Регистрация нового пользователя
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    throw error;
  }
};

// Вход пользователя
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Ошибка при входе:', error);
    throw error;
  }
};

// Выход пользователя
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Ошибка при выходе:', error);
    throw error;
  }
};

// Получение текущего пользователя
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}; 
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { uploadImage } from './imageService';

// Функции для работы с ингредиентами
export const saveIngredient = async (ingredient) => {
  try {
    let imageUrl = null;
    if (ingredient.image) {
      imageUrl = await uploadImage(ingredient.image);
    }

    const docRef = await addDoc(collection(db, 'ingredients'), {
      ...ingredient,
      image: imageUrl,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при сохранении ингредиента:', error);
    throw error;
  }
};

export const getIngredients = async () => {
  try {
    const q = query(collection(db, 'ingredients'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Ошибка при получении ингредиентов:', error);
    throw error;
  }
};

export const deleteIngredient = async (id) => {
  try {
    await deleteDoc(doc(db, 'ingredients', id));
  } catch (error) {
    console.error('Ошибка при удалении ингредиента:', error);
    throw error;
  }
};

// Функции для работы с блюдами
export const saveDish = async (dish) => {
  try {
    let imageUrl = null;
    if (dish.image) {
      imageUrl = await uploadImage(dish.image);
    }

    const docRef = await addDoc(collection(db, 'dishes'), {
      ...dish,
      image: imageUrl,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при сохранении блюда:', error);
    throw error;
  }
};

export const getDishes = async () => {
  try {
    const q = query(collection(db, 'dishes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Ошибка при получении блюд:', error);
    throw error;
  }
};

export const deleteDish = async (id) => {
  try {
    await deleteDoc(doc(db, 'dishes', id));
  } catch (error) {
    console.error('Ошибка при удалении блюда:', error);
    throw error;
  }
};

// Функции для работы с потребленными блюдами
export const saveConsumedDish = async (dish) => {
  try {
    const docRef = await addDoc(collection(db, 'consumedDishes'), {
      ...dish,
      consumedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при сохранении потребленного блюда:', error);
    throw error;
  }
};

export const getConsumedDishes = async () => {
  try {
    const q = query(collection(db, 'consumedDishes'), orderBy('consumedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Ошибка при получении потребленных блюд:', error);
    throw error;
  }
};

export const deleteConsumedDish = async (id) => {
  try {
    await deleteDoc(doc(db, 'consumedDishes', id));
  } catch (error) {
    console.error('Ошибка при удалении потребленного блюда:', error);
    throw error;
  }
}; 
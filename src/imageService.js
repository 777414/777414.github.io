// Замените на ваш API ключ от ImgBB
const IMGBB_API_KEY = '2c8465a32d4205233b59a2532450b063';

export const uploadImage = async (base64Image) => {
  try {
    const formData = new FormData();
    formData.append('image', base64Image.split(',')[1]); // Убираем префикс data:image/jpeg;base64,

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('Ошибка при загрузке изображения');
    }
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    throw error;
  }
}; 
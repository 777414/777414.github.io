import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Delete, Save, AddPhotoAlternate } from '@mui/icons-material';
import { getIngredients, saveDish } from '../firebaseUtils';

function Calculator() {
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentIngredients, setCurrentIngredients] = useState([]);
  const [dishName, setDishName] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [dishImage, setDishImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Загружаем ингредиенты из Firebase
    const loadIngredients = async () => {
      try {
        setLoading(true);
        const ingredients = await getIngredients();
        setAvailableIngredients(ingredients);
      } catch (error) {
        console.error('Ошибка при загрузке ингредиентов:', error);
        setError('Не удалось загрузить ингредиенты');
      } finally {
        setLoading(false);
      }
    };
    loadIngredients();
  }, []);

  useEffect(() => {
    // Calculate total calories whenever ingredients change
    let total = 0;
    currentIngredients.forEach(ingredient => {
      if (ingredient.calories && ingredient.quantity) {
        const caloriesPerUnit = parseFloat(ingredient.calories);
        const quantityValue = parseFloat(ingredient.quantity);
        total += (caloriesPerUnit * quantityValue) / 100;
      }
    });
    setTotalCalories(Math.round(total));
  }, [currentIngredients]);

  const handleAddIngredient = () => {
    if (selectedIngredient && quantity) {
      const ingredient = availableIngredients.find(ing => ing.name === selectedIngredient);
      if (ingredient) {
        setCurrentIngredients([
          ...currentIngredients,
          {
            name: ingredient.name,
            quantity: parseFloat(quantity),
            unit: ingredient.unit,
            image: ingredient.image || null,
            calories: ingredient.calories || null,
          },
        ]);
        setQuantity('');
      }
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...currentIngredients];
    newIngredients.splice(index, 1);
    setCurrentIngredients(newIngredients);
  };

  const handleSaveDish = async () => {
    if (dishName && currentIngredients.length > 0) {
      try {
        setLoading(true);
        setError(null);
        
        const newDish = {
          name: dishName,
          ingredients: currentIngredients,
          image: dishImage,
          totalCalories: totalCalories,
        };
        
        await saveDish(newDish);
        
        // Очищаем форму после успешного сохранения
        setDishName('');
        setCurrentIngredients([]);
        setDishImage(null);
        setImagePreview(null);
        setSelectedIngredient('');
        setQuantity('');
        setTotalCalories(0);
      } catch (error) {
        console.error('Ошибка при сохранении блюда:', error);
        setError('Не удалось сохранить блюдо');
      } finally {
        setLoading(false);
      }
    }
  };

  const compressImage = (base64String, maxWidth = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressedImage = await compressImage(reader.result);
        setDishImage(compressedImage);
        setImagePreview(compressedImage);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Калькулятор рецептов
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Название блюда"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="outlined"
          startIcon={<AddPhotoAlternate />}
          onClick={() => setOpenImageDialog(true)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {dishImage ? 'Изменить изображение' : 'Добавить изображение'}
        </Button>

        {imagePreview && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img 
              src={imagePreview} 
              alt="Предпросмотр блюда" 
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
            />
          </Box>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Выберите ингредиент</InputLabel>
          <Select
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
            label="Выберите ингредиент"
          >
            {availableIngredients.map((ingredient, index) => (
              <MenuItem key={index} value={ingredient.name}>
                {ingredient.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Количество"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleAddIngredient}
          fullWidth
          sx={{ mb: 2 }}
        >
          Добавить ингредиент
        </Button>
      </Box>

      {currentIngredients.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Сводка рецепта
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Всего калорий: <strong>{totalCalories} ккал</strong>
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Paper>
      )}

      <List>
        {currentIngredients.map((ingredient, index) => (
          <ListItem key={index}>
            <Grid container spacing={2} alignItems="center">
              {ingredient.image && (
                <Grid item xs={2}>
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.name} 
                    style={{ width: '100%', maxHeight: '50px', objectFit: 'contain' }} 
                  />
                </Grid>
              )}
              <Grid item xs={ingredient.image ? 8 : 10}>
                <ListItemText
                  primary={ingredient.name}
                  secondary={
                    <>
                      {`${ingredient.quantity} ${ingredient.unit}`}
                      {ingredient.calories && (
                        <Typography component="span" variant="body2" color="text.secondary">
                          {` | ${Math.round((parseFloat(ingredient.calories) * ingredient.quantity) / 100)} ккал`}
                        </Typography>
                      )}
                    </>
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  edge="end"
                  aria-label="удалить"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>

      {currentIngredients.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSaveDish}
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить блюдо'}
        </Button>
      )}

      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Добавить изображение блюда</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              component="span"
              fullWidth
              sx={{ mt: 2 }}
            >
              Выбрать изображение
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Calculator; 
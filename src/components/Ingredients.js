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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { Delete, Edit, AddPhotoAlternate } from '@mui/icons-material';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', unit: '', image: null, calories: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedIngredients = JSON.parse(localStorage.getItem('ingredients') || '[]');
    setIngredients(savedIngredients);
  }, []);

  const handleSaveIngredient = () => {
    if (newIngredient.name && newIngredient.unit) {
      const updatedIngredients = [...ingredients, newIngredient];
      setIngredients(updatedIngredients);
      localStorage.setItem('ingredients', JSON.stringify(updatedIngredients));
      setNewIngredient({ name: '', unit: '', image: null, calories: '' });
      setImagePreview(null);
    }
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    localStorage.setItem('ingredients', JSON.stringify(updatedIngredients));
  };

  const handleEditIngredient = (ingredient, index) => {
    setEditingIngredient({ ...ingredient, index });
    setImagePreview(ingredient.image);
    setOpenDialog(true);
    setIsEditing(true);
  };

  const handleUpdateIngredient = () => {
    if (editingIngredient) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[editingIngredient.index] = {
        name: editingIngredient.name,
        unit: editingIngredient.unit,
        image: editingIngredient.image,
        calories: editingIngredient.calories,
      };
      setIngredients(updatedIngredients);
      localStorage.setItem('ingredients', JSON.stringify(updatedIngredients));
      setOpenDialog(false);
      setEditingIngredient(null);
      setImagePreview(null);
      setIsEditing(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) {
          setEditingIngredient({ ...editingIngredient, image: reader.result });
        } else {
          setNewIngredient({ ...newIngredient, image: reader.result });
        }
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Управление ингредиентами
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Название ингредиента"
          value={newIngredient.name}
          onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Единица измерения (г, мл, шт)"
          value={newIngredient.unit}
          onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Калории на 100г/мл"
          type="number"
          value={newIngredient.calories}
          onChange={(e) => setNewIngredient({ ...newIngredient, calories: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          startIcon={<AddPhotoAlternate />}
          onClick={() => setOpenImageDialog(true)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {newIngredient.image ? 'Изменить изображение' : 'Добавить изображение'}
        </Button>

        {imagePreview && !isEditing && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img 
              src={imagePreview} 
              alt="Предпросмотр ингредиента" 
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
            />
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleSaveIngredient}
          fullWidth
        >
          Добавить ингредиент
        </Button>
      </Box>

      <List>
        {ingredients.map((ingredient, index) => (
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
                  secondary={`Единица: ${ingredient.unit}${ingredient.calories ? ` | Калории: ${ingredient.calories} ккал/100${ingredient.unit}` : ''}`}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  edge="end"
                  aria-label="редактировать"
                  onClick={() => handleEditIngredient(ingredient, index)}
                  sx={{ mr: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="удалить"
                  onClick={() => handleDeleteIngredient(index)}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Редактировать ингредиент</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Название ингредиента"
            value={editingIngredient?.name || ''}
            onChange={(e) => setEditingIngredient({ ...editingIngredient, name: e.target.value })}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            fullWidth
            label="Единица измерения"
            value={editingIngredient?.unit || ''}
            onChange={(e) => setEditingIngredient({ ...editingIngredient, unit: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Калории на 100г/мл"
            type="number"
            value={editingIngredient?.calories || ''}
            onChange={(e) => setEditingIngredient({ ...editingIngredient, calories: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<AddPhotoAlternate />}
            onClick={() => setOpenImageDialog(true)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {editingIngredient?.image ? 'Изменить изображение' : 'Добавить изображение'}
          </Button>

          {editingIngredient?.image && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <img 
                src={editingIngredient.image} 
                alt="Предпросмотр ингредиента" 
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleUpdateIngredient} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Добавить изображение ингредиента</DialogTitle>
        <DialogContent>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="ingredient-image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="ingredient-image-upload">
            <Button variant="contained" component="span" fullWidth sx={{ mt: 2 }}>
              Загрузить изображение
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

export default Ingredients; 
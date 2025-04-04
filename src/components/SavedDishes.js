import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';

function SavedDishes() {
  const [savedDishes, setSavedDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const dishes = JSON.parse(localStorage.getItem('savedDishes') || '[]');
    setSavedDishes(dishes);
  }, []);

  const handleDeleteDish = (index) => {
    const updatedDishes = savedDishes.filter((_, i) => i !== index);
    setSavedDishes(updatedDishes);
    localStorage.setItem('savedDishes', JSON.stringify(updatedDishes));
  };

  const handleViewDish = (dish) => {
    setSelectedDish(dish);
    setOpenDialog(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Сохраненные блюда
      </Typography>

      <Grid container spacing={2}>
        {savedDishes.map((dish, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {dish.image ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={dish.image}
                  alt={dish.name}
                  sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 140, 
                    bgcolor: '#f5f5f5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Изображение отсутствует
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {dish.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Создано: {formatDate(dish.date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ингредиентов: {dish.ingredients.length}
                </Typography>
                {dish.totalCalories && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Всего калорий: <strong>{dish.totalCalories} ккал</strong>
                  </Typography>
                )}
              </CardContent>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  aria-label="просмотр"
                  onClick={() => handleViewDish(dish)}
                  sx={{ mr: 1 }}
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  aria-label="удалить"
                  onClick={() => handleDeleteDish(index)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedDish?.name}</DialogTitle>
        <DialogContent>
          {selectedDish?.image && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <img 
                src={selectedDish.image} 
                alt={selectedDish.name} 
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
              />
            </Box>
          )}
          
          {selectedDish?.totalCalories && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="h6">
                Всего калорий: <strong>{selectedDish.totalCalories} ккал</strong>
              </Typography>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Ингредиенты:
          </Typography>
          <List>
            {selectedDish?.ingredients.map((ingredient, index) => (
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
                  <Grid item xs={ingredient.image ? 10 : 12}>
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
                </Grid>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SavedDishes; 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Delete, Add, Visibility } from '@mui/icons-material';

function Expenses() {
  const [consumedDishes, setConsumedDishes] = useState([]);
  const [savedDishes, setSavedDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedSavedDish, setSelectedSavedDish] = useState('');
  const [consumptionDate, setConsumptionDate] = useState('');
  const [consumptionTime, setConsumptionTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Load consumed dishes from localStorage
    const savedConsumedDishes = JSON.parse(localStorage.getItem('consumedDishes') || '[]');
    setConsumedDishes(savedConsumedDishes);
    
    // Load saved dishes for selection
    const savedDishesData = JSON.parse(localStorage.getItem('savedDishes') || '[]');
    setSavedDishes(savedDishesData);
  }, []);

  const handleDeleteConsumedDish = (index) => {
    const updatedDishes = consumedDishes.filter((_, i) => i !== index);
    setConsumedDishes(updatedDishes);
    localStorage.setItem('consumedDishes', JSON.stringify(updatedDishes));
  };

  const handleViewDish = (dish) => {
    setSelectedDish(dish);
    setOpenDialog(true);
  };

  const handleAddConsumedDish = () => {
    if (selectedSavedDish && consumptionDate) {
      const dish = savedDishes.find(d => d.name === selectedSavedDish);
      if (dish) {
        const newConsumedDish = {
          ...dish,
          consumptionDate,
          consumptionTime: consumptionTime || '00:00',
          notes,
          id: Date.now(), // Unique ID for each consumed dish
        };
        
        const updatedConsumedDishes = [...consumedDishes, newConsumedDish];
        setConsumedDishes(updatedConsumedDishes);
        localStorage.setItem('consumedDishes', JSON.stringify(updatedConsumedDishes));
        
        // Reset form
        setSelectedSavedDish('');
        setConsumptionDate('');
        setConsumptionTime('');
        setNotes('');
        setOpenAddDialog(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Group consumed dishes by date
  const groupedDishes = consumedDishes.reduce((groups, dish) => {
    const date = dish.consumptionDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(dish);
    return groups;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedDishes).sort((a, b) => new Date(b) - new Date(a));

  // Calculate total calories for a specific date
  const calculateDailyCalories = (date) => {
    return groupedDishes[date].reduce((total, dish) => total + (dish.totalCalories || 0), 0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Расход (Потребленные блюда)
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAddDialog(true)}
        >
          Добавить блюдо
        </Button>
      </Box>

      {sortedDates.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Нет записей о потребленных блюдах. Добавьте блюдо, нажав на кнопку выше.
          </Typography>
        </Paper>
      ) : (
        sortedDates.map(date => (
          <Box key={date} sx={{ mb: 4 }}>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="h6">
                {formatDate(date)}
              </Typography>
              <Typography variant="body1">
                Всего калорий: <strong>{calculateDailyCalories(date)} ккал</strong>
              </Typography>
            </Paper>
            
            <Grid container spacing={2}>
              {groupedDishes[date].map((dish, index) => (
                <Grid item xs={12} sm={6} md={4} key={dish.id || index}>
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
                        Время: {dish.consumptionTime}
                      </Typography>
                      {dish.totalCalories && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Калории: <strong>{dish.totalCalories} ккал</strong>
                        </Typography>
                      )}
                      {dish.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Заметки: {dish.notes}
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
                        onClick={() => handleDeleteConsumedDish(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}

      {/* Dialog for viewing dish details */}
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
          
          <Typography variant="body1" gutterBottom>
            Дата: {selectedDish?.consumptionDate && formatDate(selectedDish.consumptionDate)}
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            Время: {selectedDish?.consumptionTime}
          </Typography>
          
          {selectedDish?.notes && (
            <Typography variant="body1" gutterBottom>
              Заметки: {selectedDish.notes}
            </Typography>
          )}
          
          {selectedDish?.totalCalories && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="h6">
                Калории: <strong>{selectedDish.totalCalories} ккал</strong>
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

      {/* Dialog for adding a consumed dish */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить потребленное блюдо</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
            <InputLabel>Выберите блюдо</InputLabel>
            <Select
              value={selectedSavedDish}
              onChange={(e) => setSelectedSavedDish(e.target.value)}
              label="Выберите блюдо"
            >
              {savedDishes.map((dish, index) => (
                <MenuItem key={index} value={dish.name}>
                  {dish.name} {dish.totalCalories ? `(${dish.totalCalories} ккал)` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Дата"
            type="date"
            value={consumptionDate}
            onChange={(e) => setConsumptionDate(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            label="Время"
            type="time"
            value={consumptionTime}
            onChange={(e) => setConsumptionTime(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            label="Заметки"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Отмена</Button>
          <Button onClick={handleAddConsumedDish} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Expenses; 
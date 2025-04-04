import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Calculate, Restaurant, Bookmark, LocalDining } from '@mui/icons-material';
import Calculator from './components/Calculator';
import Ingredients from './components/Ingredients';
import SavedDishes from './components/SavedDishes';
import Expenses from './components/Expenses';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <h1>Калькулятор рецептов</h1>
        </AppBar>
        
        <main style={{ padding: '20px', marginBottom: '60px' }}>
          <Routes>
            <Route path="/" element={<Expenses />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/saved-dishes" element={<SavedDishes />} />
          </Routes>
        </main>

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation>
            <BottomNavigationAction
              label="Расход"
              icon={<LocalDining />}
              component={Link}
              to="/"
            />
            <BottomNavigationAction
              label="Калькулятор"
              icon={<Calculate />}
              component={Link}
              to="/calculator"
            />
            <BottomNavigationAction
              label="Ингредиенты"
              icon={<Restaurant />}
              component={Link}
              to="/ingredients"
            />
            <BottomNavigationAction
              label="Сохраненные"
              icon={<Bookmark />}
              component={Link}
              to="/saved-dishes"
            />
          </BottomNavigation>
        </Paper>
      </div>
    </Router>
  );
}

export default App;

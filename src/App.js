import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  IconButton,
} from '@mui/material';
import {
  Calculate,
  Restaurant,
  Save,
  LocalDining,
  Logout,
} from '@mui/icons-material';
import Calculator from './components/Calculator';
import Ingredients from './components/Ingredients';
import SavedDishes from './components/SavedDishes';
import Expenses from './components/Expenses';
import Auth from './components/Auth';
import { getCurrentUser, logoutUser } from './auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Ошибка при инициализации аутентификации:', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  if (loading) {
    return null; // или можно показать спиннер
  }

  if (!user) {
    return <Auth onAuthSuccess={() => setUser(true)} />;
  }

  return (
    <Router>
      <Box sx={{ pb: 7 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Калькулятор рецептов
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Expenses />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/saved" element={<SavedDishes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <BottomNavigation
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
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
            icon={<Save />}
            component={Link}
            to="/saved"
          />
        </BottomNavigation>
      </Box>
    </Router>
  );
}

export default App;

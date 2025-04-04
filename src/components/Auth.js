import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from '@mui/material';
import { loginUser, registerUser } from '../auth';

function Auth({ onAuthSuccess }) {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (tab === 0) {
        // Вход
        await loginUser(email, password);
      } else {
        // Регистрация
        await registerUser(email, password);
      }
      onAuthSuccess();
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      setError(
        error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
          ? 'Неверный email или пароль'
          : error.code === 'auth/email-already-in-use'
          ? 'Этот email уже используется'
          : 'Произошла ошибка при аутентификации'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Вход" />
          <Tab label="Регистрация" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : tab === 0 ? (
              'Войти'
            ) : (
              'Зарегистрироваться'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Auth; 
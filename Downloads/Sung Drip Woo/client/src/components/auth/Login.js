import React, { useContext, useState } from 'react';
import { Container, Card, CardContent, CardHeader, TextField, Button, Box, Alert } from '@mui/material';
import AuthContext from '../../context/auth/authContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, isAuthenticated, loading, error } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) {
      setValidationError('Email and password are required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await login({ email, password });
    if (ok) {
      navigate('/');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ maxWidth: 500, mx: 'auto' }}>
        <CardHeader title="Login" subheader="Sign in to your account" />
        <CardContent>
          <Box component="form" onSubmit={onSubmit}>
            {validationError && <Alert severity="warning" sx={{ mb: 2 }}>{validationError}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
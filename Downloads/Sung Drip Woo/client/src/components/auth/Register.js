import React, { useContext, useState } from 'react';
import { Container, Card, CardContent, CardHeader, TextField, Button, Box, Alert, FormControlLabel, Checkbox } from '@mui/material';
import AuthContext from '../../context/auth/authContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, loading, error } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTailor, setIsTailor] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setValidationError('All fields are required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await register({ firstName, lastName, email, password, isTailor });
    if (ok) {
      navigate('/');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardHeader title="Register" subheader="Create your account" />
        <CardContent>
          <Box component="form" onSubmit={onSubmit}>
            {validationError && <Alert severity="warning" sx={{ mb: 2 }}>{validationError}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
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
              helperText="Minimum 6 characters"
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <FormControlLabel
              control={<Checkbox checked={isTailor} onChange={(e) => setIsTailor(e.target.checked)} />}
              label="I am a tailor"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
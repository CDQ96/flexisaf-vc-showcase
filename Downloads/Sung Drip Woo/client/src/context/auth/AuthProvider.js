import React, { useEffect, useMemo, useState } from 'react';
import AuthContext from './authContext';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAuthToken(token);
    setIsAuthenticated(!!token);
    if (token) {
      loadUser();
    } else {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load user', err);
      setError(err?.response?.data?.msg || 'Failed to load user');
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post('/api/auth/login', { email, password });
      const newToken = res.data?.token;
      if (!newToken) throw new Error('No token returned');
      setToken(newToken);
      localStorage.setItem('token', newToken);
      return true;
    } catch (err) {
      console.error('Login failed', err);
      setError(err?.response?.data?.msg || 'Invalid credentials');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  const register = async ({ firstName, lastName, email, password, role, isTailor }) => {
    try {
      setLoading(true);
      setError(null);
      const body = { firstName, lastName, email, password };
      if (typeof role !== 'undefined') body.role = role;
      if (typeof isTailor !== 'undefined') body.isTailor = isTailor;
      const res = await axios.post('/api/auth/register', body);
      const newToken = res.data?.token;
      if (!newToken) throw new Error('No token returned');
      setToken(newToken);
      localStorage.setItem('token', newToken);
      return true;
    } catch (err) {
      console.error('Registration failed', err);
      setError(err?.response?.data?.msg || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    reloadUser: loadUser,
  }), [token, user, isAuthenticated, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
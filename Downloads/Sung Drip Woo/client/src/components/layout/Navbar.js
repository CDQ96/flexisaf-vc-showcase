import React, { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Box
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AuthContext from '../../context/auth/authContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated = false, logout = () => {}, user = null } = authContext || {};

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    try {
      logout();
    } catch (_) {
      // no-op if logout is not provided
    }
    handleClose();
  };

  const authLinks = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button color="inherit" component={RouterLink} to="/measurements/dashboard" sx={{ ml: 2 }}>
        Measurements
      </Button>
      <IconButton color="inherit">
        <Badge badgeContent={4} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {user && user.avatar ? (
          <Avatar sx={{ width: 32, height: 32, mr: 1 }} src={user.avatar} />
        ) : (
          <AccountCircle />
        )}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          component={RouterLink}
          to={user && user.role === 'tailor' ? '/dashboard/tailor' : '/dashboard/customer'}
          onClick={handleClose}
        >
          Dashboard
        </MenuItem>
        <MenuItem component={RouterLink} to="/measurements/enhanced" onClick={handleClose}>
          New Measurement
        </MenuItem>
        <MenuItem component={RouterLink} to="/measurements/display" onClick={handleClose}>
          View Measurements
        </MenuItem>
        <MenuItem component={RouterLink} to="/measurements/validator" onClick={handleClose}>
          Validate Measurements
        </MenuItem>
        <MenuItem component={RouterLink} to="/measurements/interactive-guide" onClick={handleClose}>
          📏 Interactive Guide
        </MenuItem>
        <MenuItem component={RouterLink} to="/measurements/simple-instructions" onClick={handleClose}>
          📖 Simple Instructions
        </MenuItem>
        <MenuItem component={RouterLink} to="/measurements/visual-guide" onClick={handleClose}>
          👁️ Visual Guide
        </MenuItem>
        <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );

  const guestLinks = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button color="inherit" component={RouterLink} to="/tailors">
        Find Tailors
      </Button>
      <Button color="inherit" component={RouterLink} to="/login">
        Login
      </Button>
      <Button color="inherit" variant="outlined" component={RouterLink} to="/register">
        Register
      </Button>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}
          >
            TailorConnect
          </Typography>
          {isAuthenticated ? authLinks : guestLinks}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
import React, { useContext, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
} from '@mui/material';
import AuthContext from '../../context/auth/authContext';

const DashboardCard = ({ title, description, to, actionLabel }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </CardContent>
    <CardActions>
      {to && (
        <Button component={RouterLink} to={to} variant="contained" size="small">
          {actionLabel || 'Open'}
        </Button>
      )}
    </CardActions>
  </Card>
);

const TailorDashboard = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const isTailor = useMemo(() => {
    const role = user?.role || user?.isTailor;
    if (typeof role === 'string') return role.toLowerCase() === 'tailor';
    if (typeof role === 'boolean') return role === true;
    return false;
  }, [user]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Tailor Dashboard</Typography>
        <Typography>Please log in to access tailor tools.</Typography>
        <Button variant="contained" component={RouterLink} to="/login" sx={{ mt: 2 }}>Login</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {user ? `Welcome, ${user.firstName || user.name || 'Tailor'}!` : 'Tailor Dashboard'}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your shop, customer measurements, and orders.
      </Typography>

      {!isTailor && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your account is not set as a Tailor. Some features may be restricted.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="My Shop"
            description="Update your tailor profile, specialties, pricing, and availability."
            to="/tailors"
            actionLabel="View Profile"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="Customer Measurements"
            description="Review and validate customer measurements or schedule fittings."
            to="/measurements"
            actionLabel="Open Measurements"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="Orders"
            description="Track orders in progress and update their statuses."
            to="/delivery"
            actionLabel="Manage Orders"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TailorDashboard;
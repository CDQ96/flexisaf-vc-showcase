import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';
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

const SectionCard = ({ title, children, action }) => (
  <Card elevation={1} sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{title}</Typography>
        {action}
      </Box>
      <Box sx={{ mt: 1 }}>{children}</Box>
    </CardContent>
  </Card>
);

const CustomerDashboard = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [measurements, setMeasurements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadMeasurements = async () => {
      try {
        const res = await axios.get('/api/measurements');
        setMeasurements(Array.isArray(res.data) ? res.data.slice(0, 5) : []);
      } catch (_) {
        // Fallback mock data
        setMeasurements([
          { id: 'm1', type: 'Suit', date: '2025-03-01', notes: 'Measured by tailor' },
          { id: 'm2', type: 'Dress', date: '2025-03-05', notes: 'Customer self-measured' },
        ]);
      }
    };

    const loadOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrders(Array.isArray(res.data) ? res.data.slice(0, 5) : []);
      } catch (_) {
        setOrders([
          { id: 'o1', item: 'Custom Suit', status: 'processing', total: 199.99 },
          { id: 'o2', item: 'Evening Dress', status: 'pending', total: 149.99 },
        ]);
      }
    };

    const loadPayments = async () => {
      try {
        const res = await axios.get('/api/payments');
        setPayments(Array.isArray(res.data) ? res.data.slice(0, 5) : []);
      } catch (_) {
        setPayments([
          { id: 'p1', amount: 199.99, currency: 'usd', status: 'succeeded', date: '2025-03-01' },
          { id: 'p2', amount: 149.99, currency: 'usd', status: 'requires_payment_method', date: '2025-03-06' },
        ]);
      }
    };

    loadMeasurements();
    loadOrders();
    loadPayments();
  }, [isAuthenticated]);

  // If not authenticated, guide user to login
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Welcome to your Customer Dashboard</Typography>
        <Typography variant="body1" gutterBottom>
          Please log in to access your orders, measurements, and tailor discovery.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {user ? `Hello, ${user.firstName || user.name || 'Customer'}!` : 'Customer Dashboard'}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your tailoring journey: discover tailors, track measurements, place orders, and follow deliveries.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="Find Tailors"
            description="Discover skilled local tailors and view their specialties, pricing, and ratings."
            to="/tailors"
            actionLabel="Browse Tailors"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="Measurements"
            description="Add, view, and validate your measurements, or book an appointment with a tailor."
            to="/measurements"
            actionLabel="Open Measurements"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="Checkout"
            description="Proceed to payment for your tailoring orders with secure checkout."
            to="/checkout"
            actionLabel="Go to Checkout"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="Delivery Tracking"
            description="Track the delivery status of your tailored garments."
            to="/delivery"
            actionLabel="Track Delivery"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SectionCard
            title="Recent Measurements"
            action={<Button size="small" component={RouterLink} to="/measurements">View All</Button>}
          >
            <List>
              {measurements.map((m) => (
                <ListItem key={m.id || m._id}>
                  <ListItemText
                    primary={`${m.type || m.category || 'Measurement'} - ${m.date || ''}`}
                    secondary={m.notes || m.description || ''}
                  />
                </ListItem>
              ))}
              {measurements.length === 0 && (
                <ListItem>
                  <ListItemText primary="No measurements found" />
                </ListItem>
              )}
            </List>
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard
            title="Recent Orders"
            action={<Button size="small" component={RouterLink} to="/delivery">Manage Orders</Button>}
          >
            <List>
              {orders.map((o) => (
                <ListItem key={o.id || o._id}>
                  <ListItemText
                    primary={`${o.item || o.product || 'Order'} - ${o.status || 'unknown'}`}
                    secondary={`Total: ${(o.total || o.amount || 0).toFixed ? (o.total || o.amount || 0).toFixed(2) : o.total || o.amount || 0}`}
                  />
                </ListItem>
              ))}
              {orders.length === 0 && (
                <ListItem>
                  <ListItemText primary="No orders found" />
                </ListItem>
              )}
            </List>
          </SectionCard>
        </Grid>
        <Grid item xs={12}>
          <SectionCard
            title="Payment History"
            action={<Button size="small" component={RouterLink} to="/checkout">Make a Payment</Button>}
          >
            <List>
              {payments.map((p) => (
                <ListItem key={p.id || p._id}>
                  <ListItemText
                    primary={`$${p.amount} ${p.currency?.toUpperCase ? p.currency.toUpperCase() : (p.currency || '')}`}
                    secondary={`Status: ${p.status || 'unknown'} ${p.date ? `• ${p.date}` : ''}`}
                  />
                </ListItem>
              ))}
              {payments.length === 0 && (
                <ListItem>
                  <ListItemText primary="No payments found" />
                </ListItem>
              )}
            </List>
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDashboard;
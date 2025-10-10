import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CheckoutForm from './CheckoutForm';

// Load Stripe outside of component render to avoid recreating the Stripe object on every render
// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51NxSampleStripeKeyForDevelopment');

const PaymentWrapper = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load order details');
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Paper>
    );
  }

  if (!order) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order Not Found
        </Typography>
        <Typography variant="body1">
          The order you're looking for could not be found. Please check the order ID and try again.
        </Typography>
      </Paper>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm order={order} />
    </Elements>
  );
};

export default PaymentWrapper;
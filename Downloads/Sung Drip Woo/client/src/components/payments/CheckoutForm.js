import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Grid,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = ['Review Order', 'Payment', 'Confirmation'];

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post('/api/payments/create-payment-intent', {
          orderId: order.id
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError(err.response?.data?.msg || 'An error occurred while setting up payment');
      }
    };

    if (order && order.id) {
      createPaymentIntent();
    }
  }, [order]);

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  const handleChange = (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      setProcessing(false);
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setSucceeded(true);
      setProcessing(false);
      setActiveStep(2);
      
      // Navigate to order confirmation after a short delay
      setTimeout(() => {
        navigate(`/dashboard/orders/${order.id}`);
      }, 2000);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {activeStep === 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Order Summary
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Order Number:</Typography>
              <Typography variant="body1" gutterBottom>{order.orderNumber}</Typography>
              
              <Typography variant="subtitle1">Tailor:</Typography>
              <Typography variant="body1" gutterBottom>{order.Tailor?.shopName}</Typography>
              
              <Typography variant="subtitle1">Order Date:</Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Items:</Typography>
              <Typography variant="body1" gutterBottom>{order.orderDetails}</Typography>
              
              <Typography variant="subtitle1">Status:</Typography>
              <Typography variant="body1" gutterBottom>{order.status}</Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">Total Amount:</Typography>
              <Typography variant="h4" color="primary">${order.totalPrice.toFixed(2)}</Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setActiveStep(1)}
              size="large"
            >
              Proceed to Payment
            </Button>
          </Box>
        </Box>
      )}
      
      {activeStep === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Payment Details
          </Typography>
          
          <Typography variant="body1" paragraph>
            Your payment will be held in escrow until you confirm receipt of your order.
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Amount: ${order.totalPrice.toFixed(2)}
            </Typography>
            
            <form id="payment-form" onSubmit={handleSubmit}>
              <Box sx={{ 
                border: '1px solid #e0e0e0', 
                p: 2, 
                borderRadius: 1,
                mb: 3
              }}>
                <CardElement 
                  id="card-element" 
                  options={cardStyle} 
                  onChange={handleChange} 
                />
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Button
                disabled={processing || !stripe || succeeded}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                {processing ? (
                  <CircularProgress size={24} />
                ) : (
                  'Pay Now'
                )}
              </Button>
            </form>
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="outlined"
              onClick={() => setActiveStep(0)}
              disabled={processing}
            >
              Back to Order Summary
            </Button>
          </Box>
        </Box>
      )}
      
      {activeStep === 2 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom color="primary">
            Payment Successful!
          </Typography>
          
          <Typography variant="body1" paragraph>
            Your payment has been processed successfully and is being held in escrow.
          </Typography>
          
          <Typography variant="body1" paragraph>
            You will be redirected to your order details page shortly.
          </Typography>
          
          <CircularProgress size={30} sx={{ mt: 2 }} />
        </Box>
      )}
    </Paper>
  );
};

export default CheckoutForm;
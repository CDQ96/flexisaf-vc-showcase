import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DeliveryTracker = ({ orderId, trackingCode }) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingInput, setTrackingInput] = useState(trackingCode || '');
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Pending',
    'Assigned to Rider',
    'Pickup in Progress',
    'Picked Up',
    'In Transit',
    'Delivered'
  ];

  const statusToStep = {
    'pending': 0,
    'assigned': 1,
    'pickup_in_progress': 2,
    'picked_up': 3,
    'in_transit': 4,
    'delivered': 5,
    'failed': -1
  };

  useEffect(() => {
    if (orderId || trackingCode) {
      fetchDeliveryInfo();
    }
  }, [orderId, trackingCode]);

  const fetchDeliveryInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (orderId) {
        response = await axios.get(`/api/delivery/order/${orderId}`);
      } else if (trackingCode || trackingInput) {
        response = await axios.get(`/api/delivery/tracking/${trackingCode || trackingInput}`);
      } else {
        throw new Error('No order ID or tracking code provided');
      }
      
      setDelivery(response.data);
      setActiveStep(statusToStep[response.data.status] || 0);
      
      // Set map center if location is available
      if (response.data.currentLocation) {
        const coords = response.data.currentLocation.coordinates;
        setMapCenter([coords[1], coords[0]]);
      }
    } catch (err) {
      console.error('Error fetching delivery:', err);
      setError(err.response?.data?.msg || 'Failed to fetch delivery information');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackingSubmit = (e) => {
    e.preventDefault();
    if (trackingInput) {
      fetchDeliveryInfo();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!orderId && !trackingCode && !delivery) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Track Your Delivery
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Enter your tracking code to see the status of your delivery.
        </Typography>
        
        <Box component="form" onSubmit={handleTrackingSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Tracking Code"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!trackingInput}
          >
            Track Delivery
          </Button>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Delivery Tracking
      </Typography>
      
      {delivery.status === 'failed' ? (
        <Alert severity="error" sx={{ my: 2 }}>
          This delivery has failed. Please contact customer support for assistance.
        </Alert>
      ) : (
        <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Delivery Details
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Tracking Code
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {delivery.trackingCode}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                Status
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {delivery.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                Pickup Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formatDate(delivery.pickupDate)}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                Estimated/Actual Delivery Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formatDate(delivery.deliveryDate)}
              </Typography>
              
              {delivery.notes && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    Notes
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {delivery.notes}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Current Location
            </Typography>
            {delivery.currentLocation ? (
              <Box sx={{ height: 250, width: '100%', mb: 2 }}>
                <MapContainer 
                  center={mapCenter} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={mapCenter}>
                    <Popup>
                      Current location of your delivery
                    </Popup>
                  </Marker>
                </MapContainer>
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary">
                Location tracking not available yet
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={fetchDeliveryInfo}
        >
          Refresh Status
        </Button>
      </Box>
    </Paper>
  );
};

export default DeliveryTracker;
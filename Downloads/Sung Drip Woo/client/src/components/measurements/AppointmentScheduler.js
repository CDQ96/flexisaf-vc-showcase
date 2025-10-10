import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppointmentScheduler = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tailors, setTailors] = useState([]);
  const [formData, setFormData] = useState({
    tailorId: '',
    date: null,
    time: null,
    address: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        const res = await axios.get('/api/tailors');
        setTailors(res.data);
      } catch (err) {
        console.error('Error fetching tailors:', err);
      }
    };

    fetchTailors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate
    });
  };

  const handleTimeChange = (newTime) => {
    setFormData({
      ...formData,
      time: newTime
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tailorId) newErrors.tailorId = 'Please select a tailor';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.time) newErrors.time = 'Please select a time';
    if (!formData.address) newErrors.address = 'Please provide an address for the appointment';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await axios.post('/api/measurements/schedule', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/measurements');
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setErrors({ ...errors, server: err.response.data.msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Schedule In-Person Measurement
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Book an appointment with a tailor for professional measurements.
      </Typography>
      
      {success ? (
        <Alert severity="success" sx={{ my: 2 }}>
          Your appointment has been scheduled successfully! Redirecting to measurements page...
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormControl fullWidth margin="normal" error={!!errors.tailorId}>
            <InputLabel id="tailor-select-label">Select Tailor</InputLabel>
            <Select
              labelId="tailor-select-label"
              id="tailorId"
              name="tailorId"
              value={formData.tailorId}
              onChange={handleChange}
              label="Select Tailor"
            >
              {tailors.map((tailor) => (
                <MenuItem key={tailor.id} value={tailor.id}>
                  {tailor.shopName} - {tailor.User.firstName} {tailor.User.lastName}
                </MenuItem>
              ))}
            </Select>
            {errors.tailorId && (
              <Typography variant="caption" color="error">
                {errors.tailorId}
              </Typography>
            )}
          </FormControl>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Appointment Details
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Appointment Date"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!errors.date}
                      helperText={errors.date}
                    />
                  )}
                  disablePast
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Appointment Time"
                  value={formData.time}
                  onChange={handleTimeChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!errors.time}
                      helperText={errors.time}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="address"
            label="Appointment Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address || "Where would you like to meet the tailor?"}
            multiline
            rows={2}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="notes"
            label="Additional Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            helperText="Any special requests or information for the tailor"
          />
          
          {errors.server && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errors.server}
            </Typography>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard/measurements')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Schedule Appointment'}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default AppointmentScheduler;
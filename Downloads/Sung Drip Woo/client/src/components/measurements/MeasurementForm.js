import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MeasurementForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    neck: '',
    bust: '',
    waist: '',
    hip: '',
    shoulder: '',
    sleeve: '',
    inseam: '',
    outseam: '',
    thigh: '',
    calf: '',
    additionalMeasurements: {},
    notes: '',
    isDefault: false,
    measurementType: 'digital'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Please provide a name for this measurement set';
    
    // Basic validation for numeric fields
    const numericFields = ['neck', 'bust', 'waist', 'hip', 'shoulder', 'sleeve', 'inseam', 'outseam', 'thigh', 'calf'];
    numericFields.forEach(field => {
      if (formData[field] && isNaN(formData[field])) {
        newErrors[field] = 'Must be a number';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const res = await axios.post('/api/measurements', formData);
      navigate('/dashboard/measurements');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setErrors({ ...errors, server: err.response.data.msg });
      }
    }
  };

  const measurementGuides = {
    neck: 'Measure around the base of the neck, at the collar level',
    bust: 'Measure around the fullest part of the chest',
    waist: 'Measure around the narrowest part of the waist',
    hip: 'Measure around the fullest part of the hips',
    shoulder: 'Measure from shoulder tip to shoulder tip across the back',
    sleeve: 'Measure from shoulder tip to wrist',
    inseam: 'Measure from crotch to ankle on the inside of the leg',
    outseam: 'Measure from waist to ankle on the outside of the leg',
    thigh: 'Measure around the fullest part of the thigh',
    calf: 'Measure around the fullest part of the calf'
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Measurements
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Please provide your measurements in inches. For the most accurate results, have someone else take your measurements.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Measurement Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name || "E.g., 'My Formal Wear Measurements'"}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={formData.isDefault}
              onChange={handleSwitchChange}
              name="isDefault"
              color="primary"
            />
          }
          label="Set as default measurements"
          sx={{ my: 2 }}
        />
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Upper Body Measurements
        </Typography>
        
        <Grid container spacing={3}>
          {['neck', 'bust', 'shoulder', 'sleeve', 'waist'].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  InputProps={{
                    endAdornment: <Typography variant="body2">in</Typography>
                  }}
                />
                <Tooltip title={measurementGuides[field]}>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Lower Body Measurements
        </Typography>
        
        <Grid container spacing={3}>
          {['hip', 'inseam', 'outseam', 'thigh', 'calf'].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  InputProps={{
                    endAdornment: <Typography variant="body2">in</Typography>
                  }}
                />
                <Tooltip title={measurementGuides[field]}>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <TextField
          margin="normal"
          fullWidth
          id="notes"
          label="Additional Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={4}
          helperText="Any special considerations or details about your measurements"
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
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Save Measurements
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default MeasurementForm;
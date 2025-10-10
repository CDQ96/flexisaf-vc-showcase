import React, { useState, useEffect } from 'react';
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
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  HelpOutline as HelpOutlineIcon,
  SwapHoriz as SwapHorizIcon,
  Calculate as CalculateIcon,
  Straighten as StraightenIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  UNITS,
  UNIT_SYMBOLS,
  convertUnit,
  formatMeasurement,
  validateMeasurement,
  getMeasurementSuggestion,
  calculateBMI
} from '../../utils/unitConversion';

const EnhancedMeasurementForm = () => {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState(UNITS.INCHES);
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
    height: '',
    weight: '',
    additionalMeasurements: {},
    notes: '',
    isDefault: false,
    measurementType: 'self'
  });

  const [errors, setErrors] = useState({});
  const [validationMessages, setValidationMessages] = useState({});
  const [bmiData, setBmiData] = useState(null);

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
    calf: 'Measure around the fullest part of the calf',
    height: 'Total height from head to toe',
    weight: 'Body weight in pounds'
  };

  const measurementCategories = {
    'Upper Body': ['neck', 'bust', 'shoulder', 'sleeve', 'waist'],
    'Lower Body': ['hip', 'inseam', 'outseam', 'thigh', 'calf'],
    'General': ['height', 'weight']
  };

  useEffect(() => {
    // Calculate BMI when height and weight change
    if (formData.height && formData.weight) {
      const bmi = calculateBMI(formData.height, selectedUnit, formData.weight);
      setBmiData(bmi);
    } else {
      setBmiData(null);
    }
  }, [formData.height, formData.weight, selectedUnit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    if (value && !['name', 'notes', 'weight'].includes(name)) {
      const validation = validateMeasurement(value, name, selectedUnit);
      setValidationMessages({
        ...validationMessages,
        [name]: validation.message
      });
    } else {
      const newValidationMessages = { ...validationMessages };
      delete newValidationMessages[name];
      setValidationMessages(newValidationMessages);
    }
  };

  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const handleUnitChange = (newUnit) => {
    const convertedData = { ...formData };
    
    // Convert all measurement values to new unit
    Object.keys(measurementGuides).forEach(field => {
      if (convertedData[field] && !isNaN(convertedData[field]) && field !== 'weight') {
        convertedData[field] = formatMeasurement(
          convertUnit(convertedData[field], selectedUnit, newUnit),
          newUnit
        );
      }
    });
    
    setFormData(convertedData);
    setSelectedUnit(newUnit);
  };

  const applySizeSuggestions = (size) => {
    const suggestions = {};
    ['bust', 'waist', 'hip'].forEach(measurement => {
      const suggestion = getMeasurementSuggestion(measurement, size, selectedUnit);
      if (suggestion) {
        suggestions[measurement] = formatMeasurement(suggestion, selectedUnit);
      }
    });
    
    setFormData({
      ...formData,
      ...suggestions
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Please provide a name for this measurement set';
    
    // Validate all measurements
    Object.keys(measurementGuides).forEach(field => {
      if (formData[field] && field !== 'weight') {
        const validation = validateMeasurement(formData[field], field, selectedUnit);
        if (!validation.isValid) {
          newErrors[field] = validation.message;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Convert all measurements to inches for storage
      const dataToSubmit = { ...formData };
      Object.keys(measurementGuides).forEach(field => {
        if (dataToSubmit[field] && !isNaN(dataToSubmit[field]) && field !== 'weight') {
          dataToSubmit[field] = convertUnit(dataToSubmit[field], selectedUnit, UNITS.INCHES);
        }
      });
      
      const res = await axios.post('/api/measurements', dataToSubmit);
      navigate('/dashboard/measurements');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setErrors({ ...errors, server: err.response.data.msg });
      }
    }
  };

  const renderMeasurementField = (field) => (
    <Grid item xs={12} sm={6} key={field}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <TextField
          margin="normal"
          fullWidth
          id={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          error={!!errors[field]}
          helperText={errors[field] || validationMessages[field]}
          InputProps={{
            endAdornment: (
              <Typography variant="body2" sx={{ minWidth: '20px' }}>
                {field === 'weight' ? 'lbs' : UNIT_SYMBOLS[selectedUnit]}
              </Typography>
            )
          }}
        />
        <Tooltip title={measurementGuides[field]}>
          <IconButton size="small" sx={{ ml: 1, mt: 2 }}>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Grid>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: 'auto', my: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <StraightenIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" gutterBottom>
          Enhanced Measurement Tool
        </Typography>
      </Box>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Accurate measurements are crucial for perfect fit. Use our enhanced tools with unit conversion and validation.
      </Typography>

      {/* Unit Selection */}
      <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Measurement Unit:</Typography>
              <FormControl size="small">
                <Select
                  value={selectedUnit}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  startAdornment={<SwapHorizIcon sx={{ mr: 1 }} />}
                >
                  <MenuItem value={UNITS.INCHES}>Inches (in)</MenuItem>
                  <MenuItem value={UNITS.CENTIMETERS}>Centimeters (cm)</MenuItem>
                  <MenuItem value={UNITS.FEET}>Feet (ft)</MenuItem>
                  <MenuItem value={UNITS.METERS}>Meters (m)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>Quick Size:</Typography>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <Chip
                  key={size}
                  label={size}
                  size="small"
                  onClick={() => applySizeSuggestions(size)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Measurement Set Name"
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
        
        {/* Render measurement categories */}
        {Object.entries(measurementCategories).map(([category, fields]) => (
          <Box key={category}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CalculateIcon sx={{ mr: 1 }} />
              {category} Measurements
            </Typography>
            <Grid container spacing={3}>
              {fields.map(renderMeasurementField)}
            </Grid>
          </Box>
        ))}
        
        {/* BMI Display */}
        {bmiData && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>BMI: {bmiData.bmi}</strong> ({bmiData.category}) | 
              Height: {bmiData.heightInMeters}m | Weight: {bmiData.weightInKg}kg
            </Typography>
          </Alert>
        )}
        
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
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.server}
          </Alert>
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
            startIcon={<StraightenIcon />}
          >
            Save Measurements
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EnhancedMeasurementForm;
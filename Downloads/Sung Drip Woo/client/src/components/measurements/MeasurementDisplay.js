import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Compare as CompareIcon,
  SwapHoriz as SwapHorizIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import {
  UNITS,
  UNIT_SYMBOLS,
  convertUnit,
  formatMeasurement,
  calculateBMI
} from '../../utils/unitConversion';

const MeasurementDisplay = ({ measurements = [], onEdit, onDelete, onCompare }) => {
  const [selectedUnit, setSelectedUnit] = useState(UNITS.INCHES);
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  const measurementLabels = {
    neck: 'Neck',
    bust: 'Bust/Chest',
    waist: 'Waist',
    hip: 'Hip',
    shoulder: 'Shoulder',
    sleeve: 'Sleeve',
    inseam: 'Inseam',
    outseam: 'Outseam',
    thigh: 'Thigh',
    calf: 'Calf',
    height: 'Height',
    weight: 'Weight'
  };

  const convertMeasurement = (value, field) => {
    if (!value || isNaN(value)) return '-';
    if (field === 'weight') return `${value} lbs`;
    
    const converted = convertUnit(value, UNITS.INCHES, selectedUnit);
    return `${formatMeasurement(converted, selectedUnit)} ${UNIT_SYMBOLS[selectedUnit]}`;
  };

  const getBMIForMeasurement = (measurement) => {
    if (measurement.height && measurement.weight) {
      return calculateBMI(measurement.height, UNITS.INCHES, measurement.weight);
    }
    return null;
  };

  const handleCompareToggle = (measurementId) => {
    if (selectedMeasurements.includes(measurementId)) {
      setSelectedMeasurements(selectedMeasurements.filter(id => id !== measurementId));
    } else if (selectedMeasurements.length < 3) {
      setSelectedMeasurements([...selectedMeasurements, measurementId]);
    }
  };

  const getComparisonData = () => {
    return measurements.filter(m => selectedMeasurements.includes(m.id));
  };

  const calculateDifference = (value1, value2, field) => {
    if (!value1 || !value2 || isNaN(value1) || isNaN(value2)) return null;
    
    const diff = Math.abs(value1 - value2);
    if (field === 'weight') return `${diff.toFixed(1)} lbs`;
    
    const convertedDiff = convertUnit(diff, UNITS.INCHES, selectedUnit);
    return `${formatMeasurement(convertedDiff, selectedUnit)} ${UNIT_SYMBOLS[selectedUnit]}`;
  };

  const MeasurementCard = ({ measurement }) => {
    const bmi = getBMIForMeasurement(measurement);
    const isSelected = selectedMeasurements.includes(measurement.id);
    
    return (
      <Card 
        sx={{ 
          mb: 2, 
          border: isSelected ? 2 : 1, 
          borderColor: isSelected ? 'primary.main' : 'divider',
          position: 'relative'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {measurement.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                {measurement.isDefault && (
                  <Chip label="Default" color="primary" size="small" />
                )}
                <Chip 
                  label={measurement.measurementType || 'Self'} 
                  variant="outlined" 
                  size="small" 
                />
                <Chip 
                  label={new Date(measurement.measurementDate || measurement.createdAt).toLocaleDateString()} 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {comparisonMode && (
                <Tooltip title={isSelected ? "Remove from comparison" : "Add to comparison"}>
                  <IconButton
                    onClick={() => handleCompareToggle(measurement.id)}
                    color={isSelected ? "primary" : "default"}
                    disabled={!isSelected && selectedMeasurements.length >= 3}
                  >
                    <CompareIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Edit">
                <IconButton onClick={() => onEdit(measurement.id)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => onDelete(measurement.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            {Object.entries(measurementLabels).map(([field, label]) => (
              <Grid item xs={6} sm={4} md={3} key={field}>
                <Typography variant="body2" color="textSecondary">
                  {label}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {convertMeasurement(measurement[field], field)}
                </Typography>
              </Grid>
            ))}
          </Grid>
          
          {bmi && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary">
                BMI: <strong>{bmi.bmi}</strong> ({bmi.category})
              </Typography>
            </Box>
          )}
          
          {measurement.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Notes: {measurement.notes}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const ComparisonTable = () => {
    const comparisonData = getComparisonData();
    if (comparisonData.length < 2) return null;

    return (
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AssessmentIcon sx={{ mr: 1 }} />
          Measurement Comparison
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Measurement</TableCell>
                {comparisonData.map((measurement, index) => (
                  <TableCell key={measurement.id} align="center">
                    {measurement.name}
                    {index > 0 && (
                      <Typography variant="caption" display="block" color="textSecondary">
                        vs {comparisonData[0].name}
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(measurementLabels).map(([field, label]) => (
                <TableRow key={field}>
                  <TableCell component="th" scope="row">
                    {label}
                  </TableCell>
                  {comparisonData.map((measurement, index) => (
                    <TableCell key={measurement.id} align="center">
                      <Typography variant="body2">
                        {convertMeasurement(measurement[field], field)}
                      </Typography>
                      {index > 0 && (
                        <Typography variant="caption" color="textSecondary">
                          {calculateDifference(
                            measurement[field], 
                            comparisonData[0][field], 
                            field
                          ) || '-'}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  return (
    <Box>
      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Display Unit</InputLabel>
              <Select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                label="Display Unit"
                startAdornment={<SwapHorizIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value={UNITS.INCHES}>Inches</MenuItem>
                <MenuItem value={UNITS.CENTIMETERS}>Centimeters</MenuItem>
                <MenuItem value={UNITS.FEET}>Feet</MenuItem>
                <MenuItem value={UNITS.METERS}>Meters</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant={comparisonMode ? "contained" : "outlined"}
              onClick={() => {
                setComparisonMode(!comparisonMode);
                setSelectedMeasurements([]);
              }}
              startIcon={<CompareIcon />}
            >
              {comparisonMode ? 'Exit Comparison' : 'Compare Mode'}
            </Button>
          </Box>
          
          {comparisonMode && (
            <Typography variant="body2" color="textSecondary">
              Select up to 3 measurements to compare ({selectedMeasurements.length}/3)
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Measurements List */}
      {measurements.length === 0 ? (
        <Alert severity="info">
          No measurements found. Create your first measurement set to get started.
        </Alert>
      ) : (
        <>
          {measurements.map((measurement) => (
            <MeasurementCard key={measurement.id} measurement={measurement} />
          ))}
          
          {comparisonMode && <ComparisonTable />}
        </>
      )}
    </Box>
  );
};

export default MeasurementDisplay;
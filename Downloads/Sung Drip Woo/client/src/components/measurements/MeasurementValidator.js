import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Rule as RuleIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import {
  UNITS,
  UNIT_SYMBOLS,
  convertUnit,
  formatMeasurement,
  validateMeasurement,
  getMeasurementSuggestion
} from '../../utils/unitConversion';

const MeasurementValidator = ({ measurements, onValidationComplete }) => {
  const [selectedUnit, setSelectedUnit] = useState(UNITS.INCHES);
  const [validationResults, setValidationResults] = useState({});
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const measurementRanges = {
    neck: { min: 12, max: 20, typical: [14, 17] },
    bust: { min: 28, max: 50, typical: [32, 42] },
    waist: { min: 24, max: 45, typical: [28, 36] },
    hip: { min: 30, max: 50, typical: [34, 44] },
    shoulder: { min: 14, max: 22, typical: [16, 19] },
    sleeve: { min: 20, max: 28, typical: [23, 26] },
    inseam: { min: 26, max: 36, typical: [30, 34] },
    outseam: { min: 36, max: 48, typical: [40, 44] },
    thigh: { min: 18, max: 30, typical: [20, 26] },
    calf: { min: 12, max: 20, typical: [14, 17] },
    height: { min: 48, max: 84, typical: [60, 72] }
  };

  const validateAllMeasurements = (measurementSet) => {
    const results = {
      overall: 'valid',
      issues: [],
      warnings: [],
      suggestions: [],
      score: 0,
      details: {}
    };

    let validCount = 0;
    let totalCount = 0;

    Object.entries(measurementRanges).forEach(([field, range]) => {
      if (measurementSet[field] && !isNaN(measurementSet[field])) {
        totalCount++;
        const value = parseFloat(measurementSet[field]);
        const validation = validateMeasurement(value, field, UNITS.INCHES);
        
        results.details[field] = {
          value: value,
          validation: validation,
          inRange: value >= range.min && value <= range.max,
          inTypicalRange: value >= range.typical[0] && value <= range.typical[1]
        };

        if (validation.isValid) {
          validCount++;
        } else {
          results.issues.push({
            field,
            message: validation.message,
            severity: 'error'
          });
        }

        if (!results.details[field].inTypicalRange && validation.isValid) {
          results.warnings.push({
            field,
            message: `${field} measurement (${formatMeasurement(convertUnit(value, UNITS.INCHES, selectedUnit), selectedUnit)} ${UNIT_SYMBOLS[selectedUnit]}) is outside typical range`,
            severity: 'warning'
          });
        }
      }
    });

    // Cross-validation checks
    const crossValidationChecks = [
      {
        check: () => measurementSet.waist && measurementSet.hip && measurementSet.waist > measurementSet.hip,
        message: 'Waist measurement is larger than hip measurement, which is unusual',
        severity: 'warning'
      },
      {
        check: () => measurementSet.bust && measurementSet.waist && measurementSet.bust < measurementSet.waist,
        message: 'Bust measurement is smaller than waist measurement, please verify',
        severity: 'warning'
      },
      {
        check: () => measurementSet.inseam && measurementSet.outseam && measurementSet.inseam > measurementSet.outseam,
        message: 'Inseam is longer than outseam, which is not possible',
        severity: 'error'
      },
      {
        check: () => measurementSet.thigh && measurementSet.calf && measurementSet.thigh < measurementSet.calf,
        message: 'Thigh measurement is smaller than calf measurement, please verify',
        severity: 'warning'
      }
    ];

    crossValidationChecks.forEach(({ check, message, severity }) => {
      if (check()) {
        if (severity === 'error') {
          results.issues.push({ field: 'cross-validation', message, severity });
        } else {
          results.warnings.push({ field: 'cross-validation', message, severity });
        }
      }
    });

    // Calculate overall score
    results.score = totalCount > 0 ? Math.round((validCount / totalCount) * 100) : 0;
    
    if (results.issues.length > 0) {
      results.overall = 'invalid';
    } else if (results.warnings.length > 0) {
      results.overall = 'warning';
    }

    // Generate suggestions
    if (measurementSet.height && measurementSet.weight) {
      const bmi = (measurementSet.weight * 703) / (measurementSet.height * measurementSet.height);
      if (bmi < 18.5 || bmi > 30) {
        results.suggestions.push({
          type: 'health',
          message: `BMI of ${bmi.toFixed(1)} suggests consulting with a healthcare provider for optimal measurements`
        });
      }
    }

    return results;
  };

  const runValidation = () => {
    const allResults = {};
    measurements.forEach(measurement => {
      allResults[measurement.id] = validateAllMeasurements(measurement);
    });
    setValidationResults(allResults);
    
    if (onValidationComplete) {
      onValidationComplete(allResults);
    }
  };

  const getValidationIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'invalid':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getValidationColor = (status) => {
    switch (status) {
      case 'valid':
        return 'success';
      case 'warning':
        return 'warning';
      case 'invalid':
        return 'error';
      default:
        return 'info';
    }
  };

  const ValidationSummary = ({ result, measurementName }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            {getValidationIcon(result.overall)}
            <Box sx={{ ml: 1 }}>{measurementName}</Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Accuracy Score: {result.score}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={result.score}
              color={getValidationColor(result.overall)}
              sx={{ width: 100, height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>

        {result.issues.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Issues Found ({result.issues.length})
            </Typography>
            <List dense>
              {result.issues.map((issue, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={issue.message} />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}

        {result.warnings.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Warnings ({result.warnings.length})
            </Typography>
            <List dense>
              {result.warnings.map((warning, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <WarningIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={warning.message} />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}

        {result.suggestions.length > 0 && (
          <Alert severity="info">
            <Typography variant="subtitle2" gutterBottom>
              Suggestions
            </Typography>
            <List dense>
              {result.suggestions.map((suggestion, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <PsychologyIcon color="info" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={suggestion.message} />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const DetailedAnalysis = ({ result }) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUpIcon sx={{ mr: 1 }} />
          Detailed Measurement Analysis
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {Object.entries(result.details).map(([field, details]) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Value: {formatMeasurement(convertUnit(details.value, UNITS.INCHES, selectedUnit), selectedUnit)} {UNIT_SYMBOLS[selectedUnit]}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    label={details.validation.isValid ? "Valid" : "Invalid"}
                    color={details.validation.isValid ? "success" : "error"}
                  />
                  <Chip
                    size="small"
                    label={details.inTypicalRange ? "Typical" : "Atypical"}
                    color={details.inTypicalRange ? "success" : "warning"}
                    variant="outlined"
                  />
                </Box>
                {!details.validation.isValid && (
                  <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                    {details.validation.message}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <RuleIcon sx={{ mr: 2 }} />
        Measurement Validation & Analysis
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Validate your measurements for accuracy and get suggestions for improvement.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Display Unit</InputLabel>
          <Select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            label="Display Unit"
          >
            <MenuItem value={UNITS.INCHES}>Inches</MenuItem>
            <MenuItem value={UNITS.CENTIMETERS}>Centimeters</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          onClick={runValidation}
          disabled={measurements.length === 0}
          startIcon={<RuleIcon />}
        >
          Run Validation
        </Button>
      </Box>

      {measurements.length === 0 && (
        <Alert severity="info">
          No measurements available for validation. Please add some measurements first.
        </Alert>
      )}

      {Object.keys(validationResults).length > 0 && (
        <Box>
          {measurements.map(measurement => {
            const result = validationResults[measurement.id];
            if (!result) return null;
            
            return (
              <Box key={measurement.id}>
                <ValidationSummary result={result} measurementName={measurement.name} />
                <DetailedAnalysis result={result} />
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default MeasurementValidator;
import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box
} from '@mui/material';

// Conversion constants
const LB_PER_KG = 2.20462262185; // exact conversion
const KG_PER_LB = 0.45359237;    // exact conversion

const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '';
  // Show up to 4 decimal places, trim unnecessary zeros
  const fixed = value.toFixed(4);
  return parseFloat(fixed).toString();
};

const WeightConverter = () => {
  // Base value stored in kilograms for accuracy
  const [baseKg, setBaseKg] = useState(null);
  const [primaryUnit, setPrimaryUnit] = useState('kg'); // 'kg' or 'lb'
  const [primaryInput, setPrimaryInput] = useState('');

  const handleUnitToggle = (_, newUnit) => {
    if (!newUnit) return; // ignore deselect
    setPrimaryUnit(newUnit);

    // When switching units, keep the displayed value consistent with base
    if (baseKg === null) {
      setPrimaryInput('');
    } else {
      const value = newUnit === 'kg' ? baseKg : baseKg * LB_PER_KG;
      setPrimaryInput(formatNumber(value));
    }
  };

  const handlePrimaryChange = (e) => {
    const valStr = e.target.value;
    setPrimaryInput(valStr);

    if (valStr === '') {
      setBaseKg(null);
      return;
    }

    const parsed = parseFloat(valStr);
    if (isNaN(parsed)) {
      // Keep base as is on invalid numeric input
      return;
    }

    if (primaryUnit === 'kg') {
      setBaseKg(parsed);
    } else {
      setBaseKg(parsed * KG_PER_LB);
    }
  };

  const kgDisplay = baseKg === null ? '' : formatNumber(baseKg);
  const lbDisplay = baseKg === null ? '' : formatNumber(baseKg * LB_PER_KG);

  // Determine values for both inputs (primary uses primaryInput to preserve typing)
  const kgInputValue = primaryUnit === 'kg' ? primaryInput : kgDisplay;
  const lbInputValue = primaryUnit === 'lb' ? primaryInput : lbDisplay;

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ maxWidth: 700, mx: 'auto' }}>
        <CardHeader
          title="Weight Converter"
          subheader="Enter your weight in kilograms or pounds and see an instant, accurate conversion"
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ToggleButtonGroup
              color="primary"
              value={primaryUnit}
              exclusive
              onChange={handleUnitToggle}
              aria-label="primary unit toggle"
            >
              <ToggleButton value="kg" aria-label="kilograms">Kilograms (kg)</ToggleButton>
              <ToggleButton value="lb" aria-label="pounds">Pounds (lb)</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Kilograms (kg)"
                type="number"
                inputProps={{ min: 0, step: 'any' }}
                fullWidth
                value={kgInputValue}
                onChange={primaryUnit === 'kg' ? handlePrimaryChange : undefined}
                disabled={primaryUnit !== 'kg'}
                helperText={primaryUnit === 'kg' ? 'Primary input' : 'Auto-converted'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pounds (lb)"
                type="number"
                inputProps={{ min: 0, step: 'any' }}
                fullWidth
                value={lbInputValue}
                onChange={primaryUnit === 'lb' ? handlePrimaryChange : undefined}
                disabled={primaryUnit !== 'lb'}
                helperText={primaryUnit === 'lb' ? 'Primary input' : 'Auto-converted'}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Conversion Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {baseKg === null
                ? 'Enter a value to see the conversion.'
                : `${formatNumber(baseKg)} kg = ${formatNumber(baseKg * LB_PER_KG)} lb`}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default WeightConverter;
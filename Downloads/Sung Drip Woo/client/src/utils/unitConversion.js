/**
 * Unit Conversion Utilities for Measurement System
 * Supports conversion between inches, centimeters, feet, and meters
 */

export const UNITS = {
  INCHES: 'inches',
  CENTIMETERS: 'cm',
  FEET: 'feet',
  METERS: 'meters'
};

export const UNIT_SYMBOLS = {
  [UNITS.INCHES]: 'in',
  [UNITS.CENTIMETERS]: 'cm',
  [UNITS.FEET]: 'ft',
  [UNITS.METERS]: 'm'
};

// Conversion factors to inches (base unit)
const CONVERSION_FACTORS = {
  [UNITS.INCHES]: 1,
  [UNITS.CENTIMETERS]: 0.393701,
  [UNITS.FEET]: 12,
  [UNITS.METERS]: 39.3701
};

/**
 * Convert a value from one unit to another
 * @param {number} value - The value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export const convertUnit = (value, fromUnit, toUnit) => {
  if (!value || isNaN(value)) return 0;
  if (fromUnit === toUnit) return value;
  
  // Convert to inches first (base unit)
  const inInches = value / CONVERSION_FACTORS[fromUnit];
  
  // Convert from inches to target unit
  return inInches * CONVERSION_FACTORS[toUnit];
};

/**
 * Format a measurement value with appropriate precision
 * @param {number} value - The value to format
 * @param {string} unit - The unit of measurement
 * @returns {string} Formatted value
 */
export const formatMeasurement = (value, unit) => {
  if (!value || isNaN(value)) return '';
  
  const precision = unit === UNITS.CENTIMETERS || unit === UNITS.METERS ? 1 : 2;
  return parseFloat(value).toFixed(precision);
};

/**
 * Validate measurement value based on realistic human body measurements
 * @param {number} value - The measurement value
 * @param {string} measurementType - Type of measurement (neck, waist, etc.)
 * @param {string} unit - Unit of measurement
 * @returns {object} Validation result with isValid and message
 */
export const validateMeasurement = (value, measurementType, unit) => {
  if (!value || isNaN(value)) {
    return { isValid: true, message: '' }; // Allow empty values
  }
  
  const numValue = parseFloat(value);
  if (numValue <= 0) {
    return { isValid: false, message: 'Measurement must be positive' };
  }
  
  // Convert to inches for validation (standard ranges)
  const inInches = convertUnit(numValue, unit, UNITS.INCHES);
  
  const validationRanges = {
    neck: { min: 10, max: 25 },
    bust: { min: 20, max: 60 },
    waist: { min: 20, max: 60 },
    hip: { min: 25, max: 65 },
    shoulder: { min: 12, max: 30 },
    sleeve: { min: 15, max: 40 },
    inseam: { min: 20, max: 40 },
    outseam: { min: 30, max: 50 },
    thigh: { min: 15, max: 35 },
    calf: { min: 10, max: 25 }
  };
  
  const range = validationRanges[measurementType];
  if (!range) {
    return { isValid: true, message: '' }; // No validation for unknown types
  }
  
  if (inInches < range.min || inInches > range.max) {
    return {
      isValid: false,
      message: `${measurementType} should be between ${range.min}" and ${range.max}" (${formatMeasurement(convertUnit(range.min, UNITS.INCHES, unit), unit)}${UNIT_SYMBOLS[unit]} - ${formatMeasurement(convertUnit(range.max, UNITS.INCHES, unit), unit)}${UNIT_SYMBOLS[unit]})`
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Get measurement suggestions based on common sizing
 * @param {string} measurementType - Type of measurement
 * @param {string} size - Clothing size (XS, S, M, L, XL, XXL)
 * @param {string} unit - Unit of measurement
 * @returns {number} Suggested measurement value
 */
export const getMeasurementSuggestion = (measurementType, size, unit) => {
  const suggestions = {
    XS: { bust: 32, waist: 24, hip: 34 },
    S: { bust: 34, waist: 26, hip: 36 },
    M: { bust: 36, waist: 28, hip: 38 },
    L: { bust: 38, waist: 30, hip: 40 },
    XL: { bust: 40, waist: 32, hip: 42 },
    XXL: { bust: 42, waist: 34, hip: 44 }
  };
  
  const sizeData = suggestions[size];
  if (!sizeData || !sizeData[measurementType]) return null;
  
  return convertUnit(sizeData[measurementType], UNITS.INCHES, unit);
};

/**
 * Calculate BMI and provide measurement context
 * @param {number} height - Height value
 * @param {string} heightUnit - Height unit
 * @param {number} weight - Weight in pounds
 * @returns {object} BMI calculation and category
 */
export const calculateBMI = (height, heightUnit, weight) => {
  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    return null;
  }
  
  // Convert height to meters
  const heightInMeters = convertUnit(height, heightUnit, UNITS.METERS);
  const weightInKg = weight * 0.453592; // Convert pounds to kg
  
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  
  return {
    bmi: parseFloat(bmi.toFixed(1)),
    category,
    heightInMeters: parseFloat(heightInMeters.toFixed(2)),
    weightInKg: parseFloat(weightInKg.toFixed(1))
  };
};
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Measurement = require('../models/Measurement');
const User = require('../models/User');

// @route   GET api/measurements
// @desc    Get all measurements for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const measurements = await Measurement.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(measurements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/measurements/:id
// @desc    Get measurement by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const measurement = await Measurement.findByPk(req.params.id);
    
    if (!measurement) {
      return res.status(404).json({ msg: 'Measurement not found' });
    }
    
    // Check user owns the measurement
    if (measurement.userId !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(measurement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/measurements
// @desc    Create a new measurement
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      neck,
      bust,
      waist,
      hip,
      shoulder,
      sleeve,
      inseam,
      outseam,
      thigh,
      calf,
      additionalMeasurements,
      notes,
      isDefault,
      measurementType
    } = req.body;
    
    // Create measurement
    const measurement = await Measurement.create({
      userId: req.user.id,
      name,
      neck,
      bust,
      waist,
      hip,
      shoulder,
      sleeve,
      inseam,
      outseam,
      thigh,
      calf,
      additionalMeasurements,
      notes,
      isDefault,
      measurementType
    });
    
    // If this is set as default, update other measurements
    if (isDefault) {
      await Measurement.update(
        { isDefault: false },
        { 
          where: { 
            userId: req.user.id,
            id: { $ne: measurement.id }
          }
        }
      );
    }
    
    res.json(measurement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/measurements/:id
// @desc    Update a measurement
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const measurement = await Measurement.findByPk(req.params.id);
    
    if (!measurement) {
      return res.status(404).json({ msg: 'Measurement not found' });
    }
    
    // Check user owns the measurement
    if (measurement.userId !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const {
      name,
      neck,
      bust,
      waist,
      hip,
      shoulder,
      sleeve,
      inseam,
      outseam,
      thigh,
      calf,
      additionalMeasurements,
      notes,
      isDefault,
      measurementType
    } = req.body;
    
    // Update measurement
    const updatedMeasurement = await measurement.update({
      name,
      neck,
      bust,
      waist,
      hip,
      shoulder,
      sleeve,
      inseam,
      outseam,
      thigh,
      calf,
      additionalMeasurements,
      notes,
      isDefault,
      measurementType
    });
    
    // If this is set as default, update other measurements
    if (isDefault) {
      await Measurement.update(
        { isDefault: false },
        { 
          where: { 
            userId: req.user.id,
            id: { $ne: measurement.id }
          }
        }
      );
    }
    
    res.json(updatedMeasurement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/measurements/:id
// @desc    Delete a measurement
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const measurement = await Measurement.findByPk(req.params.id);
    
    if (!measurement) {
      return res.status(404).json({ msg: 'Measurement not found' });
    }
    
    // Check user owns the measurement
    if (measurement.userId !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await measurement.destroy();
    
    res.json({ msg: 'Measurement removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/measurements/schedule
// @desc    Schedule an in-person measurement
// @access  Private
router.post('/schedule', auth, async (req, res) => {
  try {
    const { tailorId, date, time, address, notes } = req.body;
    
    // Create a new appointment record in the database
    // This would typically be handled by a separate Appointment model
    // For simplicity, we're just returning a success message
    
    res.json({ 
      msg: 'Measurement appointment scheduled successfully',
      appointment: {
        tailorId,
        customerId: req.user.id,
        date,
        time,
        address,
        notes,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
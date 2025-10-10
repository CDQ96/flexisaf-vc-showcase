const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Tailor = require('../models/Tailor');

// @route   GET api/tailors
// @desc    Get all tailors with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      lat, 
      lng, 
      radius = 10, // Default radius in miles
      specialties,
      minRating,
      sortBy = 'distance' // Default sort by distance
    } = req.query;

    let whereClause = {};
    let order = [];

    // Filter by specialties if provided
    if (specialties) {
      const specialtiesArray = specialties.split(',');
      whereClause.specialties = {
        [Op.overlap]: specialtiesArray
      };
    }

    // Filter by minimum rating if provided
    if (minRating) {
      whereClause.rating = {
        [Op.gte]: parseFloat(minRating)
      };
    }

    // Get tailors with their user information
    const tailors = await Tailor.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country', 'latitude', 'longitude', 'avatar']
        }
      ]
    });

    // If coordinates are provided, calculate distance and filter by radius
    if (lat && lng) {
      const filteredTailors = tailors.filter(tailor => {
        if (!tailor.User.latitude || !tailor.User.longitude) return false;
        
        // Calculate distance using Haversine formula
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          tailor.User.latitude,
          tailor.User.longitude
        );
        
        // Add distance to tailor object
        tailor.dataValues.distance = distance;
        
        // Filter by radius
        return distance <= parseFloat(radius);
      });

      // Sort by distance or rating
      if (sortBy === 'distance') {
        filteredTailors.sort((a, b) => a.dataValues.distance - b.dataValues.distance);
      } else if (sortBy === 'rating') {
        filteredTailors.sort((a, b) => b.rating - a.rating);
      }

      return res.json(filteredTailors);
    }

    // If no coordinates, sort by rating
    if (sortBy === 'rating') {
      tailors.sort((a, b) => b.rating - a.rating);
    }

    res.json(tailors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tailors/:id
// @desc    Get tailor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tailor = await Tailor.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country', 'latitude', 'longitude', 'avatar']
        }
      ]
    });

    if (!tailor) {
      return res.status(404).json({ msg: 'Tailor not found' });
    }

    res.json(tailor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tailors
// @desc    Create or update tailor profile
// @access  Private (tailor only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a tailor
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== 'tailor') {
      return res.status(401).json({ msg: 'Not authorized as a tailor' });
    }

    const {
      shopName,
      description,
      specialties,
      experience,
      businessHours,
      acceptsInPerson,
      acceptsDigitalMeasurements,
      providesMaterials
    } = req.body;

    // Build tailor profile object
    const tailorFields = {
      userId: req.user.id,
      shopName,
      description,
      specialties: specialties ? specialties.split(',').map(specialty => specialty.trim()) : [],
      experience,
      businessHours: businessHours || {},
      acceptsInPerson: acceptsInPerson !== undefined ? acceptsInPerson : true,
      acceptsDigitalMeasurements: acceptsDigitalMeasurements !== undefined ? acceptsDigitalMeasurements : true,
      providesMaterials: providesMaterials !== undefined ? providesMaterials : true
    };

    // Check if tailor profile exists
    let tailor = await Tailor.findOne({ where: { userId: req.user.id } });

    if (tailor) {
      // Update existing profile
      tailor = await Tailor.update(tailorFields, {
        where: { userId: req.user.id },
        returning: true
      });
      return res.json(tailor[1][0]);
    }

    // Create new profile
    tailor = await Tailor.create(tailorFields);
    res.json(tailor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tailors/:id/portfolio
// @desc    Add portfolio item to tailor
// @access  Private (tailor only)
router.post('/:id/portfolio', auth, async (req, res) => {
  try {
    const tailor = await Tailor.findByPk(req.params.id);

    if (!tailor) {
      return res.status(404).json({ msg: 'Tailor not found' });
    }

    // Check if user is the tailor
    if (tailor.userId !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { imageUrl } = req.body;

    // Add to portfolio array
    tailor.portfolio = [...tailor.portfolio, imageUrl];
    await tailor.save();

    res.json(tailor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Material = require('../models/Material');
const Tailor = require('../models/Tailor');

// @route   GET api/materials
// @desc    Get all materials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const materials = await Material.findAll({
      where: { isAvailable: true },
      include: [{ model: Tailor, attributes: ['shopName'] }]
    });
    res.json(materials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/materials/tailor/:tailorId
// @desc    Get all materials for a specific tailor
// @access  Public
router.get('/tailor/:tailorId', async (req, res) => {
  try {
    const materials = await Material.findAll({
      where: { 
        tailorId: req.params.tailorId,
        isAvailable: true
      }
    });
    res.json(materials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/materials/:id
// @desc    Get material by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [{ model: Tailor, attributes: ['shopName'] }]
    });
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    res.json(material);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/materials
// @desc    Add a new material
// @access  Private (Tailor only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a tailor
    const tailor = await Tailor.findOne({ where: { userId: req.user.id } });
    
    if (!tailor) {
      return res.status(401).json({ msg: 'Not authorized. Only tailors can add materials' });
    }
    
    const {
      name,
      description,
      type,
      color,
      pattern,
      pricePerYard,
      quantityAvailable,
      imageUrl
    } = req.body;
    
    const material = await Material.create({
      name,
      description,
      type,
      color,
      pattern,
      pricePerYard,
      quantityAvailable,
      imageUrl,
      tailorId: tailor.id,
      isAvailable: true
    });
    
    res.json(material);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/materials/:id
// @desc    Update a material
// @access  Private (Tailor only)
router.put('/:id', auth, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Check if user is the tailor who owns this material
    const tailor = await Tailor.findOne({ where: { userId: req.user.id } });
    
    if (!tailor || material.tailorId !== tailor.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const {
      name,
      description,
      type,
      color,
      pattern,
      pricePerYard,
      quantityAvailable,
      imageUrl,
      isAvailable
    } = req.body;
    
    const updatedMaterial = await material.update({
      name,
      description,
      type,
      color,
      pattern,
      pricePerYard,
      quantityAvailable,
      imageUrl,
      isAvailable
    });
    
    res.json(updatedMaterial);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/materials/:id
// @desc    Delete a material
// @access  Private (Tailor only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Check if user is the tailor who owns this material
    const tailor = await Tailor.findOne({ where: { userId: req.user.id } });
    
    if (!tailor || material.tailorId !== tailor.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await material.destroy();
    
    res.json({ msg: 'Material removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/materials/:id/quantity
// @desc    Update material quantity (for inventory management)
// @access  Private (Tailor only)
router.put('/:id/quantity', auth, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Check if user is the tailor who owns this material
    const tailor = await Tailor.findOne({ where: { userId: req.user.id } });
    
    if (!tailor || material.tailorId !== tailor.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const { quantityAvailable } = req.body;
    
    material.quantityAvailable = quantityAvailable;
    await material.save();
    
    res.json(material);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
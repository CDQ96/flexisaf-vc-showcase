const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @route   GET api/delivery
// @desc    Get all deliveries (admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findByPk(req.user.id);
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const deliveries = await Delivery.findAll({
      include: [{ model: Order }]
    });
    res.json(deliveries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/delivery/rider
// @desc    Get all deliveries for a rider
// @access  Private
router.get('/rider', auth, async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      where: { riderId: req.user.id },
      include: [{ model: Order }]
    });
    res.json(deliveries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/delivery/order/:orderId
// @desc    Get delivery by order ID
// @access  Private
router.get('/order/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if user is authorized (customer, tailor, or rider)
    if (order.customerId !== req.user.id && order.tailorId !== req.user.id) {
      const delivery = await Delivery.findOne({ where: { orderId: req.params.orderId } });
      if (!delivery || delivery.riderId !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
    }
    
    const delivery = await Delivery.findOne({
      where: { orderId: req.params.orderId }
    });
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    res.json(delivery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/delivery/tracking/:code
// @desc    Track delivery by tracking code (public)
// @access  Public
router.get('/tracking/:code', async (req, res) => {
  try {
    const delivery = await Delivery.findOne({
      where: { trackingCode: req.params.code },
      include: [{ 
        model: Order,
        attributes: ['id', 'orderNumber', 'status'] 
      }]
    });
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    res.json({
      trackingCode: delivery.trackingCode,
      status: delivery.status,
      pickupDate: delivery.pickupDate,
      deliveryDate: delivery.deliveryDate,
      currentLocation: delivery.currentLocation,
      orderStatus: delivery.Order.status
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/delivery
// @desc    Create a new delivery
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      orderId,
      pickupAddress,
      deliveryAddress,
      notes,
      deliveryFee
    } = req.body;
    
    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if user is authorized (tailor or admin)
    const user = await User.findByPk(req.user.id);
    if (order.tailorId !== req.user.id && user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Generate tracking code
    const trackingCode = uuidv4().substring(0, 8).toUpperCase();
    
    const delivery = await Delivery.create({
      orderId,
      status: 'pending',
      pickupAddress,
      deliveryAddress,
      trackingCode,
      notes,
      deliveryFee
    });
    
    // Update order status
    await order.update({ status: 'pending_delivery' });
    
    res.json(delivery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/delivery/:id/assign
// @desc    Assign rider to delivery
// @access  Private (Admin only)
router.put('/:id/assign', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findByPk(req.user.id);
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const { riderId } = req.body;
    
    // Check if rider exists and is a rider
    const rider = await User.findByPk(riderId);
    if (!rider || rider.role !== 'rider') {
      return res.status(400).json({ msg: 'Invalid rider' });
    }
    
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    delivery.riderId = riderId;
    delivery.status = 'assigned';
    await delivery.save();
    
    res.json(delivery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/delivery/:id/status
// @desc    Update delivery status
// @access  Private (Rider only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    // Check if user is the assigned rider
    if (delivery.riderId !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const { status, currentLocation } = req.body;
    
    // Validate status transition
    const validStatusTransitions = {
      assigned: ['pickup_in_progress'],
      pickup_in_progress: ['picked_up', 'failed'],
      picked_up: ['in_transit', 'failed'],
      in_transit: ['delivered', 'failed']
    };
    
    if (!validStatusTransitions[delivery.status] || !validStatusTransitions[delivery.status].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status transition' });
    }
    
    // Update delivery status
    delivery.status = status;
    
    // Update timestamps based on status
    if (status === 'picked_up') {
      delivery.pickupDate = new Date();
    } else if (status === 'delivered') {
      delivery.deliveryDate = new Date();
    }
    
    // Update location if provided
    if (currentLocation) {
      delivery.currentLocation = currentLocation;
    }
    
    await delivery.save();
    
    // Update order status if delivery is completed
    if (status === 'delivered') {
      const order = await Order.findByPk(delivery.orderId);
      await order.update({ status: 'delivered' });
    }
    
    res.json(delivery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/delivery/:id/location
// @desc    Update delivery current location
// @access  Private (Rider only)
router.put('/:id/location', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    // Check if user is the assigned rider
    if (delivery.riderId !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const { latitude, longitude } = req.body;
    
    // Update location
    delivery.currentLocation = { type: 'Point', coordinates: [longitude, latitude] };
    await delivery.save();
    
    res.json(delivery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
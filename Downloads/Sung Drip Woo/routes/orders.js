const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Tailor = require('../models/Tailor');
const mockOrders = new Map();

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { tailorId, measurementId, materialId, quantity, specialInstructions } = req.body;

    const orderPayload = {
      customerId: req.user.id,
      tailorId,
      measurementId: measurementId || null,
      orderType: 'custom',
      description: 'Custom tailoring order',
      instructions: specialInstructions || null,
      status: 'pending',
      materialSource: 'customer',
      materialDetails: { materialId, quantity },
      tailoringPrice: 0,
      materialPrice: 0,
      deliveryPrice: 0,
      totalPrice: 0,
      isPaid: false
    };

    const created = await Order.create(orderPayload);
    return res.json(created);
  } catch (err) {
    console.warn('Order DB error, using mock:', err.message);
    const id = `mock-order-${Date.now()}`;
    const mock = {
      id,
      customerId: req.user.id,
      tailorId: req.body.tailorId,
      measurementId: req.body.measurementId || null,
      orderType: 'custom',
      description: 'Custom tailoring order',
      instructions: req.body.specialInstructions || null,
      status: 'pending',
      materialSource: 'customer',
      materialDetails: { materialId: req.body.materialId, quantity: req.body.quantity },
      tailoringPrice: 0,
      materialPrice: 0,
      deliveryPrice: 0,
      totalPrice: 0,
      isPaid: false,
      createdAt: new Date().toISOString()
    };
    mockOrders.set(id, mock);
    return res.json(mock);
  }
});

// @route   GET api/orders
// @desc    Get all orders for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { customerId: req.user.id }, order: [['createdAt', 'DESC']] });
    return res.json(orders);
  } catch (err) {
    console.warn('Order list DB error, using mock:', err.message);
    const list = Array.from(mockOrders.values()).filter(o => o.customerId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(list);
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    if (order.customerId && order.customerId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    return res.json(order);
  } catch (err) {
    console.warn('Order get DB error, using mock:', err.message);
    const order = mockOrders.get(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    if (order.customerId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    return res.json(order);
  }
});

// @route   PUT api/orders/:id
// @desc    Update order status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    let order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    order.status = status;
    await order.save();
    return res.json(order);
  } catch (err) {
    console.warn('Order update DB error, using mock:', err.message);
    const order = mockOrders.get(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    order.status = req.body.status;
    mockOrders.set(req.params.id, order);
    return res.json(order);
  }
});

module.exports = router;
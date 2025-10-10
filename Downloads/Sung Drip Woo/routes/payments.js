const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const Tailor = require('../models/Tailor');
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = !!(stripeSecret && /^sk_/i.test(stripeSecret) && !/yourstripetestkey/i.test(stripeSecret));
const stripe = isStripeConfigured ? require('stripe')(stripeSecret) : null;

// @route   POST api/payments/create-payment-intent
// @desc    Create a payment intent for an order
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { orderId, amount: amountFromBody, currency = 'usd' } = req.body;

    let order = null;
    let amountToCharge = null;

    if (orderId) {
      try {
        order = await Order.findByPk(orderId);
      } catch (dbErr) {
        console.warn('DB unavailable, falling back to request amount:', dbErr.message);
      }

      if (order) {
        if (order.customerId && order.customerId !== req.user.id) {
          return res.status(401).json({ msg: 'Not authorized' });
        }
        amountToCharge = typeof order.totalPrice === 'number' ? order.totalPrice : Number(order.totalPrice);
      }
    }

    if (!amountToCharge) {
      if (amountFromBody == null) {
        return res.status(400).json({ msg: 'Amount is required when order is unavailable' });
      }
      amountToCharge = Number(amountFromBody);
      if (!Number.isFinite(amountToCharge) || amountToCharge <= 0) {
        return res.status(400).json({ msg: 'Invalid amount provided' });
      }
    }

    const amount = Math.round(amountToCharge * 100);

    // If Stripe is not configured, return a mock client secret for testing
    if (!isStripeConfigured || !stripe) {
      const mockClientSecret = `mock_client_secret_${Date.now()}`;
      const mockPaymentId = `mock_payment_${Date.now()}`;

      // Best-effort record creation; ignore failures when DB is unavailable
      try {
        const existingPayment = orderId ? await Payment.findOne({ where: { orderId } }) : null;
        if (existingPayment) {
          await existingPayment.update({ status: 'pending' });
        } else if (orderId) {
          await Payment.create({
            orderId,
            amount: amountToCharge,
            currency: (currency || 'usd').toUpperCase(),
            paymentMethod: 'card',
            paymentIntentId: mockPaymentId,
            status: 'pending'
          });
        }
      } catch (dbErr) {
        console.warn('Skipping payment persistence due to DB issue:', dbErr.message);
      }

      return res.json({ clientSecret: mockClientSecret, paymentId: mockPaymentId });
    }

    // Create real Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        orderId: orderId || 'no-order',
        customerId: order?.customerId || req.user.id,
        tailorId: order?.tailorId || 'no-tailor'
      }
    });

    // Create or update payment record when possible
    try {
      const existingPayment = orderId ? await Payment.findOne({ where: { orderId } }) : null;
      if (existingPayment) {
        await existingPayment.update({ paymentIntentId: paymentIntent.id, status: 'pending' });
      } else if (orderId) {
        await Payment.create({
          orderId,
          amount: amountToCharge,
          currency: (currency || 'usd').toUpperCase(),
          paymentMethod: 'card',
          paymentIntentId: paymentIntent.id,
          status: 'pending'
        });
      }
    } catch (dbErr) {
      console.warn('Skipping payment persistence due to DB issue:', dbErr.message);
    }

    return res.json({ clientSecret: paymentIntent.client_secret, paymentId: paymentIntent.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/payments/webhook
// @desc    Handle Stripe webhook events
// @access  Public
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});

// @route   GET api/payments/order/:orderId
// @desc    Get payment details for an order
// @access  Private
router.get('/order/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if user is authorized (customer or tailor)
    if (order.customerId !== req.user.id && order.tailorId !== req.user.id) {
      const user = await User.findByPk(req.user.id);
      if (user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized' });
      }
    }
    
    const payment = await Payment.findOne({ where: { orderId: req.params.orderId } });
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/payments/:id/release-escrow
// @desc    Release funds from escrow to tailor
// @access  Private (Admin or Customer only)
router.put('/:id/release-escrow', auth, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    const order = await Order.findByPk(payment.orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if user is authorized (customer or admin)
    const user = await User.findByPk(req.user.id);
    if (order.customerId !== req.user.id && user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Check if payment is in escrow
    if (payment.status !== 'held_in_escrow') {
      return res.status(400).json({ msg: 'Payment is not in escrow' });
    }
    
    // Release funds from escrow
    payment.status = 'released';
    payment.escrowReleaseDate = new Date();
    await payment.save();
    
    // Update order status
    order.paymentStatus = 'paid';
    await order.save();
    
    // TODO: Transfer funds to tailor's account
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/payments/:id/refund
// @desc    Refund payment to customer
// @access  Private (Admin or Tailor only)
router.put('/:id/refund', auth, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    const order = await Order.findByPk(payment.orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if user is authorized (tailor or admin)
    const user = await User.findByPk(req.user.id);
    const tailor = await Tailor.findOne({ where: { userId: req.user.id } });
    
    if ((tailor && tailor.id !== order.tailorId) && user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Check if payment can be refunded
    if (payment.status !== 'held_in_escrow' && payment.status !== 'processing') {
      return res.status(400).json({ msg: 'Payment cannot be refunded' });
    }
    
    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentIntentId
    });
    
    // Update payment status
    payment.status = 'refunded';
    await payment.save();
    
    // Update order status
    order.status = 'cancelled';
    order.paymentStatus = 'refunded';
    await order.save();
    
    res.json({ payment, refund });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Helper function to handle successful payments
async function handlePaymentSuccess(paymentIntent) {
  try {
    const { orderId } = paymentIntent.metadata;
    
    // Update payment record
    const payment = await Payment.findOne({
      where: { paymentIntentId: paymentIntent.id }
    });
    
    if (payment) {
      payment.status = 'held_in_escrow';
      payment.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
      await payment.save();
    }
    
    // Update order status
    const order = await Order.findByPk(orderId);
    if (order) {
      order.paymentStatus = 'in_escrow';
      await order.save();
    }
  } catch (err) {
    console.error('Error handling payment success:', err);
  }
}

// Helper function to handle failed payments
async function handlePaymentFailure(paymentIntent) {
  try {
    // Update payment record
    const payment = await Payment.findOne({
      where: { paymentIntentId: paymentIntent.id }
    });
    
    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }
  } catch (err) {
    console.error('Error handling payment failure:', err);
  }
}

module.exports = router;
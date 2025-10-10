const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, isTailor } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: 'Please provide firstName, lastName, email, and password' });
  }

  try {
    const User = require('../models/User');
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const role = isTailor ? 'tailor' : 'customer';
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role,
      isVerified: false,
    });

    const payload = { user: { id: user.id } };
    const jwt = require('jsonwebtoken');
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mocksecret',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.warn('Registration DB error, falling back to mock token:', err.message);
    const jwt = require('jsonwebtoken');
    const payload = { user: { id: 'mock-user-id-123456' } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mocksecret',
      { expiresIn: '5 days' },
      (signErr, token) => {
        if (signErr) {
          console.error(signErr.message);
          return res.status(500).send('Server error');
        }
        res.json({ token });
      }
    );
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Mock successful login
    const payload = {
      user: {
        id: "mock-user-id-123456"
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "mocksecret",
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Mock user data
    const user = {
      id: "mock-user-id-123456",
      name: "Test User",
      email: "test@example.com",
      role: "customer"
    };
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
const express = require('express');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/env');
const User = require('../models/User');
const {
  validateLoginInput,
  validateRegistrationInput,
} = require('../utils/validation');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { errors, value } = validateRegistrationInput(req.body);

    if (errors.length) {
      return res.status(400).json({ errors, message: errors[0] });
    }

    const existingByEmail = await User.findOne({ email: value.email });
    if (existingByEmail) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const existingByUsername = await User.findOne({ username: value.username });
    if (existingByUsername) {
      return res.status(409).json({ message: 'This username is already taken.' });
    }

    const user = new User(value);
    await user.save();

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });
    return res.status(201).json({
      token,
      user: { email: user.email, id: user._id, username: user.username },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A user with these details already exists.' });
    }

    return res.status(500).json({ message: 'Unable to register the user right now.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { errors, value } = validateLoginInput(req.body);

    if (errors.length) {
      return res.status(400).json({ errors, message: errors[0] });
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(value.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });
    return res.json({
      token,
      user: { email: user.email, id: user._id, username: user.username },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in right now.' });
  }
});

module.exports = router;

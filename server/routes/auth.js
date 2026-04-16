const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, age, weight, height, goal, activityLevel } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      weight,
      height,
      goal,
      activityLevel
    });
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '12h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
        activityLevel: user.activityLevel
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '12h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;

const express = require('express');
const { protect } = require('../middleware/auth');
const Meal = require('../models/Meal');
const router = express.Router();

// @route   POST /addMeal
// @desc    Add a meal entry for the authenticated user
// @access  Private
router.post('/addMeal', protect, async (req, res) => {
  const { name, calories, protein, carbs, fats, fiber, mealType, servingSize, notes } = req.body;
  if (!name || calories === undefined) {
    return res.status(400).json({ message: 'Name and calories are required' });
  }

  try {
    const meal = await Meal.create({
      user: req.user._id,
      name,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      fiber: fiber || 0,
      mealType: mealType || 'lunch',
      servingSize: servingSize || '1 serving',
      notes: notes || '',
    });
    res.status(201).json(meal);
  } catch (error) {
    console.error('Add meal error:', error.message);
    res.status(500).json({ message: 'Error adding meal' });
  }
});

// @route   GET /meals
// @desc    Get meals for the authenticated user
// @access  Private
router.get('/meals', protect, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user._id }).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    console.error('Fetch meals error:', error.message);
    res.status(500).json({ message: 'Error fetching meals' });
  }
});

module.exports = router;

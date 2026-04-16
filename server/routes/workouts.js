const express = require('express');
const { protect } = require('../middleware/auth');
const Workout = require('../models/Workout');
const router = express.Router();

// @route   POST /workout
// @desc    Log a workout session
// @access  Private
router.post('/workout', protect, async (req, res) => {
  const { name, type, exercises, duration, caloriesBurned, completed, difficulty, notes } = req.body;
  if (!name || !duration) {
    return res.status(400).json({ message: 'Workout name and duration are required' });
  }

  try {
    const workout = await Workout.create({
      user: req.user._id,
      name,
      type: type || 'strength',
      exercises: Array.isArray(exercises) ? exercises : exercises ? [exercises] : [],
      duration,
      caloriesBurned: caloriesBurned || 0,
      completed: completed || false,
      difficulty: difficulty || 'intermediate',
      notes: notes || '',
    });
    res.status(201).json(workout);
  } catch (error) {
    console.error('Create workout error:', error.message);
    res.status(500).json({ message: 'Error logging workout' });
  }
});

// @route   GET /workouts
// @desc    Get workouts for the authenticated user
// @access  Private
router.get('/workouts', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Fetch workouts error:', error.message);
    res.status(500).json({ message: 'Error fetching workouts' });
  }
});

// @route   GET /workout/plan
// @desc    Get a recommended workout plan
// @access  Private
router.get('/workout/plan', protect, async (req, res) => {
  try {
    const { goal, activityLevel } = req.user;
    const plan = [];

    if (goal === 'fat_loss') {
      plan.push('3x weekly interval cardio');
      plan.push('2x full-body strength sessions');
      plan.push('Daily mobility and recovery work');
    } else if (goal === 'muscle_gain') {
      plan.push('4x weekly resistance training');
      plan.push('Focus on compound lifts and progressive overload');
      plan.push('1x active recovery session');
    } else {
      plan.push('3x weekly mixed cardio');
      plan.push('2x light strength sessions');
      plan.push('Daily flexibility exercises');
    }

    res.json({ plan, goal, activityLevel });
  } catch (error) {
    console.error('Workout plan error:', error.message);
    res.status(500).json({ message: 'Error generating workout plan' });
  }
});

module.exports = router;

// routes/progress.js — Progress tracking routes
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Meal = require('../models/Meal');
const Workout = require('../models/Workout');
const { protect } = require('../middleware/auth');

// @route   POST /progress
// @desc    Log a daily progress entry
// @access  Private
router.post('/progress', protect, async (req, res) => {
  const { weight, bodyFat, muscleMass, waterIntake, stepsCount, moodScore, energyLevel, sleepHours, notes } = req.body;

  try {
    // Check if there's already an entry for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let progress = await Progress.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    if (progress) {
      // Update existing entry
      if (weight !== undefined) progress.weight = weight;
      if (bodyFat !== undefined) progress.bodyFat = bodyFat;
      if (muscleMass !== undefined) progress.muscleMass = muscleMass;
      if (waterIntake !== undefined) progress.waterIntake = waterIntake;
      if (stepsCount !== undefined) progress.stepsCount = stepsCount;
      if (moodScore !== undefined) progress.moodScore = moodScore;
      if (energyLevel !== undefined) progress.energyLevel = energyLevel;
      if (sleepHours !== undefined) progress.sleepHours = sleepHours;
      if (notes !== undefined) progress.notes = notes;
      await progress.save();
    } else {
      // Create new entry
      progress = await Progress.create({
        user: req.user._id,
        weight,
        bodyFat,
        muscleMass,
        waterIntake: waterIntake || 0,
        stepsCount: stepsCount || 0,
        moodScore,
        energyLevel,
        sleepHours,
        notes: notes || '',
      });
    }

    res.status(201).json({ message: 'Progress logged', progress });
  } catch (error) {
    console.error('Progress log error:', error.message);
    res.status(500).json({ message: 'Error logging progress' });
  }
});

// @route   GET /progress
// @desc    Get progress history for charts
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const progressData = await Progress.find({
      user: req.user._id,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    res.json(progressData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress data' });
  }
});

// @route   GET /progress/weekly
// @desc    Get comprehensive weekly summary (meals + workouts + progress)
// @access  Private
router.get('/progress/weekly', protect, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const [progressData, mealHistory, workoutHistory] = await Promise.all([
      Progress.find({ user: req.user._id, date: { $gte: startDate } }).sort({ date: 1 }),
      Meal.aggregate([
        { $match: { user: req.user._id, date: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            totalCalories: { $sum: '$calories' },
            totalProtein: { $sum: '$protein' },
            totalCarbs: { $sum: '$carbs' },
            totalFats: { $sum: '$fats' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Workout.find({ user: req.user._id, date: { $gte: startDate } }),
    ]);

    const completedWorkouts = workoutHistory.filter(w => w.completed).length;
    const avgCalories = mealHistory.length
      ? Math.round(mealHistory.reduce((sum, entry) => sum + entry.totalCalories, 0) / mealHistory.length)
      : 0;

    res.json({
      progressData,
      mealHistory,
      workoutHistory,
      summary: {
        avgDailyCalories: avgCalories,
        totalWorkouts: workoutHistory.length,
        completedWorkouts,
        workoutCompletionRate: workoutHistory.length
          ? Math.round((completedWorkouts / workoutHistory.length) * 100)
          : 0,
        totalCaloriesBurned: workoutHistory.reduce((sum, w) => sum + w.caloriesBurned, 0),
        targetCalories: req.user.targetCalories,
      },
    });
  } catch (error) {
    console.error('Weekly summary error:', error.message);
    res.status(500).json({ message: 'Error fetching weekly summary' });
  }
});

module.exports = router;

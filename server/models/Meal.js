// models/Meal.js — Meal/food entry schema with macronutrient tracking
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    default: 'lunch',
  },
  // Macronutrients
  calories: { type: Number, required: true, min: 0 },
  protein: { type: Number, default: 0 },   // grams
  carbs: { type: Number, default: 0 },     // grams
  fats: { type: Number, default: 0 },      // grams
  fiber: { type: Number, default: 0 },     // grams
  // Serving info
  servingSize: { type: String, default: '1 serving' },
  notes: { type: String, default: '' },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for efficient date-based queries per user
mealSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Meal', mealSchema);

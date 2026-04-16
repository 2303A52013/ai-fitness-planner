// models/Workout.js — Workout session schema with exercise details
const mongoose = require('mongoose');

// Sub-schema for individual exercises within a workout
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, default: 3 },
  reps: { type: Number, default: 10 },
  weight: { type: Number, default: 0 },       // kg, 0 for bodyweight
  duration: { type: Number, default: 0 },     // minutes, for cardio
  restTime: { type: Number, default: 60 },    // seconds between sets
  notes: { type: String, default: '' },
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'sports', 'other'],
    default: 'strength',
  },
  exercises: [exerciseSchema],   // Array of exercise objects
  duration: { type: Number, default: 30 },     // Total minutes
  caloriesBurned: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  notes: { type: String, default: '' },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Index for efficient querying
workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);

const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weight: { type: Number, default: 0 },
  bodyFat: { type: Number, default: 0 },
  muscleMass: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 },
  stepsCount: { type: Number, default: 0 },
  moodScore: { type: Number, default: 0 },
  energyLevel: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Progress', ProgressSchema);

// models/User.js — User schema with profile & fitness goals
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  // Fitness profile
  age: { type: Number, default: 25 },
  weight: { type: Number, default: 70 },        // kg
  height: { type: Number, default: 170 },       // cm
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  goal: {
    type: String,
    enum: ['fat_loss', 'muscle_gain', 'maintenance'],
    default: 'maintenance',
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate',
  },
  targetCalories: { type: Number, default: 2000 },
  avatar: { type: String, default: '' },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  // Only hash if password field was modified
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

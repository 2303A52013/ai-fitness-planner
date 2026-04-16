// server/index.js — Main Express application entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────

// Enable CORS for all origins (restrict in production)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse incoming JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static client files (in production)
app.use(express.static(path.join(__dirname, '../client')));

// ─── Routes ───────────────────────────────────────────────────────────────

const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meals');
const workoutRoutes = require('./routes/workouts');
const progressRoutes = require('./routes/progress');

// Mount route handlers
app.use('/', authRoutes);       // POST /register, POST /login, GET /profile
app.use('/', mealRoutes);       // POST /addMeal, GET /meals
app.use('/', workoutRoutes);    // POST /workout, GET /workout/plan, GET /workouts
app.use('/', progressRoutes);   // POST /progress, GET /progress, GET /progress/weekly

// Support API prefix for compatibility
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Fitness Planner API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 AI Fitness Planner Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}`);
  console.log(`🤖 ML API URL: ${process.env.ML_API_URL}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;

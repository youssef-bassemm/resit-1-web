const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const appointmentRouter = require('./routes/appointmentRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const { createDoctor, listDoctors } = require('./controllers/doctorController.js');

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Simple CORS headers for demo (no external cors package)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Doctor routes registered directly so POST always works
app.get('/api/v1/doctors', listDoctors);
app.post('/api/v1/doctors', createDoctor);

// API routes
app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

// Serve static frontend from ../public
app.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = {
  app,
};
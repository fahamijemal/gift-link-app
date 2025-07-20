/*jshint esversion: 8 */
require('dotenv').config({ path: '.env.test' });

// Setup mocks before importing routes
require('./test-setup');

const express = require('express');
const cors = require('cors');
const pinoLogger = require('../logger');

const app = express();
app.use("*", cors());
app.use(express.json());

const port = 3061; // Different port for testing

// Import routes after mocking
const giftRoutes = require('../routes/giftRoutes');
const authRoutes = require('../routes/authRoutes');
const searchRoutes = require('../routes/searchRoutes');

// Use routes
app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Inside the server');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');
const errorHandler = require('./middlewares/errorHandler');


// Import Routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize Express App
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/users', authRoutes);
app.use('/items', itemRoutes);
app.use('/items', bidRoutes);
app.use('/notifications', notificationRoutes);

// Serve static files for images
app.use('/uploads', express.static('uploads'));

// Error Handling Middleware
app.use(errorHandler);

// Database Connection
const sequelize = require('./utils/db');


// Test Database Connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;

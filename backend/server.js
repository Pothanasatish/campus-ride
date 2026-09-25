const dns = require('dns');
// Set public DNS servers to resolve MongoDB Atlas SRV records on Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('DNS server override skipped:', e.message);
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares - CORS configured for dynamic origin reflection
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusRide Express Backend Engine Online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Fallback Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`
  });
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Standalone server listener for local development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`  CampusRide Express Backend Engine Online      `);
    console.log(`  Running on PORT: ${PORT}                          `);
    console.log(`  Health check: http://localhost:${PORT}/api/health `);
    console.log(`=================================================`);
  });
}

// Export app for Vercel Serverless Function deployment
module.exports = app;

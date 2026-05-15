require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const companyRoutes = require('./routes/companies');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Company Review API is running 🚀' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/companyReviewDB';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

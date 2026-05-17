// 🔴 ADD THIS LINE AT THE VERY TOP (before require)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.set('etag', false); // Disable ETags to prevent 304 responses
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    port: PORT,
    sap_base: process.env.SAP_SOAP_BASE_URL ? 'Configured' : 'Missing'
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message || "Something went wrong!"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
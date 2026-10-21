const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const renewalRoutes = require('./routes/renewalRoutes');
const historyRoutes = require('./routes/historyRoutes');
const renewalController = require('./controllers/renewalController');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse JSON request bodies

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api', authRoutes); // Auth routes (login)
app.use('/api/renewals', renewalRoutes); // Renewal CRUD routes
app.use('/api/renewals', historyRoutes); // History routes

// Dashboard route (can be put in a separate controller, but keeping it simple)
app.get('/api/dashboard', renewalController.getDashboardStats);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

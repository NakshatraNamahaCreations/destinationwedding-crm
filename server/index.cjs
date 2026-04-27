require('dns').setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      // CRM (admin) dev
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      // Public marketing site dev (Vite default + alternates)
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      // Production
      'https://destination-wedding-crm.netlify.app'
    ];

    // Allow Postman / server requests
    if (!origin) return callback(null, true);

    // Allow Netlify
    if (origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }

    // Allow localhost + specific domains
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

// Routes
app.use('/api/enquiries', require('./routes/enquiries.cjs'));
app.use('/api/clients', require('./routes/clients.cjs'));
app.use('/api/destinations', require('./routes/destinations.cjs'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB & start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');

    // Seed default destinations if empty
    const Destination = require('./models/Destination.cjs');
    Destination.countDocuments().then(count => {
      if (count === 0) {
        const defaults = ['Goa', 'Udaipur', 'Jaipur', 'Kerala', 'Jim Corbett', 'Mussoorie', 'Thailand', 'Bali', 'Maldives', 'Dubai'];
        Destination.insertMany(defaults.map(name => ({ name })));
        console.log('Seeded default destinations');
      }
    });

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

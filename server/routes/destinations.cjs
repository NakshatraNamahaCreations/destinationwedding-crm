const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination.cjs');

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ name: 1 });
    res.json(destinations.map(d => d.name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add destination
router.post('/', async (req, res) => {
  try {
    const destination = new Destination({ name: req.body.name });
    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Destination already exists' });
    res.status(400).json({ error: err.message });
  }
});

// Delete destination
router.delete('/:name', async (req, res) => {
  try {
    await Destination.findOneAndDelete({ name: req.params.name });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

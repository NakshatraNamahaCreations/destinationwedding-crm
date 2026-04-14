const express = require('express');
const router = express.Router();
const Client = require('../models/Client.cjs');
const Enquiry = require('../models/Enquiry.cjs');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findOne({ clientId: req.params.id });
    if (!client) return res.status(404).json({ error: 'Not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Convert enquiry to client
router.post('/convert/:enquiryId', async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ enquiryId: req.params.enquiryId });
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });

    const count = await Client.countDocuments();
    const clientId = `CLT-${String(count + 1).padStart(3, '0')}`;

    const client = new Client({
      clientId,
      enquiryId: enquiry.enquiryId,
      coupleName: enquiry.coupleName,
      phone: enquiry.phone,
      altPhone: enquiry.altPhone,
      email: enquiry.email,
      weddingDate: enquiry.weddingDate,
      weddingDateTo: enquiry.weddingDateTo,
      numberOfDays: enquiry.numberOfDays,
      foodDays: enquiry.foodDays,
      destination: enquiry.destination,
      budget: enquiry.estimatedBudget,
      guestCount: enquiry.guestCount,
      leadSource: enquiry.leadSource,
      message: enquiry.notes || enquiry.message,
    });
    await client.save();

    // Update enquiry status
    enquiry.status = 'Converted';
    enquiry.activities.push({ type: 'converted', description: `Converted to client ${clientId}`, timestamp: new Date() });
    await enquiry.save();

    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { clientId: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!client) return res.status(404).json({ error: 'Not found' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add payment
router.post('/:id/payments', async (req, res) => {
  try {
    const payment = req.body;
    const client = await Client.findOneAndUpdate(
      { clientId: req.params.id },
      {
        $push: { payments: payment },
        $inc: { totalPaid: payment.amount },
      },
      { new: true }
    );
    if (!client) return res.status(404).json({ error: 'Not found' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add event
router.post('/:id/events', async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { clientId: req.params.id },
      { $push: { events: req.body } },
      { new: true }
    );
    if (!client) return res.status(404).json({ error: 'Not found' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ clientId: req.params.id });
    if (!client) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

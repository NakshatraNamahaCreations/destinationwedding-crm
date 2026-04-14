const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry.cjs');

// Get all enquiries
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single enquiry
router.get('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ enquiryId: req.params.id });
    if (!enquiry) return res.status(404).json({ error: 'Not found' });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create enquiry
router.post('/', async (req, res) => {
  try {
    const count = await Enquiry.countDocuments();
    const enquiryId = `ENQ-${String(count + 1).padStart(3, '0')}`;
    const enquiry = new Enquiry({
      ...req.body,
      enquiryId,
      status: 'New',
      activities: [{ type: 'created', description: 'Enquiry created', timestamp: new Date() }],
    });
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update enquiry
router.put('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findOneAndUpdate(
      { enquiryId: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: 'Not found' });
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findOneAndUpdate(
      { enquiryId: req.params.id },
      {
        $set: { status },
        $push: { activities: { type: 'status_change', description: `Status changed to ${status}`, timestamp: new Date() } },
      },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: 'Not found' });
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add follow-up
router.post('/:id/follow-ups', async (req, res) => {
  try {
    const followUp = req.body;
    const enquiry = await Enquiry.findOneAndUpdate(
      { enquiryId: req.params.id },
      {
        $push: {
          followUps: followUp,
          activities: { type: (followUp.method || 'call').toLowerCase(), description: `${followUp.method}: ${followUp.notes}`, timestamp: new Date() },
        },
        $set: { nextFollowUp: followUp.nextFollowUpDate || undefined },
      },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: 'Not found' });
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete enquiry
router.delete('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findOneAndDelete({ enquiryId: req.params.id });
    if (!enquiry) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

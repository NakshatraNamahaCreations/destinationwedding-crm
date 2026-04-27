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
async function nextEnquiryId() {
  const last = await Enquiry.findOne({ enquiryId: /^ENQ-?\d+$/ })
    .sort({ enquiryId: -1 })
    .select('enquiryId')
    .lean();
  const maxNum = last ? parseInt(String(last.enquiryId).replace(/\D/g, ''), 10) || 0 : 0;
  return maxNum + 1;
}

router.post('/', async (req, res) => {
  const { followUps, activities, enquiryId: _ignoreId, status: _ignoreStatus, ...rest } = req.body;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const next = (await nextEnquiryId()) + attempt;
      const enquiryId = `ENQ-${String(next).padStart(3, '0')}`;
      const enquiry = new Enquiry({
        ...rest,
        enquiryId,
        status: 'New',
        followUps: [],
        activities: [{ type: 'created', description: 'Enquiry created', timestamp: new Date() }],
      });
      await enquiry.save();
      return res.status(201).json(enquiry);
    } catch (err) {
      if (err && err.code === 11000 && attempt < 4) continue;
      return res.status(400).json({ error: err.message });
    }
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

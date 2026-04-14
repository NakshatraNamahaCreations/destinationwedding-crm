const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  date: String,
  method: String,
  notes: String,
  nextAction: String,
  nextFollowUpDate: String,
}, { timestamps: true });

const activitySchema = new mongoose.Schema({
  type: String,
  description: String,
  timestamp: { type: Date, default: Date.now },
});

const enquirySchema = new mongoose.Schema({
  enquiryId: { type: String, unique: true },
  coupleName: { type: String, required: true },
  phone: { type: String, required: true },
  altPhone: String,
  email: String,
  leadSource: String,
  weddingDate: String,
  weddingDateFrom: String,
  weddingDateTo: String,
  numberOfDays: String,
  foodDays: String,
  destination: String,
  estimatedBudget: Number,
  guestCount: Number,
  notes: String,
  message: String,
  status: { type: String, default: 'New' },
  nextFollowUp: String,
  followUps: [followUpSchema],
  activities: [activitySchema],
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);

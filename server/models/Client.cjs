const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: String,
  date: String,
  venue: String,
  status: { type: String, default: 'Pending' },
});

const paymentSchema = new mongoose.Schema({
  amount: Number,
  date: String,
  method: String,
  note: String,
}, { timestamps: true });

const clientSchema = new mongoose.Schema({
  clientId: { type: String, unique: true },
  enquiryId: String,
  coupleName: { type: String, required: true },
  phone: String,
  altPhone: String,
  email: String,
  weddingDate: String,
  weddingDateTo: String,
  numberOfDays: String,
  foodDays: String,
  destination: String,
  budget: Number,
  guestCount: Number,
  leadSource: String,
  message: String,
  status: { type: String, default: 'Planning' },
  events: [eventSchema],
  team: [String],
  payments: [paymentSchema],
  totalPaid: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);

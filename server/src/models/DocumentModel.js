const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  type: { type: String, required: [true, 'Type is required'] },
  status: { type: String, required: [true, 'Status is required'] },
  date: { type: Date, default: Date.now },
  confidence: { type: Number, required: [true, 'Confidence is required'] },
});

module.exports = mongoose.model('Document', DocumentSchema);
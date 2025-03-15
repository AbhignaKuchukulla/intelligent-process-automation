const mongoose = require('mongoose');

const WorkflowSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  type: { type: String, required: [true, 'Type is required'] },
  status: { type: String, required: [true, 'Status is required'] },
  lastRun: { type: Date, default: Date.now },
  nextRun: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workflow', WorkflowSchema);
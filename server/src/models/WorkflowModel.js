const mongoose = require('mongoose');

const WorkflowSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  description: { type: String },
  type: { type: String, required: [true, 'Type is required'] },
  status: { type: String, required: [true, 'Status is required'], default: 'active' },
  triggerType: { type: String, enum: ['manual', 'scheduled', 'event'], default: 'manual' },
  documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  actions: [{ type: String }],
  lastRun: { type: Date },
  nextRun: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workflow', WorkflowSchema);
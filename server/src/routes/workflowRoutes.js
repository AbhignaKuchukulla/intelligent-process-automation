const express = require('express');
const router = express.Router();
const WorkflowModel = require('../models/WorkflowModel');

// ✅ Fetch All Workflows
router.get('/', async (req, res) => {
  try {
    const workflows = await WorkflowModel.find();
    res.json(workflows);
  } catch (error) {
    console.error('Fetch Workflows Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
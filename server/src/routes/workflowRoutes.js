const express = require('express');
const router = express.Router();
const WorkflowModel = require('../models/WorkflowModel');

// ✅ Fetch All Workflows
router.get('/', async (req, res) => {
  try {
    const workflows = await WorkflowModel.find().populate('documentIds', 'name type status');
    const formattedWorkflows = workflows.map(wf => ({
      id: wf._id.toString(),
      name: wf.name,
      description: wf.description,
      type: wf.type,
      status: wf.status,
      triggerType: wf.triggerType,
      documentIds: wf.documentIds,
      actions: wf.actions,
      lastRun: wf.lastRun,
      nextRun: wf.nextRun,
      createdAt: wf.createdAt,
      updatedAt: wf.updatedAt,
    }));
    res.json(formattedWorkflows);
  } catch (error) {
    console.error('Fetch Workflows Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Fetch Workflow by ID
router.get('/:id', async (req, res) => {
  try {
    const workflow = await WorkflowModel.findById(req.params.id).populate('documentIds', 'name type status');
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    const formattedWorkflow = {
      id: workflow._id.toString(),
      name: workflow.name,
      description: workflow.description,
      type: workflow.type,
      status: workflow.status,
      triggerType: workflow.triggerType,
      documentIds: workflow.documentIds,
      actions: workflow.actions,
      lastRun: workflow.lastRun,
      nextRun: workflow.nextRun,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
    };
    res.json(formattedWorkflow);
  } catch (error) {
    console.error('Fetch Workflow by ID Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Create Workflow
router.post('/', async (req, res) => {
  try {
    const { name, description, type, triggerType, documentIds, actions } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const newWorkflow = new WorkflowModel({
      name,
      description,
      type,
      status: 'active',
      triggerType: triggerType || 'manual',
      documentIds: documentIds || [],
      actions: actions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newWorkflow.save();

    res.status(201).json({
      id: newWorkflow._id.toString(),
      name: newWorkflow.name,
      status: newWorkflow.status,
    });
  } catch (error) {
    console.error('Create Workflow Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Update Workflow
router.put('/:id', async (req, res) => {
  try {
    const { name, description, type, status, triggerType, documentIds, actions, nextRun } = req.body;

    const workflow = await WorkflowModel.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    if (name) workflow.name = name;
    if (description !== undefined) workflow.description = description;
    if (type) workflow.type = type;
    if (status) workflow.status = status;
    if (triggerType) workflow.triggerType = triggerType;
    if (documentIds) workflow.documentIds = documentIds;
    if (actions) workflow.actions = actions;
    if (nextRun) workflow.nextRun = nextRun;
    workflow.updatedAt = new Date();

    await workflow.save();

    res.json({
      id: workflow._id.toString(),
      name: workflow.name,
      status: workflow.status,
      message: 'Workflow updated successfully',
    });
  } catch (error) {
    console.error('Update Workflow Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Delete Workflow
router.delete('/:id', async (req, res) => {
  try {
    const workflow = await WorkflowModel.findByIdAndDelete(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    res.json({ 
      message: 'Workflow deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Delete Workflow Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Execute Workflow
router.post('/:id/execute', async (req, res) => {
  try {
    const workflow = await WorkflowModel.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    workflow.lastRun = new Date();
    await workflow.save();

    res.json({
      message: 'Workflow executed successfully',
      id: workflow._id.toString(),
      lastRun: workflow.lastRun,
    });
  } catch (error) {
    console.error('Execute Workflow Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
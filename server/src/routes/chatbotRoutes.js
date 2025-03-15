const express = require('express');
const axios = require('axios');
const router = express.Router();

// Handle preflight requests
router.options('/chat', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(200);
});

// Chatbot Controller
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    // Forward the message to the Flask backend
    const flaskResponse = await axios.post('http://localhost:5002/chat', { message });

    // Return the response to the frontend
    res.json({ response: flaskResponse.data.response });
  } catch (error) {
    console.error('Chatbot Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
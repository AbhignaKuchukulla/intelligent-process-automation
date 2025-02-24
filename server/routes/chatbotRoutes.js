const express = require('express');

const router = express.Router();

router.post('/chat', (req, res) => {
  const { message } = req.body;
  const response = message.includes('hello') ? 'Hi there!' : 'I don\'t understand.';
  res.json({ response });
});

module.exports = router;

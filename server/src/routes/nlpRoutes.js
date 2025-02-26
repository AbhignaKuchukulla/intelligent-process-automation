const express = require('express');
const { nlpController } = require('../controllers/nlpController');

const router = express.Router();

router.post('/analyze', nlpController);

module.exports = router;

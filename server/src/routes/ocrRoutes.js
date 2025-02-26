const express = require('express');
const { ocrController } = require('../controllers/ocrController');

const router = express.Router();

router.post('/ocr', ocrController);

module.exports = router;

const express = require('express');
const multer = require('multer');
const { processOCR } = require('../services/ocrService');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  const text = await processOCR(req.file.path);
  res.json({ extractedText: text });
});

module.exports = router;

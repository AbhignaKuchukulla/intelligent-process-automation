const express = require('express');
const { upload, uploadFile, getDocuments } = require('../controllers/uploadController');
const router = express.Router();
router.post('/', upload.single('file'), uploadFile);
router.get('/', getDocuments); // Fetch documents route
module.exports = router;

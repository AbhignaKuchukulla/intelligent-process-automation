const express = require('express');
const { upload, uploadFile, getDocuments, getDocumentById } = require('../controllers/uploadController');
const router = express.Router();

router.post('/', upload.single('file'), uploadFile);
router.get('/', getDocuments); // Fetch all documents
router.get('/:id', getDocumentById); // Fetch a single document by ID

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const DocumentModel = require('../models/DocumentModel');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://localhost:5001';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and DOCX files are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// OCR Processing Function
async function processDocumentOCR(documentId, filePath) {
  try {
    console.log(`Processing OCR for document ${documentId}, file: ${filePath}`);
    
    // Update status to processing
    await DocumentModel.findByIdAndUpdate(documentId, { 
      status: 'processing' 
    });

    // Create form data with file
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    // Call OCR service
    const response = await axios.post(`${OCR_SERVICE_URL}/perform-ocr`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 60000, // 60 second timeout
    });

    // Update document with extracted text
    await DocumentModel.findByIdAndUpdate(documentId, {
      status: 'processed',
      extractedText: response.data.text || '',
      confidence: response.data.confidence || 95,
      processedAt: new Date(),
    });

    console.log(`OCR processing completed for document ${documentId}`);
  } catch (error) {
    console.error(`OCR processing failed for document ${documentId}:`, error.message);
    
    // Update status to failed
    await DocumentModel.findByIdAndUpdate(documentId, {
      status: 'failed',
      processedAt: new Date(),
    });
  }
}

// ✅ Upload Document
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, path: filePath } = req.file;

    const newDocument = new DocumentModel({
      name: originalname,
      type: mimetype,
      status: 'pending',
      date: new Date(),
      confidence: 0,
      filePath: filePath,
    });

    await newDocument.save();

    // Process OCR asynchronously
    processDocumentOCR(newDocument._id, filePath).catch(err => {
      console.error('Background OCR processing error:', err);
    });

    res.status(201).json({
      id: newDocument._id,
      name: newDocument.name,
      status: newDocument.status,
    });
  } catch (error) {
    console.error('Upload Document Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Fetch All Documents
router.get('/', async (req, res) => {
  try {
    const documents = await DocumentModel.find();
    // Map MongoDB _id to id for frontend compatibility
    const formattedDocs = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      type: doc.type,
      status: doc.status,
      date: doc.date,
      confidence: doc.confidence,
      extractedText: doc.extractedText,
      processedAt: doc.processedAt,
    }));
    res.json(formattedDocs);
  } catch (error) {
    console.error('Fetch Documents Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Fetch Document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await DocumentModel.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    // Map MongoDB _id to id for frontend compatibility
    const formattedDoc = {
      id: document._id.toString(),
      name: document.name,
      type: document.type,
      status: document.status,
      date: document.date,
      confidence: document.confidence,
      extractedText: document.extractedText,
      processedAt: document.processedAt,
    };
    res.json(formattedDoc);
  } catch (error) {
    console.error('Fetch Document by ID Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Reprocess Document
router.post('/:id/reprocess', async (req, res) => {
  try {
    const document = await DocumentModel.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!document.filePath) {
      return res.status(400).json({ message: 'Document file path not found' });
    }

    // Check if file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: 'Document file not found on server' });
    }

    // Trigger OCR processing
    processDocumentOCR(document._id, document.filePath).catch(err => {
      console.error('Background reprocess error:', err);
    });

    res.json({ 
      message: 'Document reprocessing started',
      id: document._id.toString(),
      status: 'processing'
    });
  } catch (error) {
    console.error('Reprocess Document Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
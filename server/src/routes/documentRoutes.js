const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const DocumentModel = require('../models/DocumentModel');

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
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// ✅ Upload Document
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, path } = req.file;

    const newDocument = new DocumentModel({
      name: originalname,
      type: mimetype,
      status: 'Pending',
      date: new Date(),
      confidence: 0, // Default confidence
    });

    await newDocument.save();

    res.status(201).json({
      id: newDocument._id,
      name: newDocument.name,
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
    res.json(documents);
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
    res.json(document);
  } catch (error) {
    console.error('Fetch Document by ID Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
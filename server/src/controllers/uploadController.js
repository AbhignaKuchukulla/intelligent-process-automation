const multer = require('multer');
const { getCollection } = require('../config/db');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  
  try {
    const documentsCollection = await getCollection('documents');
    const fileData = {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
    };
    const result = await documentsCollection.insertOne(fileData);
    res.json({ success: true, filePath: `/api/files/${result.insertedId}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving file' });
  }
};
const getDocuments = async (req, res) => {
    try {
      const documentsCollection = await getCollection('documents');
      const documents = await documentsCollection.find({}).toArray();
      
      const formattedDocuments = documents.map(doc => ({
        id: doc._id,
        name: doc.filename,
        type: doc.contentType,
        date: doc.uploadDate || new Date().toISOString(),
        status: 'Processed',  // Set default status
        confidence: Math.floor(Math.random() * (100 - 80 + 1)) + 80, // Mock confidence value
      }));
  
      res.json(formattedDocuments);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching documents' });
    }
  };
  


module.exports = { upload, uploadFile, getDocuments };
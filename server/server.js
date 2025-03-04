const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const logger = require('./src/utils/logger');

// ✅ Routes
const userRoutes = require('./src/routes/userRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const authRoutes = require('./src/routes/authRoutes');
const ocrRoutes = require('./src/routes/ocrRoutes');
const nlpRoutes = require('./src/routes/nlpRoutes');

// ✅ Check environment variables
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  logger.error('❌ Missing environment variables. Please check your .env file.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5005;

// ✅ CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // ✅ Frontend URL
  credentials: true,               // ✅ Allow credentials (cookies, authorization)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Handle preflight requests globally

// ✅ Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Sample Routes
app.get('/api/documents', (req, res) => {
  res.json([
    { id: 'doc_1', name: 'Invoice-XYZ.pdf', status: 'Processed' },
    { id: 'doc_2', name: 'Contract-ABC.pdf', status: 'Pending' },
  ]);
});

app.get('/api/workflows', (req, res) => {
  res.json([
    { id: 'workflow_1', name: 'Invoice Processing', status: 'Active' },
    { id: 'workflow_2', name: 'Contract Validation', status: 'Completed' },
  ]);
});

// ✅ Routes usage
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/nlp', nlpRoutes);

// ✅ Error Handler
app.use((err, req, res, next) => {
  logger.error(`❌ Error: ${err.message}`);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('✅ MongoDB connected successfully');
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    logger.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  });

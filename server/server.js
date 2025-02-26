const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./src/routes/userRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const authRoutes = require('./src/routes/authRoutes');
const ocrRoutes = require('./src/routes/ocrRoutes');
const nlpRoutes = require('./src/routes/nlpRoutes');
const logger = require('./src/utils/logger');

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
    logger.error('❌ Missing environment variables. Please check your .env file.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5005;

// ✅ Allow requests from frontend (localhost:3001)
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

app.use(express.json());

// ✅ Serve uploaded files (so frontend can access them)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Documents Route (Used in fetchDocuments)
app.get('/api/documents', (req, res) => {
    res.json([
        { id: 'doc_1', name: 'Invoice-XYZ.pdf', status: 'Processed' },
        { id: 'doc_2', name: 'Contract-ABC.pdf', status: 'Pending' },
    ]);
});

// ✅ Workflows Route (Used in fetchWorkflows)
app.get('/api/workflows', (req, res) => {
    res.json([
        { id: 'workflow_1', name: 'Invoice Processing', status: 'Active' },
        { id: 'workflow_2', name: 'Contract Validation', status: 'Completed' },
    ]);
});

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/nlp', nlpRoutes);

// ✅ Custom Error Handler
app.use((err, req, res, next) => {
    logger.error(`❌ Error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ✅ MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        logger.info('✅ MongoDB connected successfully');
        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        logger.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    });

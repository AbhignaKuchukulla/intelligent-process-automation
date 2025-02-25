import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import chatbotRoutes from './src/routes/chatbotRoutes';
import authRoutes from './src/routes/authRoutes';
import userRoutes from './src/routes/userRoutes';

import connectDB from './src/config/db';
import logger from './src/utils/logger';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Connect to MongoDB Atlas
connectDB();

// Routes
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: '🚀 API is running...' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server
app.listen(PORT, () => logger.info(`✅ Server running on port ${PORT}`));

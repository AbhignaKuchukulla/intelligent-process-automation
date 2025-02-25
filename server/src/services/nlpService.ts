import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PORT, NODE_ENV } from '../config/env';
import connectDB from '../config/db';
import logger from '../utils/logger';

// Import routes
import authRoutes from '../routes/authRoutes';
import userRoutes from '../routes/userRoutes';

// Connect to database
connectDB();

// Initialize express app
const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running...' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({
    message: NODE_ENV === 'production' ? 'Server Error' : err.message,
    stack: NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

export default app;
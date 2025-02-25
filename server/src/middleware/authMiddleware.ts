import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import logger from '../utils/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret') as { id: string };
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401).json({ success: false, message: 'User not found' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};

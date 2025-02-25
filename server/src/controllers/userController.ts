import { Request, Response } from 'express';
import User from '../models/User';
import logger from '../utils/logger';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    logger.error('Get user by id error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    
    // Only update password if it's provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      await user.deleteOne();
      res.json({ success: true, message: 'User removed' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
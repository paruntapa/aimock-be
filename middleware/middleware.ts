import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) return res.status(401).json({ message: 'User not found' });

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Validation schemas
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Validation middleware
export const validateSignUp = (req: Request, res: Response, next: NextFunction) => {
  try {
    signUpSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ errors: error.errors });
  }
};

export const validateSignIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    signInSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ errors: error.errors });
  }
};
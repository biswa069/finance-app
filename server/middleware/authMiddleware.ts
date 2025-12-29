import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'biswapd69';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: { id: string };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from header (Format: "Bearer <token>")
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };
    req.user = decoded; // Attach user ID to the request
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
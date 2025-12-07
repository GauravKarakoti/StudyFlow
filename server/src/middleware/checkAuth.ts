import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Extend the Express Request type to include our user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        email: string
        role: 'USER' | 'ADMIN'
      }
    }
  }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as Express.Request['user']
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access forbidden: Admins only' })
  }
  next()
}
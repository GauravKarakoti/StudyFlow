import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db.ts'
import { Role } from '@prisma/client'

const router = Router()

// NEW: Public signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  // Add more validation (e.g., password length) here
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create the user with the USER role
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.USER, // Default role for public signup
      },
    })

    // Issue JWT to log them in immediately
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })

  } catch (error: any) {
    if (error.code === 'P2002') { // Prisma unique constraint violation
      return res.status(400).json({ message: 'An account with this email already exists' })
    }
    res.status(500).json({ message: 'Error creating user', error: error.message })
  }
})

// Existing Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  // Issue JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  )

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  })
})

export default router
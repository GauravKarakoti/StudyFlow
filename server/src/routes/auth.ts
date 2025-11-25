import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db.js'
import { Role } from '@prisma/client'
import { generateSignedUrl } from '../lib/s3Utils.js' //
import { sendNotification } from '../lib/notification.js'
import { OAuth2Client } from 'google-auth-library'

const router = Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Helper to sign avatar URL
async function signUserAvatar(user: any) {
  if (user?.avatarUrl && process.env.B2_BUCKET_NAME) {
    try {
      user.avatarUrl = await generateSignedUrl(user.avatarUrl, process.env.B2_BUCKET_NAME);
    } catch (error) {
      console.error("Error signing avatar URL:", error);
    }
  }
  return user;
}

// NEW: Public signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.USER,
      },
    })

    await sendNotification(user.id, `Welcome to StudyFlow, ${user.name || 'Student'}! 🚀`);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )

    // Sign the user object before sending
    const userWithSignedAvatar = await signUserAvatar({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,          
      avatarUrl: user.avatarUrl,
    });

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: userWithSignedAvatar,
    })

  } catch (error: any) {
    if (error.code === 'P2002') {
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

  const isPasswordValid = await bcrypt.compare(password, user.password as string)
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  )

  // Sign the user object before sending
  const userWithSignedAvatar = await signUserAvatar({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,          
    avatarUrl: user.avatarUrl,
  });

  res.json({
    message: 'Login successful',
    token,
    user: userWithSignedAvatar,
  })
})

router.post('/google', async (req, res) => {
  const { credential } = req.body;

  try {
    // 1. Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const { email, name, picture, sub: googleId } = payload;

    // 2. Find or Create User
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          avatarUrl: picture, // Use Google profile picture
          googleId,
          role: Role.USER,
          // No password needed
        },
      });
      await sendNotification(user.id, `Welcome to StudyFlow, ${user.name || 'Student'}! 🚀`);
    } else {
        // Optional: Update avatar if it's currently null
        if (!user.avatarUrl) {
            await prisma.user.update({
                where: { id: user.id },
                data: { avatarUrl: picture, googleId }
            });
        }
    }

    // 3. Generate JWT (Same as standard login)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    const userWithSignedAvatar = await signUserAvatar({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });

    res.json({
      message: 'Google login successful',
      token,
      user: userWithSignedAvatar,
    });

  } catch (error: any) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

export default router
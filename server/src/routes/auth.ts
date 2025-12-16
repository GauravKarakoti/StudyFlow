import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db.js'
import { Role } from '@prisma/client'
import { generateSignedUrl } from '../lib/s3Utils.js'
import { sendNotification } from '../lib/notification.js'
import { OAuth2Client } from 'google-auth-library'
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../lib/email.js';
import { sendWhatsappMessage } from '../lib/notification.js';

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
      { expiresIn: '365d' }
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
    { expiresIn: '365d' }
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
      { expiresIn: '365d' }
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

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, don't reveal if user exists
      return res.status(200).json({ message: 'If an account exists, an email has been sent.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt,
      },
    });

    // Send Email
    await sendResetPasswordEmail(user.email as string, token);

    res.json({ message: 'If an account exists, an email has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
});

router.post('/send-otp', async (req, res) => {
  console.log(`Received request to send OTP`);
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ message: 'Phone number required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  console.log(`Sending OTP ${code} to ${phoneNumber}`);
  try {
    await prisma.verificationCode.upsert({
      where: { contact: phoneNumber },
      update: { code, expiresAt },
      create: { contact: phoneNumber, code, expiresAt }
    });
    console.log(`Generated OTP ${code} for ${phoneNumber}`);

    await sendWhatsappMessage(phoneNumber, `Your StudyFlow Login Code is: ${code}`);
    console.log(`Sent OTP ${code} to ${phoneNumber} via WhatsApp`);
    res.json({ message: 'OTP sent via WhatsApp' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Verify OTP and Login/Signup
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, code } = req.body;

  try {
    const record = await prisma.verificationCode.findUnique({
      where: { contact: phoneNumber }
    });

    if (!record || record.code !== code || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    await prisma.verificationCode.delete({ where: { contact: phoneNumber } });

    // Find or Create User
    let user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phoneNumber,
          role: Role.USER,
          // Email is now optional, so this is valid
        }
      });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // email might be null
      process.env.JWT_SECRET!,
      { expiresIn: '365d' }
    );

    // Sign User (Avatar helper logic from your existing file)
    const userWithSignedAvatar = await signUserAvatar(user);

    res.json({
      message: 'Login successful',
      token,
      user: userWithSignedAvatar
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

// 2. Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(), // Check if not expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Hash new password and clear token
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

export default router
import { Router } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';

// --- NEW IMPORTS ---
import multerS3 from 'multer-s3-v3';
import { s3, generateSignedUrl } from '../lib/s3Utils.js'; // Import utility

// Remove unused local file system imports (path, fs, fileURLToPath)

const router = Router();

// --- B2 & Multer Setup for Avatar Uploads ---
const upload = multer({ 
  storage: multerS3({
    s3: s3,
    bucket: process.env.B2_BUCKET_NAME!,
    // IMPORTANT: No 'acl: public-read' is needed, the bucket is private.
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: any, file: any, cb: any) {
      const userId = (req as any).user.id;
      const fileExtension = file.originalname.split('.').pop();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // Save the KEY (path) for the avatar
      const s3Key = `avatars/user-${userId}-${uniqueSuffix}.${fileExtension}`;
      cb(null, s3Key);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed') as any, false);
    }
  }
});

// --- Helper function to sign the avatarUrl before returning to the client ---
async function signUserAvatar(user: any) {
  if (user?.avatarUrl && process.env.B2_BUCKET_NAME) {
    user.avatarUrl = await generateSignedUrl(user.avatarUrl, process.env.B2_BUCKET_NAME);
  }
  return user;
}


// --- Routes ---

// GET /api/user/me - Get current user details AND sign the avatar URL
router.get('/me', async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, avatarUrl: true, role: true }
    });
    
    const signedUser = await signUserAvatar(user);

    res.json(signedUser);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// PUT /api/user/profile - Update basic profile info (name)
router.put('/profile', async (req: any, res) => {
  const { name } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: { id: true, email: true, name: true, avatarUrl: true, role: true }
    });
    
    const signedUser = await signUserAvatar(updatedUser);

    res.json(signedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// POST /api/user/avatar - Upload and update avatar
router.post('/avatar', upload.single('avatar'), async (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const avatarKey = req.file.key;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl: avatarKey }, // Save the KEY (path) to the database
      select: { id: true, email: true, name: true, avatarUrl: true, role: true }
    });

    const signedUser = await signUserAvatar(updatedUser);

    res.json(signedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating avatar" });
  }
});

// PUT /api/user/password - Change password
router.put('/password', async (req: any, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both fields are required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 chars" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(currentPassword, user.password as string);
    if (!isValid) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
  }
});

export default router;
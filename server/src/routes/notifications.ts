import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all notifications for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.id; // Assuming checkAuth middleware populates req.user
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to recent 20
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark a specific notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const userId = req.user!.id;
    const notificationId = parseInt(req.params.id);

    await prisma.notification.update({
      where: { id: notificationId, userId }, // Ensure user owns the notification
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark ALL notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user!.id;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

export default router;
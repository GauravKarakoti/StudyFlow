import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const leaderboard = await prisma.userProgress.findMany({
      take: 10,
      orderBy: { points: 'desc' },
      include: {
        user: {
          select: { name: true, avatarUrl: true }
        }
      }
    });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
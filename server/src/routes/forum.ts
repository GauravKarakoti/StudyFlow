import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

router.get('/threads', async (req, res) => {
  const threads = await prisma.forumThread.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { 
      author: { select: { name: true, avatarUrl: true } },
      posts: { select: { id: true } } // Include posts (ids only) so frontend can count them
    }
  });
  res.json(threads);
});

// Create Thread
router.post('/threads', async (req, res) => {
  const { title, body } = req.body;
  // @ts-ignore
  const userId = req.user.id;
  
  const thread = await prisma.forumThread.create({
    data: { title, body, authorId: userId }
  });
  res.json(thread);
});

// Get Single Thread with Posts
router.get('/threads/:id', async (req, res) => {
  const thread = await prisma.forumThread.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      author: { select: { name: true, avatarUrl: true } },
      posts: {
        include: { author: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });
  res.json(thread);
});

// Reply to Thread
router.post('/threads/:id/posts', async (req, res) => {
  const { body } = req.body;
  // @ts-ignore
  const userId = req.user.id;
  
  const post = await prisma.forumPost.create({
    data: {
      body,
      threadId: parseInt(req.params.id),
      authorId: userId
    }
  });
  res.json(post);
});

export default router;
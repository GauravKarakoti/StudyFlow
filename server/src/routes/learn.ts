import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Get the Learning Map (Units > Lessons > Challenges)
router.get('/courses/:courseId/units', async (req, res) => {
  const { courseId } = req.params;
  // @ts-ignore
  const userId = req.user.id; 

  try {
    const units = await prisma.unit.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            challenges: {
              include: {
                challengeProgress: {
                  where: { userId }
                }
              }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    // Calculate progress for frontend
    const unitsWithProgress = units.map(unit => ({
      ...unit,
      lessons: unit.lessons.map(lesson => {
        const completedChallenges = lesson.challenges.filter(
          c => c.challengeProgress.length > 0 && c.challengeProgress[0]?.completed
        );
        const isCompleted = completedChallenges.length === lesson.challenges.length && lesson.challenges.length > 0;
        return { ...lesson, completed: isCompleted };
      })
    }));

    res.json(unitsWithProgress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// Get Challenge Data for a Lesson
router.get('/lessons/:lessonId', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(req.params.lessonId) },
      include: {
        challenges: {
          orderBy: { order: 'asc' },
          include: {
            options: true,
            challengeProgress: {
              // @ts-ignore
              where: { userId: req.user.id }
            }
          }
        }
      }
    });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Lesson not found' });
  }
});

// Submit Challenge Progress
router.post('/progress', async (req, res) => {
  const { challengeId, isCorrect } = req.body;
  // @ts-ignore
  const userId = req.user.id;

  try {
    let progress = await prisma.userProgress.findUnique({ where: { userId } });
    
    // Initialize progress if not exists
    if (!progress) {
      progress = await prisma.userProgress.create({
        data: { userId, hearts: 5, points: 0 }
      });
    }

    if (isCorrect) {
      // Mark challenge as completed
      await prisma.challengeProgress.upsert({
        where: { userId_challengeId: { userId, challengeId } },
        update: { completed: true },
        create: { userId, challengeId, completed: true }
      });

      // Award XP
      await prisma.userProgress.update({
        where: { userId },
        data: { points: { increment: 10 } }
      });
      
      res.json({ success: true, pointsAdded: 10 });
    } else {
      // Deduct Hearts
      if (progress.hearts > 0) {
        await prisma.userProgress.update({
          where: { userId },
          data: { hearts: { decrement: 1 } }
        });
        res.json({ success: false, heartsLeft: progress.hearts - 1 });
      } else {
        res.status(403).json({ error: 'No hearts left' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update failed' });
  }
});

export default router;
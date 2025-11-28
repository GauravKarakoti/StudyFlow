import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// [ADD THIS] Refill Logic Helper
const HEART_REFILL_INTERVAL = 30 * 60 * 1000; // 30 Minutes per heart
const MAX_HEARTS = 5;

async function checkAndRefillHearts(userId: number) {
  let progress = await prisma.userProgress.findUnique({ where: { userId } });

  // Create progress if it doesn't exist
  if (!progress) {
    progress = await prisma.userProgress.create({
      data: { userId, hearts: 5, points: 0, lastRefillAt: new Date() }
    });
  }

  // Calculate Refill
  if (progress.hearts < MAX_HEARTS) {
    const now = new Date();
    const timePassed = now.getTime() - new Date(progress.lastRefillAt).getTime();
    
    // Floor to see how many intervals have passed
    const heartsToRecover = Math.floor(timePassed / HEART_REFILL_INTERVAL);

    if (heartsToRecover > 0) {
      const newHearts = Math.min(MAX_HEARTS, progress.hearts + heartsToRecover);
      
      // We don't just set 'now', we calculate the time used to recover 
      // so the "remainder" time counts towards the next heart.
      // E.g. if 40 mins passed, we use 30 mins for 1 heart, leaving 10 mins "banked".
      const timeUsed = heartsToRecover * HEART_REFILL_INTERVAL;
      // Prevent date overflow if fully healed (just set to now)
      const newRefillDate = newHearts === MAX_HEARTS 
        ? now 
        : new Date(new Date(progress.lastRefillAt).getTime() + timeUsed);

      progress = await prisma.userProgress.update({
        where: { userId },
        data: {
          hearts: newHearts,
          lastRefillAt: newRefillDate
        }
      });
    }
  }
  return progress;
}

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

router.get('/lessons/:lessonId', async (req, res) => {
  // @ts-ignore
  const userId = req.user.id; // Ensure you have access to user ID here

  try {
    // 1. Get User Progress (Handling Refills)
    const userProgress = await checkAndRefillHearts(userId);

    // 2. Fetch Lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(req.params.lessonId) },
      include: {
        challenges: {
          orderBy: { order: 'asc' },
          include: {
            options: true,
            challengeProgress: {
              where: { userId }
            }
          }
        }
      }
    });

    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    // 3. Return combined data
    res.json({
      lesson,
      userHearts: userProgress.hearts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lesson not found' });
  }
});

// [UPDATED] Handle Progress
router.post('/progress', async (req, res) => {
  const { challengeId, isCorrect } = req.body;
  // @ts-ignore
  const userId = req.user.id;

  try {
    // 1. Check/Refill hearts before doing anything
    const progress = await checkAndRefillHearts(userId);

    if (isCorrect) {
      const existingCompletion = await prisma.challengeProgress.findUnique({
        where: { userId_challengeId: { userId, challengeId } }
      });

      await prisma.challengeProgress.upsert({
        where: { userId_challengeId: { userId, challengeId } },
        update: { completed: true },
        create: { userId, challengeId, completed: true }
      });

      let pointsAdded = 0;
      if (!existingCompletion?.completed) {
        await prisma.userProgress.update({
          where: { userId },
          data: { points: { increment: 10 } }
        });
        pointsAdded = 10;
      }
      
      res.json({ success: true, pointsAdded, heartsLeft: progress.hearts });
    } else {
      // 2. Deduct Hearts
      if (progress.hearts > 0) {
        await prisma.userProgress.update({
          where: { userId },
          data: { 
            hearts: { decrement: 1 },
            // If they were at max hearts, start the timer now
            lastRefillAt: progress.hearts === 5 ? new Date() : progress.lastRefillAt 
          }
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
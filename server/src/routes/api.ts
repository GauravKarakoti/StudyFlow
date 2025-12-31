import { Router } from 'express'
import prisma from '../db.js'

const router = Router()

// --- NEW SEARCH ENDPOINT ---
router.get('/search-data', async (req, res) => {
  try {
    // 1. Fetch all University Courses
    const courses = await prisma.course.findMany({
      where: { type: 'UNIVERSITY' },
      select: { id: true, name: true }
    });

    // 2. Fetch all Branches with their Course Name
    const branches = await prisma.branch.findMany({
      include: {
        course: { select: { name: true } }
      }
    });

    // 3. Fetch all Subjects with Branch and Semester details
    const subjects = await prisma.subject.findMany({
      include: {
        branch: {
          include: {
            course: { select: { id: true } } // Needed for navigation URL
          }
        },
        semester: { select: { id: true, name: true } }
      }
    });

    res.json({ courses, branches, subjects });
  } catch (error) {
    console.error("Error fetching search data:", error);
    res.status(500).json({ error: "Failed to fetch search data" });
  }
});

router.get('/courses', async (req, res) => {
  const courses = await prisma.course.findMany({
    where: {
      type: 'UNIVERSITY'
    }
  })
  res.json(courses)
})

router.get('/stats', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ userCount });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
})

// Get branches for a course
router.get('/branches/:courseId', async (req, res) => {
  const { courseId } = req.params
  const branches = await prisma.branch.findMany({
    where: { courseId },
  })
  res.json(branches)
})

// Get all semesters
router.get('/semesters', async (req, res) => {
  const semesters = await prisma.semester.findMany()
  res.json(semesters)
})

// Get subjects for a branch and semester
router.get('/subjects/:branchId/:semesterId', async (req, res) => {
  const { branchId, semesterId } = req.params
  const subjects = await prisma.subject.findMany({
    where: { branchId, semesterId },
  })
  res.json(subjects)
})

router.get('/topics/:subjectId', async (req, res) => {
  const { subjectId } = req.params
  const topics = await prisma.topic.findMany({
    where: { subjectId },
    orderBy: { name: 'asc' }
  })
  res.json(topics)
})

// Get notes for a topic
router.get('/notes/:topicId', async (req, res) => {
  const { topicId } = req.params
  const notes = await prisma.note.findMany({
    where: { topicId },
  })
  res.json(notes)
})

export default router
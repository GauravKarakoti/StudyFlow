import { Router } from 'express'
import prisma from '../db.ts'

const router = Router()

// This route is already protected by checkAuth and checkAdmin in index.ts

// Create Course
router.post('/course', async (req, res) => {
  const { name, id } = req.body; // e.g., id: "btech", name: "Bachelors of Technology"
  const course = await prisma.course.create({ data: { id, name } });
  res.json(course);
});

// Create Branch
router.post('/branch', async (req, res) => {
  const { name, id, courseId } = req.body;
  const branch = await prisma.branch.create({ data: { id, name, courseId } });
  res.json(branch);
});

// Create Semester
router.post('/semester', async (req, res) => {
  const { name, id } = req.body;
  const semester = await prisma.semester.create({ data: { id, name } });
  res.json(semester);
});

// Create Subject
router.post('/subject', async (req, res) => {
  const { name, id, branchId, semesterId } = req.body;
  const subject = await prisma.subject.create({ data: { id, name, branchId, semesterId } });
  res.json(subject);
});

// Create Topic
router.post('/topic', async (req, res) => {
  const { name, subjectId } = req.body
  const topic = await prisma.topic.create({
    data: { name, subjectId },
  })
  res.json(topic)
})

// Create Note (Upload)
router.post('/note', async (req, res) => {
  const { title, content, topicId } = req.body
  const uploaderId = req.user!.id // We know user exists from checkAuth

  const note = await prisma.note.create({
    data: {
      title,
      content,
      topicId,
      uploaderId,
    },
  })
  res.json(note)
})

export default router
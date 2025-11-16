import { Router } from 'express'
import prisma from '../db.ts'

const router = Router()

// Get all courses
router.get('/courses', async (req, res) => {
  const courses = await prisma.course.findMany()
  res.json(courses)
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

// Get topics for a subject
router.get('/topics/:subjectId', async (req, res) => {
  const { subjectId } = req.params
  const topics = await prisma.topic.findMany({
    where: { subjectId },
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
import { Router } from 'express'
import prisma from '../db.js'
import multer from 'multer'

// +++ Imports for B2 Object Storage +++
import multerS3 from 'multer-s3-v3'
// Import the pre-configured S3 client and signed URL generator from your utility file
import { s3 } from '../lib/s3Utils.js' 
import { sendNotification } from '../lib/notification.js'

const router = Router()

// +++ Multer storage configuration for B2 +++
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.B2_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: any, file: any, cb: any) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const fileExtension = file.originalname.split('.').pop()
      const s3Key = `notes/note-${uniqueSuffix}.${fileExtension}`
      cb(null, s3Key)
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed!') as any, false)
    }
  },
})

// --- Data Creation Routes ---

// Create Course (Updated to support 'type')
router.post('/course', async (req, res) => {
  const { name, id, type } = req.body // type can be 'UNIVERSITY' (default) or 'LEARN'
  const course = await prisma.course.create({ data: { id, name, type } })
  res.json(course)
})

// Create Branch
router.post('/branch', async (req, res) => {
  const { name, id, courseId } = req.body
  const branch = await prisma.branch.create({ data: { id, name, courseId } })
  res.json(branch)
})

// Create Semester
router.post('/semester', async (req, res) => {
  const { name, id } = req.body
  const semester = await prisma.semester.create({ data: { id, name } })
  res.json(semester)
})

// Create Subject
router.post('/subject', async (req, res) => {
  const { name, id, branchId, semesterId } = req.body
  const subject = await prisma.subject.create({ data: { id, name, branchId, semesterId } })
  res.json(subject)
})

router.post('/topic', async (req, res) => {
  const { name, subjectId } = req.body
  const topic = await prisma.topic.create({
    data: { name, subjectId },
  })
  res.json(topic)
})

// --- Learn Routes (Units & Lessons) ---

// Create Unit
router.post('/unit', async (req, res) => {
  const { title, description, courseId, order } = req.body
  const unit = await prisma.unit.create({
    data: { 
      title, 
      description, 
      courseId, 
      order: parseInt(order) 
    } 
  })
  res.json(unit)
})

// Create Lesson
router.post('/lesson', async (req, res) => {
  const { title, unitId, order } = req.body
  const lesson = await prisma.lesson.create({
    data: { 
      title, 
      unitId: parseInt(unitId), 
      order: parseInt(order) 
    } 
  })
  res.json(lesson)
})

// Create Challenge
router.post('/challenge', async (req, res) => {
  const { question, type, lessonId, order } = req.body
  const challenge = await prisma.challenge.create({
    data: {
      question,
      type, // 'SELECT' or 'ASSIST'
      lessonId: parseInt(lessonId),
      order: parseInt(order)
    }
  })
  res.json(challenge)
})

// Create Challenge Option
router.post('/challenge-option', async (req, res) => {
  const { text, correct, challengeId } = req.body
  const option = await prisma.challengeOption.create({
    data: {
      text,
      correct: Boolean(correct),
      challengeId: parseInt(challengeId)
    }
  })
  res.json(option)
})

// --- Note Upload Route ---
router.post('/note', upload.single('pdfFile'), async (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or file is not a PDF.' })
  }

  const { title, topicId } = req.body
  const uploaderId = req.user!.id 

  const pdfKey = req.file.key
  
  if (!title || !topicId) {
    return res.status(400).json({ error: 'Title and topicId are required.' })
  }

  try {
    const note = await prisma.note.create({
      data: {
        title,
        pdfUrl: pdfKey,
        topicId,
        uploaderId,
      },
    })

    await sendNotification(uploaderId, `Admin Action: Note "${title}" created successfully.`);

    res.json(note)
  } catch (error) {
    console.error('Failed to create note:', error)
    res.status(500).json({ error: 'Failed to save note to database.' })
  }
})

export default router
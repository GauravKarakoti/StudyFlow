import { Router } from 'express'
import prisma from '../db.js'

// +++ Imports for file handling +++
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// +++ ES module equivalent of __dirname +++
const __filename = fileURLToPath(import.meta.url)
// Go up two levels to get to the 'server' root, then to 'public/uploads/notes'
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'notes')

// +++ Multer storage configuration +++
// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

// Filter for PDF files
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed!'), false)
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })
// +++ End of Multer config +++


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

router.post('/topic', async (req, res) => {
  const { name, subjectId } = req.body
  const topic = await prisma.topic.create({
    data: { name, subjectId },
  })
  res.json(topic)
})

router.post('/note', upload.single('pdfFile'), async (req, res) => {
  // 'pdfFile' must match the name of the file input field in your admin form

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or file is not a PDF.' })
  }

  const { title, topicId } = req.body
  const uploaderId = req.user!.id // We know user exists from checkAuth

  // We store the web-accessible URL, not the full system path
  // This path is relative to the 'public' folder configured in index.ts
  const pdfUrl = `/uploads/notes/${req.file.filename}`

  if (!title || !topicId) {
    // If details are missing, delete the just-uploaded file
    fs.unlinkSync(req.file.path)
    return res.status(400).json({ error: 'Title and topicId are required.' })
  }

  try {
    const note = await prisma.note.create({
      data: {
        title,
        pdfUrl: pdfUrl, // Store the URL
        topicId,
        uploaderId,
      },
    })
    res.json(note)
  } catch (error) {
    // Handle potential DB errors and delete the orphaned file
    fs.unlinkSync(req.file.path)
    console.error('Failed to create note:', error)
    res.status(500).json({ error: 'Failed to save note to database.' })
  }
})

export default router
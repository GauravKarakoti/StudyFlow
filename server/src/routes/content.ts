import { Router } from 'express';
import prisma from '../db.js';
import multer from 'multer';

// --- NEW IMPORTS ---
import multerS3 from 'multer-s3-v3';
import { s3, generateSignedUrl } from '../lib/s3Utils.js'; // Import utility
import { sendNotification } from '../lib/notification.js';

const router = Router();

// --- B2 & Multer Setup for PDF Uploads ---
const upload = multer({ 
  storage: multerS3({
    s3: s3,
    bucket: process.env.B2_BUCKET_NAME!,
    // IMPORTANT: No 'acl: public-read'. The bucket is private.
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: any, file: any, cb: any) {
      const fileExtension = file.originalname.split('.').pop();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // Save the key (path) for the note PDF
      const s3Key = `notes/note-${uniqueSuffix}.${fileExtension}`;
      cb(null, s3Key);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // E.g., 20MB limit for PDFs
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed') as any, false);
    }
  }
});

// POST /api/content/upload-note - Upload PDF and create a Note entry
router.post('/upload-note', upload.single('pdf'), async (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No PDF file uploaded" });
  }

  const { title, topicId } = req.body;
  const uploaderId = req.user.id;
  
  // The 'key' is the permanent path in the private bucket
  const pdfKey = (req.file as any).key;

  if (!title || !topicId) {
    return res.status(400).json({ message: "Title and Topic ID are required" });
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        pdfUrl: pdfKey, // Save the KEY (path) to the database
        topicId,
        uploaderId
      },
      select: { id: true, title: true, pdfUrl: true, topicId: true }
    });
    
    await sendNotification(uploaderId, `Your note "${title}" was successfully uploaded.`);

    if (newNote.pdfUrl && process.env.B2_BUCKET_NAME) {
        (newNote as any).signedUrl = await generateSignedUrl(newNote.pdfUrl, process.env.B2_BUCKET_NAME);
    }

    res.json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating note entry in database" });
  }
});

// GET /api/content/note/signed-url/:noteId - Securely retrieve PDF link
router.get('/note/signed-url/:noteId', async (req: any, res) => {
    const { noteId } = req.params;
    
    try {
        const note = await prisma.note.findUnique({
            where: { id: parseInt(noteId) },
            select: { pdfUrl: true }
        });

        if (!note || !note.pdfUrl) {
            return res.status(404).json({ message: "Note not found." });
        }

        if (!process.env.B2_BUCKET_NAME) {
            return res.status(500).json({ message: "Server misconfiguration." });
        }

        // Generate the secure, temporary URL
        const signedUrl = await generateSignedUrl(note.pdfUrl, process.env.B2_BUCKET_NAME);
        
        res.json({ signedUrl });

    } catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).json({ message: "Could not generate secure link." });
    }
});

export default router;
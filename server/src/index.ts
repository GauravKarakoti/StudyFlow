import express from 'express'
import cors from 'cors'
import "dotenv/config"
import authRoutes from './routes/auth.js'
import apiRoutes from './routes/api.js'
import adminRoutes from './routes/admin.js'
import { checkAdmin, checkAuth } from './middleware/checkAuth.js'

// +++ Imports for serving static files +++
import path from 'path'
import { fileURLToPath } from 'url'

// +++ ES module equivalent of __dirname +++
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// +++ Serve static files from the 'public' folder +++
// This will make files in 'server/public' accessible (e.g., /uploads/notes/note.pdf)
app.use(express.static(path.join(__dirname, '..', 'public')))


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', checkAuth, checkAdmin, adminRoutes) // All admin routes are protected
app.use('/api', apiRoutes) // Public API routes

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
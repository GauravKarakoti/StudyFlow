import express from 'express'
import cors from 'cors'
import "dotenv/config"
import authRoutes from './routes/auth.ts'
import apiRoutes from './routes/api.ts'
import adminRoutes from './routes/admin.ts'
import { checkAdmin, checkAuth } from './middleware/checkAuth.ts'

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', checkAuth, checkAdmin, adminRoutes) // All admin routes are protected
app.use('/api', apiRoutes) // Public API routes

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
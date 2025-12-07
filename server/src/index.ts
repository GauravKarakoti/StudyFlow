import express from 'express'
import cors from 'cors'
import "dotenv/config"
import authRoutes from './routes/auth.js'
import apiRoutes from './routes/api.js'
import adminRoutes from './routes/admin.js'
import userRoutes from './routes/user.js' // Import new routes
import { checkAdmin, checkAuth } from './middleware/checkAuth.js'
import path from 'path'
import { fileURLToPath } from 'url'
import contentRouter from './routes/content.js'
import notificationRoutes from './routes/notifications.js';
import { startYouTubeWatcher } from './lib/youtubeWatcher.js'
import learnRoutes from './routes/learn.js';
import leaderboardRoutes from './routes/leaderboard.js';
import forumRoutes from './routes/forum.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Serve static files (uploads will be accessible here)
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
    res.send('Study Flow Backend Live!');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', checkAuth, checkAdmin, adminRoutes);
app.use('/api/user', checkAuth, userRoutes); // Register user routes (Protected)
app.use('/api', apiRoutes);
app.use('/api/content', contentRouter);
app.use('/api/notifications', checkAuth, notificationRoutes);
app.use('/api/learn', checkAuth, learnRoutes);
app.use('/api/leaderboard', checkAuth, leaderboardRoutes);
app.use('/api/forum', checkAuth, forumRoutes);

startYouTubeWatcher();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
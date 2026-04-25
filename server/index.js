require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { initSchema } = require('./db');

const authRoutes = require('./routes/auth');
const vocabularyRoutes = require('./routes/vocabulary');
const lessonRoutes = require('./routes/lessons');
const roadmapRoutes  = require('./routes/roadmap');
const progressRoutes = require('./routes/progress');
const resourcesRoutes = require('./routes/resources');
const generateRoutes  = require('./routes/generate');
const { seed } = require('./seed');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

const PORT = process.env.PORT || 3001;

// Middleware
const isProd = process.env.NODE_ENV === 'production';
app.use(cors(isProd ? {} : { origin: 'http://localhost:5173' }));
app.use(express.json());

// Serve built React app in production
if (isProd) {
  const distPath = path.join(__dirname, '../client/dist');
  app.use(express.static(distPath));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/roadmap',    roadmapRoutes);
app.use('/api/progress',   progressRoutes);
app.use('/api/resources',  resourcesRoutes);
app.use('/api/generate',   generateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all: serve React's index.html for any non-API route (production only)
if (isProd) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Socket.io — basic user room support
const jwt = require('jsonwebtoken');
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No token'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  socket.join(`user:${socket.user.id}`);
  console.log(`User ${socket.user.name} connected`);

  socket.on('disconnect', () => {
    console.log(`User ${socket.user.name} disconnected`);
  });
});

// Start
async function start() {
  try {
    await initSchema();
    const { pool } = require('./db');
    await seed(pool);
    server.listen(PORT, () => {
      console.log(`Language Learner server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

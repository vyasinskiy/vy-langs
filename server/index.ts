import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // ⬅️ новое
import { PrismaClient } from '@prisma/client';
import { wordRoutes } from './routes/words';
import { answerRoutes } from './routes/answers';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.BACKEND_PORT;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/words', wordRoutes);
app.use('/api/answers', answerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * Static files in production
 */
if (process.env.NODE_ENV === 'production') {
  const STATIC_DIR = path.resolve(process.cwd(), 'client');

  // раздача статических ассетов (js/css/img и т.п.)
  app.use(express.static(STATIC_DIR, {
    index: false,        // index.html отдадим сами ниже
    maxAge: '1d',        // можно увеличить при хэшированных именах файлов
    etag: true
  }));

  // SPA fallback — всё, что не /api/*, уходит на index.html
  app.get(/^\/(?!api)(.*)/, (req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
}

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma };

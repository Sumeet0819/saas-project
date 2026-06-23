import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import dailyLogRoutes from './routes/dailyLogRoutes';
import workerRoutes from './routes/workerRoutes';
import materialLogRoutes from './routes/materialLogRoutes';
import { requireAuth } from './middlewares/auth';

// Basic health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/daily-logs', dailyLogRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/material-logs', materialLogRoutes);

// Simple notification endpoint (protected)
app.post('/api/v1/notifications', requireAuth, (req: Request, res: Response) => {
  const { message, type, projectId } = req.body;
  // This endpoint can be expanded to trigger webhooks, push notifications, etc.
  console.log(`Notification [${type}] for project ${projectId}: ${message}`);
  res.status(200).json({ success: true, message: 'Notification sent successfully' });
});



app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

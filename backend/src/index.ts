import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
  console.log(`[REQUEST] ${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import dailyLogRoutes from './routes/dailyLogRoutes';
import workerRoutes from './routes/workerRoutes';
import materialLogRoutes from './routes/materialLogRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import deliveryRoutes from './routes/deliveryRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import materialMasterRoutes from './routes/materialMasterRoutes';
import materialInventoryRoutes from './routes/materialInventoryRoutes';
import materialRequestRoutes from './routes/materialRequestRoutes';
import siteActivityRoutes from './routes/siteActivityRoutes';
import siteIssueRoutes from './routes/siteIssueRoutes';
import sitePhotoRoutes from './routes/sitePhotoRoutes';
import supplierRoutes from './routes/supplierRoutes';
import organizationRoutes from './routes/organizationRoutes';
import userRoutes from './routes/userRoutes';
import { requireAuth } from './middlewares/auth';

// Basic health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/daily-logs', dailyLogRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/material-logs', materialLogRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/deliveries', deliveryRoutes);
app.use('/api/v1/equipment', equipmentRoutes);
app.use('/api/v1/material-master', materialMasterRoutes);
app.use('/api/v1/material-inventory', materialInventoryRoutes);
app.use('/api/v1/material-requests', materialRequestRoutes);
app.use('/api/v1/site-activities', siteActivityRoutes);
app.use('/api/v1/site-issues', siteIssueRoutes);
app.use('/api/v1/site-photos', sitePhotoRoutes);
app.use('/api/v1/suppliers', supplierRoutes);

// Simple notification endpoint (protected)
app.post('/api/v1/notifications', requireAuth, (req: Request, res: Response) => {
  const { message, type, projectId } = req.body;
  // This endpoint can be expanded to trigger webhooks, push notifications, etc.
  console.log(`Notification [${type}] for project ${projectId}: ${message}`);
  res.status(200).json({ success: true, message: 'Notification sent successfully' });
});

// Global Error Logger
import { NextFunction } from 'express';
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${new Date().toISOString()} | ${req.method} ${req.url}`);
  console.error(err.stack || err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

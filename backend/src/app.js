import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { ApiResponse } from './utils/ApiResponse.js';
import { ApiError } from './utils/AppError.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { timestamp: new Date().toISOString() }, 'System is running normally')
    );
});

// Auth Routes
app.use('/api/auth', authRoutes);
// Project Routes
app.use('/api/projects', projectRoutes);
// Task Routes
app.use('/api/tasks', taskRoutes);
// Dashboard Routes
app.use('/api/dashboard', dashboardRoutes);
// Notification Routes
app.use('/api/notifications', notificationRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
    next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

// Global Error Handler 
app.use(errorHandler);

export default app;
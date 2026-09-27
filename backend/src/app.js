import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { ApiResponse } from './utils/ApiResponse.js';
import { ApiError } from './utils/AppError.js';
import authRoutes from './routes/authRoutes.js';

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

// 404 Handler for undefined routes
app.use((req, res, next) => {
    next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

// Global Error Handler 
app.use(errorHandler);

export default app;
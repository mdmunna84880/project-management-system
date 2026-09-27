import { ApiError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
    let error = err;

    // Fallback for standard Error objects that aren't our custom ApiError
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode ? error.statusCode : 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        ...error,
        message: error.message,
        // Only send stack trace in development for security
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
    };

    return res.status(error.statusCode).json(response);
};
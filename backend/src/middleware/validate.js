import { ApiError } from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // Extract Zod error messages into a clean array
    const errors = (error.issues || []).map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    next(new ApiError(400, 'Validation failed', errors));
  }
};
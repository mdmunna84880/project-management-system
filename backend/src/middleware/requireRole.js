import { ApiError } from '../utils/AppError.js';

// This acts as a middleware factory
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is guaranteed to exist here because authenticate middleware runs first
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden: You do not have permission to perform this action');
    }
    next();
  };
};

export default requireRole;
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import { ApiError } from '../utils/AppError.js';
import env from '../config/env.js';

const authenticate = async (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, 'Unauthorized request: No token provided');
  }

  try {
    // Verify the token signature and expiration
    const decodedToken = jwt.verify(token, env.JWT_SECRET);

    // Find the user in the database
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, 'Unauthorized request: User no longer exists');
    }

    // Attach the user object to the Express request
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Unauthorized request: Invalid or expired token');
  }
};

export default authenticate;
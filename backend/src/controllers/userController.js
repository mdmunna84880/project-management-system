import User from '../models/Users.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, { users }, 'Users fetched successfully'));
};

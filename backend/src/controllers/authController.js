import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import { ApiError } from '../utils/AppError.js';
import env from '../config/env.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Helper to generate JWT and set cookie
const generateTokenAndSetCookie = (user, res) => {
    const token = jwt.sign(
        { _id: user._id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
    );

    const options = {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie('token', token, options);
    return token;
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, 'User with this email already exists');
    }

    // Force role to USER, ignoring anything the client might have tried to inject
    const user = await User.create({
        name,
        email,
        password,
        role: 'USER',
    });

    const createdUser = await User.findById(user._id)

    res.status(201).json(
        new ApiResponse(201, { user: createdUser }, 'User registered successfully. Please log in.')
    );
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    generateTokenAndSetCookie(user, res);

    const loggedInUser = await User.findById(user._id)

    res.status(200).json(
        new ApiResponse(200, { user: loggedInUser }, 'Login successful')
    );
};

export const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: new Date(0), // Instantly expire the cookie
    });

    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
};

export const getMe = async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { user: req.user }, 'Current user fetched successfully')
    );
};

export const updateProfile = async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
        throw new ApiError(400, 'Name must be at least 2 characters');
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name: name.trim() },
        { new: true, runValidators: true }
    );
    res.status(200).json(new ApiResponse(200, { user }, 'Profile updated successfully'));
};

export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
        throw new ApiError(400, 'Current password and a new password of at least 6 characters are required');
    }
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.isPasswordCorrect(currentPassword);
    if (!isMatch) {
        throw new ApiError(401, 'Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json(new ApiResponse(200, null, 'Password updated successfully'));
};
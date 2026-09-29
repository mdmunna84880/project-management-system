import User from '../models/Users.js';
import ProjectMember from '../models/ProjectMember.js';
import { ApiError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import notificationService from '../services/notificationService.js';

export const getMembers = async (req, res) => {
    // Populate fetches the associated User document so the frontend gets the name and email
    const members = await ProjectMember.find({ project: req.project._id })
        .populate('user', 'name email')
        .sort({ createdAt: 1 });

    res.status(200).json(new ApiResponse(200, { members }, 'Members fetched successfully'));
};

export const addMember = async (req, res) => {
    const { email } = req.body;

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
        throw new ApiError(404, 'User with this email not found in the system');
    }

    const existingMembership = await ProjectMember.findOne({
        project: req.project._id,
        user: userToAdd._id,
    });

    if (existingMembership) {
        throw new ApiError(409, 'User is already a member of this project');
    }

    // New users are always added as regular members
    const membership = await ProjectMember.create({
        project: req.project._id,
        user: userToAdd._id,
        role: 'MEMBER',
    });

    await notificationService.createNotification({
        user: userToAdd._id,
        type: 'MEMBER_ADDED',
        message: `You have been added to the project "${req.project.name}".`,
        relatedProject: req.project._id,
    });

    res.status(201).json(new ApiResponse(201, { membership }, 'Member added successfully'));
};

export const removeMember = async (req, res) => {
    const { userId } = req.params;

    const membership = await ProjectMember.findOne({
        project: req.project._id,
        user: userId,
    });

    if (!membership) {
        throw new ApiError(404, 'Member not found in this project');
    }

    if (membership.role === 'OWNER') {
        throw new ApiError(403, 'Forbidden: Cannot remove the project owner');
    }

    await ProjectMember.findByIdAndDelete(membership._id);

    res.status(200).json(new ApiResponse(200, null, 'Member removed successfully'));
};
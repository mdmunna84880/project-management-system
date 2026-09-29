import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createProject = async (req, res) => {
    const { name, description, status, priority, startDate, dueDate } = req.body;

    // Create the project
    const project = await Project.create({
        name,
        description,
        status,
        priority,
        startDate,
        dueDate,
        owner: req.user._id,
    });

    // Add the creator as the OWNER in the ProjectMember collection
    await ProjectMember.create({
        project: project._id,
        user: req.user._id,
        role: 'OWNER',
    });

    res.status(201).json(new ApiResponse(201, { project }, 'Project created successfully'));
};

export const getProjects = async (req, res) => {
    const includeArchived = req.query.includeArchived === 'true';
    const statusFilter = includeArchived ? {} : { status: { $ne: 'ARCHIVED' } };

    let projects;

    if (req.user.role === 'ADMIN') {
        projects = await Project.find(statusFilter).sort({ createdAt: -1 });
    } else {
        const memberships = await ProjectMember.find({ user: req.user._id });
        const projectIds = memberships.map((m) => m.project);

        projects = await Project.find({ _id: { $in: projectIds }, ...statusFilter }).sort({ createdAt: -1 });
    }

    res.status(200).json(new ApiResponse(200, { projects }, 'Projects fetched successfully'));
};

export const getProjectById = async (req, res) => {
    // requireProjectAccess middleware already fetched the project!
    res.status(200).json(new ApiResponse(200, { project: req.project }, 'Project fetched successfully'));
};

export const updateProject = async (req, res) => {
    const updatedProject = await Project.findByIdAndUpdate(
        req.project._id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200, { project: updatedProject }, 'Project updated successfully'));
};

export const archiveProject = async (req, res) => {
    const project = await Project.findByIdAndUpdate(
        req.project._id,
        { status: 'ARCHIVED' },
        { new: true }
    );

    res.status(200).json(new ApiResponse(200, { project }, 'Project archived successfully'));
};

export const deleteProject = async (req, res) => {
    // Delete the project
    await Project.findByIdAndDelete(req.project._id);

    // Cleanup memberships associated with this project
    await ProjectMember.deleteMany({ project: req.project._id });

    res.status(200).json(new ApiResponse(200, null, 'Project deleted successfully'));
};
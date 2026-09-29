import ProjectMember from '../models/ProjectMember.js';
import Project from '../models/Project.js';
import {ApiError} from '../utils/AppError.js';


const requireProjectAccess = (requiredRole = 'MEMBER') => {
  return async (req, res, next) => {
    // Determine project ID depending on the route params
    const projectId = req.params.id || req.body.projectId;

    if (!projectId) {
      throw new ApiError(400, 'Project ID is required for this operation');
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    // Admins can see and do everything
    if (req.user.role === 'ADMIN') {
      req.project = project;
      req.membership = { role: 'OWNER' };
      return next();
    }

    // Check project membership for normal users
    const membership = await ProjectMember.findOne({
      project: projectId,
      user: req.user._id,
    });

    // 404 instead of 403 to avoid leaking the existence of a private project
    if (!membership) {
      throw new ApiError(404, 'Project not found');
    }

    // If a specific role is required
    if (requiredRole === 'OWNER' && membership.role !== 'OWNER') {
      throw new ApiError(403, 'Forbidden: You must be the project owner to perform this action');
    }

    // Attach data for the controller to use
    req.project = project;
    req.membership = membership;
    next();
  }
};

export default requireProjectAccess;
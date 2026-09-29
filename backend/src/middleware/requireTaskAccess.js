import Task from '../models/Task.js';
import ProjectMember from '../models/ProjectMember.js';
import { ApiError } from '../utils/AppError.js';


const requireTaskAccess = async (req, res, next) => {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
        throw new ApiError(404, 'Task not found');
    }

    if (req.user.role === 'ADMIN') {
        req.task = task;
        return next();
    }

    // Verify the user is a member of the project this task belongs to
    const membership = await ProjectMember.findOne({
        project: task.project,
        user: req.user._id,
    });

    if (!membership) {
        throw new ApiError(404, 'Task not found'); // 404 to avoid leaking existence
    }

    req.task = task;
    next();
};

export default requireTaskAccess;
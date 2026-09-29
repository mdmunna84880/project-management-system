import Task from '../models/Task.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Project from '../models/Project.js';
import { getFilteredTasks, getAllTasksService, getMyTasksService } from '../services/taskService.js';
import notificationService from '../services/notificationService.js';

const notifyUsers = async (task, projectOrId, currentUser, type, message) => {
    const usersToNotify = new Set();
    
    // Determine project owner
    let ownerId = null;
    let projectId = null;
    if (projectOrId && projectOrId.owner) {
        ownerId = projectOrId.owner.toString();
        projectId = projectOrId._id;
    } else {
        const projectIdToFetch = projectOrId?._id || projectOrId || task.project;
        const project = await Project.findById(projectIdToFetch).select('owner _id');
        if (project) {
            ownerId = project.owner.toString();
            projectId = project._id;
        }
    }

    // Notify project owner if they didn't do the action
    if (ownerId && ownerId !== currentUser._id.toString()) {
        usersToNotify.add(ownerId);
    }
    
    // Notify assignee if they didn't do the action
    if (task.assignedTo) {
        const assigneeId = task.assignedTo._id ? task.assignedTo._id.toString() : task.assignedTo.toString();
        if (assigneeId !== currentUser._id.toString()) {
            usersToNotify.add(assigneeId);
        }
    }

    for (const userId of usersToNotify) {
        await notificationService.createNotification({
            user: userId,
            type,
            message,
            relatedProject: projectId,
            relatedTask: task._id,
        });
    }
};

const createTask = async (req, res) => {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    const task = await Task.create({
        title,
        description,
        project: req.project._id,
        assignedTo: assignedTo || null,
        status,
        priority,
        dueDate,
    });

    if (assignedTo) {
        await notifyUsers(task, req.project, req.user, 'TASK_ASSIGNED', `You have been assigned a new task: "${task.title}".`);
    } else {
        await notifyUsers(task, req.project, req.user, 'TASK_CREATED', `A new task was created in your project: "${task.title}".`);
    }

    res.status(201).json(new ApiResponse(201, { task }, 'Task created successfully'));
};

const getTasks = async (req, res) => {
    const result = await getFilteredTasks(req.project._id, req.query);

    res.status(200).json(new ApiResponse(200, { tasks: result.tasks, pagination: result.pagination }, 'Tasks fetched successfully'));
};

const getTaskById = async (req, res) => {
    await req.task.populate('assignedTo', 'name email');
    res.status(200).json(new ApiResponse(200, { task: req.task }, 'Task fetched successfully'));
};

const updateTask = async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(
        req.task._id,
        req.body,
        { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (req.body.status && req.body.status !== req.task.status) {
        await notifyUsers(updatedTask, req.task.project, req.user, 'TASK_STATUS_CHANGED', `Task "${updatedTask.title}" status changed to ${req.body.status}.`);
    } else {
        await notifyUsers(updatedTask, req.task.project, req.user, 'TASK_UPDATED', `Task "${updatedTask.title}" was updated.`);
    }

    res.status(200).json(new ApiResponse(200, { task: updatedTask }, 'Task updated successfully'));
};

// Dedicated fast endpoint for Optimistic UI updates
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;

    req.task.status = status;
    await req.task.save();

    if (status === 'COMPLETED') {
        await notifyUsers(req.task, req.task.project, req.user, 'TASK_COMPLETED', `Task "${req.task.title}" has been marked as completed.`);
    } else {
        await notifyUsers(req.task, req.task.project, req.user, 'TASK_STATUS_CHANGED', `Task "${req.task.title}" status changed to ${status}.`);
    }

    res.status(200).json(new ApiResponse(200, { task: req.task }, 'Task status updated'));
};

const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.task._id);
    await notifyUsers(req.task, req.task.project, req.user, 'TASK_DELETED', `Task "${req.task.title}" was deleted.`);
    res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully'));
};

export {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getAllTasks,
    getMyTasks,
};

// Admin: GET /api/tasks — all tasks across all projects
async function getAllTasks(req, res) {
    const result = await getAllTasksService(req.query);
    res.status(200).json(new ApiResponse(200, { tasks: result.tasks, pagination: result.pagination }, 'All tasks fetched'));
}

// User: GET /api/tasks/my — tasks assigned to the logged-in user across their projects
async function getMyTasks(req, res) {
    const result = await getMyTasksService(req.user._id, req.query);
    res.status(200).json(new ApiResponse(200, { tasks: result.tasks, pagination: result.pagination }, 'My tasks fetched'));
}
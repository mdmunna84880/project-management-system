import Task from '../models/Task.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getFilteredTasks } from '../services/taskService.js';
import notificationService from '../services/notificationService.js';


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
        await notificationService.createNotification({
            user: assignedTo,
            type: 'TASK_ASSIGNED',
            message: `You have been assigned a new task: "${task.title}".`,
            relatedProject: req.project._id,
            relatedTask: task._id,
        });
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

    if (req.body.status === 'COMPLETED' && req.task.assignedTo) {
        await notificationService.createNotification({
            user: req.task.assignedTo,
            type: 'TASK_COMPLETED',
            message: `Task "${req.task.title}" has been marked as completed.`,
            relatedProject: req.task.project,
            relatedTask: req.task._id,
        });
    }

    res.status(200).json(new ApiResponse(200, { task: updatedTask }, 'Task updated successfully'));
};

// Dedicated fast endpoint for Optimistic UI updates
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;

    req.task.status = status;
    await req.task.save();

    if (status === 'COMPLETED' && req.task.assignedTo) {
        await notificationService.createNotification({
            user: req.task.assignedTo,
            type: 'TASK_COMPLETED',
            message: `Task "${req.task.title}" has been marked as completed.`,
            relatedProject: req.task.project,
            relatedTask: req.task._id,
        });
    }

    res.status(200).json(new ApiResponse(200, { task: req.task }, 'Task status updated'));
};

const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.task._id);
    res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully'));
};

export {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask,
};
import Task from '../models/Task.js';
import { ApiResponse } from '../utils/ApiResponse.js';



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

    res.status(201).json(new ApiResponse(201, { task }, 'Task created successfully'));
};

const getTasks = async (req, res) => {
    const tasks = await Task.find({ project: req.project._id })
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, { tasks }, 'Tasks fetched successfully'));
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

    res.status(200).json(new ApiResponse(200, { task: updatedTask }, 'Task updated successfully'));
};

// Dedicated fast endpoint for Optimistic UI updates
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;

    req.task.status = status;
    await req.task.save();

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
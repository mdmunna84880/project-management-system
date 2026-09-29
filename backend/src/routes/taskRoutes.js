import express from 'express';
import {
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getAllTasks,
    getMyTasks,
} from '../controllers/taskController.js';
import { validate } from '../middleware/validate.js';
import { updateTaskSchema, updateStatusSchema } from '../validators/taskValidator.js';
import authenticate from '../middleware/authenticate.js';
import requireTaskAccess from '../middleware/requireTaskAccess.js';
import requireRole from '../middleware/requireRole.js';


const router = express.Router();

router.use(authenticate);

// Admin: GET /api/tasks — cross-project all tasks view
router.get('/', requireRole('ADMIN'), getAllTasks);

// Authenticated user: GET /api/tasks/my — tasks assigned to me across all my projects
router.get('/my', getMyTasks);

router.get('/:id', requireTaskAccess, getTaskById);
router.patch('/:id', requireTaskAccess, validate(updateTaskSchema), updateTask);
router.patch('/:id/status', requireTaskAccess, validate(updateStatusSchema), updateTaskStatus);
router.delete('/:id', requireTaskAccess, deleteTask);

export default router;
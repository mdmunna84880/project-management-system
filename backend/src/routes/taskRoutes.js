import express from 'express';
import {
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask,
} from '../controllers/taskController.js';
import { validate } from '../middleware/validate.js';
import { updateTaskSchema, updateStatusSchema } from '../validators/taskValidator.js';
import authenticate from '../middleware/authenticate.js';
import requireTaskAccess from '../middleware/requireTaskAccess.js';


const router = express.Router();

router.use(authenticate);

router.get('/:id', requireTaskAccess, getTaskById);
router.patch('/:id', requireTaskAccess, validate(updateTaskSchema), updateTask);
router.patch('/:id/status', requireTaskAccess, validate(updateStatusSchema), updateTaskStatus);
router.delete('/:id', requireTaskAccess, deleteTask);

export default router;
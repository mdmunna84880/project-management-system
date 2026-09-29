import { Router } from 'express';
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    archiveProject,
    deleteProject,
} from '../controllers/projectController.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../validators/projectValidator.js';
import authenticate from '../middleware/authenticate.js';
import requireProjectAccess from '../middleware/requireProjectAccess.js';
import { getMembers, addMember, removeMember } from '../controllers/memberController.js';
import { addMemberSchema } from '../validators/memberValidator.js';
import { createTask, getTasks } from '../controllers/taskController.js';
import { createTaskSchema } from '../validators/taskValidator.js'

const router = Router();

// All project routes require authentication
router.use(authenticate);

router.post('/', validate(createProjectSchema), createProject);
router.get('/', getProjects);

// The following routes require specific project access
router.get('/:id', requireProjectAccess('MEMBER'), getProjectById);
router.patch('/:id', requireProjectAccess('OWNER'), validate(updateProjectSchema), updateProject);
router.patch('/:id/archive', requireProjectAccess('OWNER'), archiveProject);
router.delete('/:id', requireProjectAccess('OWNER'), deleteProject);
router.post('/:id/tasks', requireProjectAccess('MEMBER'), validate(createTaskSchema), createTask);
router.get('/:id/tasks', requireProjectAccess('MEMBER'), getTasks);

// Member management routes
router.get('/:id/members', requireProjectAccess('MEMBER'), getMembers);
router.post('/:id/members', requireProjectAccess('OWNER'), validate(addMemberSchema), addMember);
router.delete('/:id/members/:userId', requireProjectAccess('OWNER'), removeMember);

export default router;
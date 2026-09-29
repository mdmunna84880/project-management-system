import { Router } from 'express';
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    archiveProject,
    deleteProject,
} from '../controllers/projectController.js';
import {validate} from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../validators/projectValidator.js';
import authenticate from '../middleware/authenticate.js';
import requireProjectAccess from '../middleware/requireProjectAccess.js';

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

export default router;
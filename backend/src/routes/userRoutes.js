import { Router } from 'express';
import { getAllUsers } from '../controllers/userController.js';
import authenticate from '../middleware/authenticate.js';
import requireRole from '../middleware/requireRole.js';

const router = Router();

router.use(authenticate);

// Admin only — view all registered users
router.get('/', requireRole('ADMIN'), getAllUsers);

export default router;

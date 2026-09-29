import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/', getDashboardStats);

export default router;
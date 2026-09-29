import { Router } from 'express';
import { register, login, logout, getMe, updateProfile, updatePassword } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.patch('/me/update', authenticate, updateProfile);
router.patch('/me/password', authenticate, updatePassword);

export default router;
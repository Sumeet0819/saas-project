import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { requireAuth, authorizeRoles } from '../middlewares/auth';

const router = Router();

// Public route for login
router.post('/login', login);

// Protected route: only Admin or Project Manager can register new users
router.post('/register', requireAuth, authorizeRoles('Admin', 'Project Manager'), register);

export default router;

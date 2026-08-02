import { Router } from 'express';
import { getAdminDashboard, banUser, unbanUser } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', authMiddleware, getAdminDashboard);
router.post('/ban', authMiddleware, banUser);
router.post('/unban', authMiddleware, unbanUser);

export default router;

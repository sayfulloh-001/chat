import { Router } from 'express';
import { getStories, createStory, reportUser } from '../controllers/social.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stories', getStories);
router.post('/stories', authMiddleware, createStory);
router.post('/report', authMiddleware, reportUser);

export default router;

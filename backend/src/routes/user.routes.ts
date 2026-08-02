import { Router } from 'express';
import { updateProfile, buyCoins, sendGift, getLeaderboard } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.put('/profile', authMiddleware, updateProfile);
router.post('/coins/buy', authMiddleware, buyCoins);
router.post('/gifts/send', authMiddleware, sendGift);
router.get('/leaderboard', getLeaderboard);

export default router;

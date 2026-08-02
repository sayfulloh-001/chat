import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { name, bio, country, gender, language, interests, avatarUrl } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        country,
        gender,
        language,
        interests,
        avatarUrl,
      },
    });

    res.status(200).json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

export const buyCoins = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { amount } = req.body; // e.g. 500, 1500, 5000

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        coins: { increment: amount || 500 },
      },
    });

    res.status(200).json({ success: true, coins: user.coins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add coins' });
  }
};

export const sendGift = async (req: Request, res: Response): Promise<void> => {
  try {
    const senderId = (req as any).user.userId;
    const { receiverId, giftName, giftIcon, coinValue } = req.body;

    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    if (!sender || sender.coins < coinValue) {
      res.status(400).json({ success: false, message: 'Insufficient coin balance' });
      return;
    }

    // Deduct coins from sender and create transaction record
    await prisma.$transaction([
      prisma.user.update({
        where: { id: senderId },
        data: { coins: { decrement: coinValue } },
      }),
      prisma.user.update({
        where: { id: receiverId },
        data: { coins: { increment: coinValue } },
      }),
      prisma.giftTransaction.create({
        data: {
          senderId,
          receiverId,
          giftName,
          giftIcon,
          coinValue,
        },
      }),
    ]);

    res.status(200).json({ success: true, message: 'Gift sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send gift' });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const topUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { coins: 'desc' },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        country: true,
        coins: true,
        level: true,
        isVerified: true,
        isPremium: true,
      },
    });

    res.status(200).json({ success: true, leaderboard: topUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
};

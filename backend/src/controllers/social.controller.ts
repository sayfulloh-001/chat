import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const stories = await prisma.story.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stories' });
  }
};

export const createStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { mediaUrl, mediaType, caption } = req.body;

    const newStory = await prisma.story.create({
      data: {
        userId,
        mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        mediaType: mediaType || 'IMAGE',
        caption: caption || '✨ NovaChat Moments',
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      },
    });

    res.status(201).json({ success: true, story: newStory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to post story' });
  }
};

export const reportUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const reporterId = (req as any).user.userId;
    const { reportedUserId, reason, details } = req.body;

    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason: reason || 'Inappropriate behavior',
        details: details || 'User reported during live video session.',
      },
    });

    res.status(201).json({ success: true, message: 'Report submitted to moderators', reportId: report.id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to file report' });
  }
};

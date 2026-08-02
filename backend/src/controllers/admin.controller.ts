import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { matchmakingService } from '../services/matchmaking.service';

const prisma = new PrismaClient();

export const getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const bannedUsers = await prisma.user.count({ where: { isBanned: true } });
    const totalReports = await prisma.report.count({ where: { status: 'PENDING' } });

    const recentReports = await prisma.report.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { name: true, username: true } },
        reportedUser: { select: { id: true, name: true, username: true, isBanned: true } },
      },
    });

    const activeRooms = matchmakingService.getActiveRoomsList();
    const stats = matchmakingService.getStats();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        onlineUsers: stats.totalOnline,
        activeVideoSessions: stats.activeMatches,
        queueLength: stats.queueLength,
        pendingReports: totalReports,
        bannedUsersCount: bannedUsers,
        revenueMonthlyUSD: 14850.0,
      },
      reports: recentReports,
      activeSessions: activeRooms,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load admin stats' });
  }
};

export const banUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, reason } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: true,
        banReason: reason || 'Banned by Admin for Terms Violation',
      },
    });

    res.status(200).json({ success: true, message: `User ${user.username} has been banned.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to ban user' });
  }
};

export const unbanUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: false,
        banReason: null,
      },
    });

    res.status(200).json({ success: true, message: `User ${user.username} unbanned.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to unban user' });
  }
};

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'novachat_super_secret_jwt_key_2026';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, username, gender, country, countryCode, interests } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ success: false, message: 'Email, password and name are required.' });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: username || email.split('@')[0] }],
      },
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email or Username already registered.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username: username || `${email.split('@')[0]}_${Math.floor(Math.random() * 1000)}`,
        passwordHash,
        name,
        gender: gender || 'All',
        country: country || 'United States',
        countryCode: countryCode || 'US',
        interests: interests || 'Music, Travel, Tech',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        coins: user.coins,
        level: user.level,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (user.isBanned) {
      res.status(403).json({ success: false, message: `Account banned: ${user.banReason || 'Policy Violation'}` });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        country: user.country,
        gender: user.gender,
        coins: user.coins,
        level: user.level,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        country: user.country,
        countryCode: user.countryCode,
        gender: user.gender,
        language: user.language,
        interests: user.interests,
        bio: user.bio,
        coins: user.coins,
        level: user.level,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
};

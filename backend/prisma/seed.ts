import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding NovaChat production database...');

  // Clean existing data
  await prisma.story.deleteMany();
  await prisma.giftTransaction.deleteMany();
  await prisma.report.deleteMany();
  await prisma.matchHistory.deleteMany();
  await prisma.message.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@novachat.live',
      username: 'admin',
      name: 'Nova Admin',
      passwordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      country: 'United States',
      countryCode: 'US',
      gender: 'Male',
      age: 28,
      language: 'English',
      interests: 'Technology, AI, Gaming',
      bio: 'Official Admin of NovaChat Platform.',
      coins: 99999,
      level: 50,
      isVerified: true,
      isPremium: true,
    },
  });

  // Create Sample Users
  const user1 = await prisma.user.create({
    data: {
      email: 'alex@novachat.live',
      username: 'alex_superstar',
      name: 'Alex Rivera',
      passwordHash,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      country: 'Spain',
      countryCode: 'ES',
      gender: 'Male',
      age: 23,
      language: 'Spanish',
      interests: 'Music, Travel, Photography',
      bio: 'Musician traveling the world 🎸',
      coins: 1250,
      level: 12,
      isVerified: true,
      isPremium: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'sophia@novachat.live',
      username: 'sophia_vibe',
      name: 'Sophia Chen',
      passwordHash,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      country: 'Japan',
      countryCode: 'JP',
      gender: 'Female',
      age: 21,
      language: 'Japanese',
      interests: 'Anime, Fashion, Art',
      bio: 'Living in Tokyo 🌸 Let us chat!',
      coins: 4500,
      level: 24,
      isVerified: true,
      isPremium: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'malika@novachat.live',
      username: 'malika_uzb',
      name: 'Malika Alimova',
      passwordHash,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      country: 'Uzbekistan',
      countryCode: 'UZ',
      gender: 'Female',
      age: 20,
      language: 'Uzbek',
      interests: 'Coding, UI Design, Books',
      bio: 'Tashkent tech innovator 💻✨',
      coins: 890,
      level: 8,
      isVerified: true,
      isPremium: false,
    },
  });

  // Seed Stories
  await prisma.story.createMany({
    data: [
      {
        userId: user1.id,
        mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        caption: 'Sunset in Barcelona 🌅',
        likes: 142,
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      },
      {
        userId: user2.id,
        mediaUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
        caption: 'Tokyo Night Vibes ✨',
        likes: 389,
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      },
    ],
  });

  // Seed Reports for Admin Panel
  await prisma.report.create({
    data: {
      reporterId: user2.id,
      reportedUserId: user1.id,
      reason: 'Inappropriate language in chat',
      details: 'Automated AI flag triggered profanity limit',
      status: 'PENDING',
    },
  });

  // Seed Match History
  await prisma.matchHistory.create({
    data: {
      user1Id: user1.id,
      user2Id: user2.id,
      duration: 240,
      user1Name: user1.name,
      user2Name: user2.name,
    },
  });

  console.log('✅ Database seeded successfully with NovaChat admin & demo profiles.');
}

main()
  .catch((e) => {
    console.error('Error seeding DB:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

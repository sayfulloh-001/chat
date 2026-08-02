export type UserRole = 'ADMIN' | 'MODERATOR' | 'USER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: {
    posts: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featuredImage?: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'PDF';
  price: number;
  isPremium: boolean;
  views: number;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    bio?: string;
  };
  category?: Category;
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  uploadedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalOrders: number;
  totalMedia: number;
  totalRevenue: number;
}

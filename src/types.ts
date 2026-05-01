/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  signature?: string;
  role: UserRole;
  createdAt: number;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
}

export interface Topic {
  id: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  viewCount: number;
  replyCount: number;
  isPinned: boolean;
  isLocked: boolean;
}

export interface Post {
  id: string;
  topicId: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reply' | 'system';
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: number;
}

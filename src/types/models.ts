/**
 * Domain Models
 *
 * Core type definitions for TipForge entities.
 */

/**
 * User/Fan entity
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'fan' | 'creator' | 'admin';
  verified: boolean;
  avatar?: string | null;
  createdAt: string;
  updatedAt?: string;
}

/**
 * User profile response
 */
export interface UserProfile extends User {
  stats?: {
    totalTipsSent: number;
    totalSpent: number;
    creatorsSupported: number;
  };
}

/**
 * User update request
 */
export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
}

/**
 * Creator entity
 */
export interface Creator {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatar: string | null;
  verified: boolean;
  isPublic: boolean;
  totalEarnings: number;
  pendingBalance: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Creator with user information
 */
export interface CreatorWithUser extends Creator {
  user: User;
}

/**
 * Creator profile response
 */
export interface CreatorProfile extends Creator {
  stats?: {
    totalTips: number;
    averageTip: number;
    lastTipDate: string | null;
  };
}

/**
 * Creator create request
 */
export interface CreateCreatorRequest {
  username: string;
  displayName?: string;
  bio?: string;
}

/**
 * Creator update request
 */
export interface UpdateCreatorRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
  isPublic?: boolean;
}

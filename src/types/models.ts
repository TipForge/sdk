/**
 * Domain Models
 *
 * Core type definitions for TipForge entities.
 */

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

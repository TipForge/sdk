/**
 * Response Normalizers
 *
 * Ensures consistent data structure across SDK responses.
 */

import {
  Creator,
  CreatorProfile,
  Transaction,
  TransactionHistory,
  User,
  Wallet,
} from '../types/models';

/**
 * Normalize creator profile
 * Ensures all optional fields have defaults
 */
export function normalizeCreatorProfile(creator: Creator): CreatorProfile {
  return {
    ...creator,
    displayName: creator.displayName ?? '',
    bio: creator.bio ?? '',
    avatar: creator.avatar ?? null,
    stats: {
      totalTips: 0,
      averageTip: 0,
      lastTipDate: null,
    },
  };
}

/**
 * Normalize creator from raw API response
 * Handles missing or malformed fields
 */
export function normalizeCreator(data: any): Creator {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid creator data');
  }

  return {
    id: String(data.id),
    userId: String(data.userId),
    username: String(data.username || ''),
    displayName: data.displayName ? String(data.displayName) : null,
    bio: data.bio ? String(data.bio) : null,
    avatar: data.avatar ? String(data.avatar) : null,
    verified: Boolean(data.verified),
    isPublic: data.isPublic !== false,
    totalEarnings: Number(data.totalEarnings || 0),
    pendingBalance: Number(data.pendingBalance || 0),
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: data.updatedAt ? String(data.updatedAt) : new Date().toISOString(),
  };
}

/**
 * Normalize array of creators
 */
export function normalizeCreators(data: any[]): Creator[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(normalizeCreator);
}

/**
 * Normalize user from raw API response
 */
export function normalizeUser(data: any): User {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid user data');
  }

  return {
    id: String(data.id),
    email: String(data.email || ''),
    name: data.name ? String(data.name) : null,
    role: (data.role || 'fan') as 'fan' | 'creator' | 'admin',
    verified: Boolean(data.verified),
    avatar: data.avatar ? String(data.avatar) : null,
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: data.updatedAt ? String(data.updatedAt) : new Date().toISOString(),
  };
}

/**
 * Normalize wallet from raw API response
 */
export function normalizeWallet(data: any): Wallet {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid wallet data');
  }

  return {
    id: String(data.id),
    userId: String(data.userId),
    publicKey: String(data.publicKey || ''),
    name: data.name ? String(data.name) : null,
    verified: Boolean(data.verified),
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: data.updatedAt ? String(data.updatedAt) : new Date().toISOString(),
  };
}

/**
 * Normalize array of wallets
 */
export function normalizeWallets(data: any[]): Wallet[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(normalizeWallet);
}

/**
 * Normalize transaction from raw API response
 */
export function normalizeTransaction(data: any): Transaction {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid transaction data');
  }

  const status = (data.stellarStatus || data.status || 'pending') as
    | 'pending'
    | 'confirmed'
    | 'failed';

  return {
    id: String(data.id),
    fromUserId: String(data.fromUserId),
    creatorId: String(data.creatorId),
    amount: Number(data.amount || 0),
    message: data.message ? String(data.message) : null,
    status,
    stellarTxHash: data.stellarTxHash ? String(data.stellarTxHash) : null,
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: data.updatedAt ? String(data.updatedAt) : new Date().toISOString(),
  };
}

/**
 * Normalize array of transactions
 */
export function normalizeTransactions(data: any[]): Transaction[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(normalizeTransaction);
}

/**
 * Normalize transaction history response
 */
export function normalizeTransactionHistory(data: any): TransactionHistory {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid transaction history');
  }

  return {
    transactions: normalizeTransactions(data.transactions || []),
    total: Number(data.total || 0),
    page: Number(data.page || 1),
    pageSize: Number(data.pageSize || 20),
  };
}

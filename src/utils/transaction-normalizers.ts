/**
 * Transaction History Normalizers
 *
 * Specialized normalization for transaction history responses.
 */

import {
  Transaction,
  TransactionHistory,
  TransactionStats,
  TransactionWithDetails,
} from '../types/models';
import { normalizeTransaction, normalizeTransactions } from './normalizers';

/**
 * Normalize transaction history with pagination metadata
 */
export function normalizeTransactionHistoryResponse(data: any): TransactionHistory {
  if (!data || typeof data !== 'object') {
    return {
      transactions: [],
      total: 0,
      page: 1,
      pageSize: 20,
    };
  }

  const transactions = Array.isArray(data.transactions)
    ? normalizeTransactions(data.transactions)
    : [];

  return {
    transactions,
    total: Number(data.total || transactions.length),
    page: Number(data.page || 1),
    pageSize: Number(data.pageSize || 20),
  };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMetadata(total: number, page: number, pageSize: number) {
  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
    currentPage: page,
    pageSize,
  };
}

/**
 * Normalize transaction with details (user + creator info)
 */
export function normalizeTransactionWithDetails(data: any): TransactionWithDetails {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid transaction details');
  }

  return {
    ...normalizeTransaction(data),
    fromUser: data.fromUser || {},
    creator: data.creator || {},
  };
}

/**
 * Normalize array of transactions with details
 */
export function normalizeTransactionsWithDetails(data: any[]): TransactionWithDetails[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(normalizeTransactionWithDetails);
}

/**
 * Calculate transaction statistics from transaction array
 */
export function calculateTransactionStats(transactions: Transaction[]): TransactionStats {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalAmount: 0,
      averageAmount: 0,
      lastTransactionDate: null,
    };
  }

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const averageAmount = totalAmount / transactions.length;

  // Sort by date to find last transaction
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    totalTransactions: transactions.length,
    totalAmount,
    averageAmount: Math.round(averageAmount * 100) / 100,
    lastTransactionDate: sorted[0]?.createdAt || null,
  };
}

/**
 * Filter transactions by status
 */
export function filterTransactionsByStatus(
  transactions: Transaction[],
  status: 'pending' | 'confirmed' | 'failed'
): Transaction[] {
  if (!Array.isArray(transactions)) {
    return [];
  }
  return transactions.filter((tx) => tx.status === status);
}

/**
 * Filter transactions by date range
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  if (!Array.isArray(transactions)) {
    return [];
  }

  const start = startDate.getTime();
  const end = endDate.getTime();

  return transactions.filter((tx) => {
    const txTime = new Date(tx.createdAt).getTime();
    return txTime >= start && txTime <= end;
  });
}

/**
 * Group transactions by creator
 */
export function groupTransactionsByCreator(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  if (!Array.isArray(transactions)) {
    return {};
  }

  return transactions.reduce(
    (acc, tx) => {
      const creatorId = tx.creatorId;
      if (!acc[creatorId]) {
        acc[creatorId] = [];
      }
      acc[creatorId].push(tx);
      return acc;
    },
    {} as Record<string, Transaction[]>
  );
}

/**
 * Enrich transaction history with computed fields
 */
export function enrichTransactionHistory(
  history: TransactionHistory
): TransactionHistory & { stats: TransactionStats; pagination: any } {
  const stats = calculateTransactionStats(history.transactions);
  const pagination = calculatePaginationMetadata(history.total, history.page, history.pageSize);

  return {
    ...history,
    stats,
    pagination,
  };
}

/**
 * Response Mappers
 *
 * Transforms backend responses into SDK models.
 */

import { Creator, User, Transaction, Wallet, TransactionHistory } from '../types/models';

/**
 * Creator mapper
 */
export class CreatorMapper {
  /**
   * Map backend creator response to SDK model
   */
  static fromApi(data: any): Creator {
    return {
      id: data.id,
      userId: data.userId,
      username: data.username,
      displayName: data.displayName || null,
      bio: data.bio || null,
      avatar: data.avatar || null,
      verified: data.verified || false,
      isPublic: data.isPublic !== false,
      totalEarnings: data.totalEarnings || 0,
      pendingBalance: data.pendingBalance || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  /**
   * Map array of creators
   */
  static fromApiArray(data: any[]): Creator[] {
    return data.map((item) => this.fromApi(item));
  }
}

/**
 * User mapper
 */
export class UserMapper {
  /**
   * Map backend user response to SDK model
   */
  static fromApi(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name || null,
      role: data.role || 'fan',
      verified: data.verified || false,
      avatar: data.avatar || null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

/**
 * Transaction mapper
 */
export class TransactionMapper {
  /**
   * Map backend transaction response to SDK model
   */
  static fromApi(data: any): Transaction {
    return {
      id: data.id,
      fromUserId: data.fromUserId,
      creatorId: data.creatorId,
      amount: data.amount,
      message: data.message || null,
      status: data.stellarStatus || data.status || 'pending',
      stellarTxHash: data.stellarTxHash || null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  /**
   * Map array of transactions
   */
  static fromApiArray(data: any[]): Transaction[] {
    return data.map((item) => this.fromApi(item));
  }

  /**
   * Map transaction history response
   */
  static mapHistory(data: any): TransactionHistory {
    return {
      transactions: this.fromApiArray(data.transactions || []),
      total: data.total || 0,
      page: data.page || 1,
      pageSize: data.pageSize || 20,
    };
  }
}

/**
 * Wallet mapper
 */
export class WalletMapper {
  /**
   * Map backend wallet response to SDK model
   */
  static fromApi(data: any): Wallet {
    return {
      id: data.id,
      userId: data.userId,
      publicKey: data.publicKey,
      name: data.name || null,
      verified: data.verified || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  /**
   * Map array of wallets
   */
  static fromApiArray(data: any[]): Wallet[] {
    return data.map((item) => this.fromApi(item));
  }
}

/**
 * Universal mapper
 */
export class ResponseMapper {
  /**
   * Map response based on type
   */
  static mapResponse<T>(data: any, type: string): T {
    switch (type) {
      case 'creator':
        return CreatorMapper.fromApi(data) as T;
      case 'user':
        return UserMapper.fromApi(data) as T;
      case 'transaction':
        return TransactionMapper.fromApi(data) as T;
      case 'wallet':
        return WalletMapper.fromApi(data) as T;
      default:
        return data as T;
    }
  }
}

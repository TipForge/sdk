import { TransactionResponse } from '../types';

/**
 * TransactionUtils
 *
 * Utilities for working with transaction data on the client side.
 * Formatting, status checks, etc.
 */
export class TransactionUtils {
  /**
   * Check if a transaction is confirmed on Stellar
   */
  static isConfirmed(transaction: TransactionResponse): boolean {
    return transaction.stellarStatus === 'confirmed' && !!transaction.confirmedAt;
  }

  /**
   * Check if a transaction is pending
   */
  static isPending(transaction: TransactionResponse): boolean {
    return transaction.stellarStatus === 'pending';
  }

  /**
   * Check if a transaction has failed
   */
  static hasFailed(transaction: TransactionResponse): boolean {
    return transaction.stellarStatus === 'failed';
  }

  /**
   * Format amount as USDC string (e.g., "5.00 USDC")
   */
  static formatAmount(amount: number): string {
    return `${amount.toFixed(2)} USDC`;
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get human-readable status
   */
  static getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Processing',
      confirmed: 'Completed',
      failed: 'Failed',
    };
    return labels[status] || status;
  }

  /**
   * Build Stellar explorer URL for a transaction
   */
  static getStellarExplorerUrl(txHash: string, testnet = true): string {
    const domain = testnet ? 'testnet.stellar.expert' : 'stellar.expert';
    return `https://${domain}/tx/${txHash}`;
  }
}

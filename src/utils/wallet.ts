import { Keypair, Account } from '@stellar/stellar-sdk';

/**
 * WalletUtils
 *
 * Utilities for wallet operations on the client side.
 * Helps validate addresses, generate keypairs for testing, etc.
 */
export class WalletUtils {
  /**
   * Validate if a string is a valid Stellar public key
   */
  static isValidPublicKey(publicKey: string): boolean {
    try {
      const keypair = Keypair.fromPublicKey(publicKey);
      return keypair.publicKey() === publicKey;
    } catch {
      return false;
    }
  }

  /**
   * Validate if a string is a valid Stellar secret key
   */
  static isValidSecretKey(secretKey: string): boolean {
    try {
      Keypair.fromSecret(secretKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extract public key from secret key
   */
  static getPublicKeyFromSecret(secretKey: string): string {
    const keypair = Keypair.fromSecret(secretKey);
    return keypair.publicKey();
  }

  /**
   * Generate a new keypair (for testing/demo purposes only)
   * Never use in production without proper key management
   */
  static generateKeypair(): { publicKey: string; secretKey: string } {
    const keypair = Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
  }
}

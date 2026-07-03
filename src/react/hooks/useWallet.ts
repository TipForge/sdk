import { useState, useEffect } from 'react';
import { useTipForge } from './useTipForge';
import type { WalletResponse } from '../../types';

/**
 * useWallet hook
 *
 * Fetch and manage connected wallets.
 *
 * Usage:
 *   const { wallets, loading, error, setDefault } = useWallet();
 */
export function useWallet() {
  const { client } = useTipForge();
  const [wallets, setWallets] = useState<WalletResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWallets = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.getWallets();
        setWallets(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch wallets'));
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [client]);

  const setDefault = async (walletId: string): Promise<void> => {
    try {
      await client.setDefaultWallet(walletId);
      setWallets((prev) =>
        prev.map((w) => ({
          ...w,
          isDefault: w.id === walletId,
        }))
      );
    } catch (err) {
      const appError = err instanceof Error ? err : new Error('Failed to set default wallet');
      setError(appError);
      throw appError;
    }
  };

  return { wallets, loading, error, setDefault };
}

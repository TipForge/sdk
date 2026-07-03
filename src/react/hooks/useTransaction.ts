import { useState, useCallback } from 'react';
import { useTipForge } from './useTipForge';
import type { TransactionResponse, CreateTipRequest } from '../../types';

/**
 * useTransaction hook
 *
 * Handle creating tips and checking status.
 *
 * Usage:
 *   const { createTip, loading, error } = useTransaction();
 *   await createTip({ creatorId: '123', amount: 5 });
 */
export function useTransaction() {
  const { client } = useTipForge();
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTip = useCallback(
    async (payload: CreateTipRequest): Promise<TransactionResponse> => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.createTip(payload);
        setTransaction(result);
        return result;
      } catch (err) {
        const appError = err instanceof Error ? err : new Error('Failed to create tip');
        setError(appError);
        throw appError;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  return { transaction, loading, error, createTip };
}

import { useState, useEffect } from 'react';
import { useTipForge } from './useTipForge';
import type { CreatorProfileResponse } from '../../types';

/**
 * useCreator hook
 *
 * Fetch and cache creator profile by ID.
 *
 * Usage:
 *   const { creator, loading, error } = useCreator('creator-id');
 */
export function useCreator(creatorId: string | null) {
  const { client } = useTipForge();
  const [creator, setCreator] = useState<CreatorProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!creatorId) return;

    const fetchCreator = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const profile = await client.getCreatorProfile(creatorId);
        setCreator(profile);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch creator'));
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [creatorId, client]);

  return { creator, loading, error };
}

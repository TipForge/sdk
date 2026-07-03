import { useContext } from 'react';
import { TipForgeContext } from '../context/TipForgeProvider';

/**
 * useTipForge hook
 *
 * Provides access to TipForgeClient instance and auth state.
 *
 * Usage:
 *   const { client, token, setToken } = useTipForge();
 *   const tip = await client.createTip({ creatorId: '123', amount: 5 });
 */
export function useTipForge() {
  const context = useContext(TipForgeContext);
  if (!context) {
    throw new Error('useTipForge must be used within TipForgeProvider');
  }
  return context;
}

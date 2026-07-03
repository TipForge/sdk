import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { TipForgeClient } from '../../client';

interface TipForgeContextValue {
  client: TipForgeClient;
  token: string | null;
  setToken: (token: string | null) => void;
}

export const TipForgeContext = createContext<TipForgeContextValue | undefined>(undefined);

interface TipForgeProviderProps {
  baseUrl: string;
  initialToken?: string;
  children: ReactNode;
}

/**
 * TipForgeProvider
 *
 * React context provider for TipForge SDK.
 * Wraps your app to provide client and auth state.
 *
 * Usage:
 *   <TipForgeProvider baseUrl="https://api.tipforge.com">
 *     <YourApp />
 *   </TipForgeProvider>
 */
export function TipForgeProvider({ baseUrl, initialToken, children }: TipForgeProviderProps) {
  const [token, setTokenState] = useState<string | null>(initialToken || null);
  const [client] = useState(() => new TipForgeClient(baseUrl, initialToken));

  const setToken = useCallback(
    (newToken: string | null): void => {
      setTokenState(newToken);
      if (newToken) {
        client.setToken(newToken);
      } else {
        client.clearToken();
      }
    },
    [client]
  );

  const value: TipForgeContextValue = {
    client,
    token,
    setToken,
  };

  return <TipForgeContext.Provider value={value}>{children}</TipForgeContext.Provider>;
}

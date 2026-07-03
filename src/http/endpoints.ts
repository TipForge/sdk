/**
 * API Endpoints Registry
 *
 * Central registry of all API endpoints.
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    ME: '/api/v1/auth/me',
    LOGOUT: '/api/v1/auth/logout',
  },

  // User endpoints
  USERS: {
    GET_PROFILE: '/api/v1/users/:userId',
    UPDATE_PROFILE: '/api/v1/users/:userId',
  },

  // Creator endpoints
  CREATORS: {
    CREATE: '/api/v1/creators',
    GET: '/api/v1/creators/:creatorId',
    GET_BY_USERNAME: '/api/v1/creators/handle/:username',
    UPDATE: '/api/v1/creators/:creatorId',
    GET_EARNINGS: '/api/v1/creators/:creatorId/earnings',
  },

  // Transaction endpoints
  TRANSACTIONS: {
    CREATE: '/api/v1/transactions',
    GET: '/api/v1/transactions/:transactionId',
    LIST: '/api/v1/transactions',
  },

  // Wallet endpoints
  WALLETS: {
    CREATE: '/api/v1/wallets',
    GET_LIST: '/api/v1/wallets',
    UPDATE: '/api/v1/wallets/:walletId',
    DELETE: '/api/v1/wallets/:walletId',
  },
} as const;

/**
 * Replace path parameters in endpoint
 */
export function buildEndpoint(endpoint: string, params?: Record<string, string | number>): string {
  if (!params) {
    return endpoint;
  }

  let result = endpoint;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, String(value));
  }
  return result;
}

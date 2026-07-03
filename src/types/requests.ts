/**
 * Request Schemas
 *
 * Request payload types for API operations.
 */

/**
 * Authentication requests
 */
export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Tip/Payment requests
 */
export interface CreateTipRequest {
  creatorId: string;
  amount: number;
  message?: string;
}

export interface TipRequest extends CreateTipRequest {
  // Alias for clarity
}

/**
 * Pagination requests
 */
export interface PaginatedRequest {
  page?: number;
  pageSize?: number;
}

/**
 * Search/Filter requests
 */
export interface SearchCreatorRequest extends PaginatedRequest {
  query?: string;
  verified?: boolean;
  isPublic?: boolean;
}

export interface GetTransactionsRequest extends PaginatedRequest {
  status?: 'pending' | 'confirmed' | 'failed';
  creatorId?: string;
}

/**
 * Batch requests
 */
export interface BatchTipRequest {
  tips: CreateTipRequest[];
}

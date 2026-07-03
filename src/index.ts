// TipForge SDK - Client abstraction layer
// Provides clean API surface for frontend and external integrations
// Consumes types and contracts from tipforge-backend

// Export core API client
export { TipForgeClient } from './client';

// Export types (re-exported from backend)
export type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  UserResponse,
  CreatorProfileRequest,
  CreatorProfileResponse,
  SocialProfileRequest,
  SocialProfileResponse,
  WalletConnectionRequest,
  WalletResponse,
  CreateTipRequest,
  TransactionResponse,
  TransactionHistoryResponse,
  PayoutRecordResponse,
  CreatorEarningsResponse,
  ErrorResponse,
} from './types';

// Export helpers
export { WalletUtils } from './utils/wallet';
export { TransactionUtils } from './utils/transaction';
export { ValidationUtils } from './utils/validation';

/**
 * TipForge SDK
 *
 * Client library for TipForge payment infrastructure.
 * Provides type-safe API client and utilities for integrating TipForge payments.
 */

export const SDK_VERSION = '0.1.0';

// Re-export client and utilities
export { TipForgeClient } from './client';

// Re-export types
export type { ApiResponse, ApiError, ClientConfig } from './types';

// Re-export utils
export { ApiErrorHandler, RequestValidator } from './utils';

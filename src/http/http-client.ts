/**
 * HTTP Client
 *
 * Base HTTP client for making requests to the backend API.
 * Handles request/response formatting, retries, and error handling.
 */

import { ApiError } from '../types';

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  timeout?: number;
  retries?: number;
}

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private retryAttempts: number;

  constructor(
    baseUrl: string,
    options?: {
      timeout?: number;
      retryAttempts?: number;
      headers?: Record<string, string>;
    }
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = options?.timeout || 30000;
    this.retryAttempts = options?.retryAttempts || 3;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };
  }

  /**
   * Set default header
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove default header
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  /**
   * Make HTTP request
   */
  async request<T>(path: string, options: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = { ...this.defaultHeaders, ...options.headers };

    let lastError: Error | null = null;
    const attempts = options.retries ?? this.retryAttempts;

    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        const response = await fetch(url, {
          method: options.method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: AbortSignal.timeout(options.timeout ?? this.timeout),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new ApiError(response.status, error.error || 'Request failed', error.code);
        }

        return (await response.json()) as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }
}

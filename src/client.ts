/**
 * TipForgeClient
 *
 * Main client for interacting with TipForge backend API.
 * Handles authentication, request/response handling, and error management.
 */

import { HttpClient, RequestOptions } from './http/http-client';
import { getConfig } from './config';
import { ApiResponse } from './types/api';

export interface ClientConfig {
  baseUrl: string;
  token?: string;
  timeout?: number;
}

export class TipForgeClient {
  private config: Required<ClientConfig>;
  private httpClient: HttpClient;
  private token?: string;

  constructor(config: ClientConfig) {
    this.config = {
      timeout: config.timeout || 30000,
      baseUrl: config.baseUrl.replace(/\/$/, ''), // Remove trailing slash
      token: config.token,
    };

    this.token = config.token;

    this.httpClient = new HttpClient(this.config.baseUrl, {
      timeout: this.config.timeout,
      retryAttempts: getConfig().retryAttempts,
    });

    if (this.token) {
      this.httpClient.setHeader('Authorization', `Bearer ${this.token}`);
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
    this.config.token = token;
    this.httpClient.setHeader('Authorization', `Bearer ${token}`);
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = undefined;
    this.config.token = undefined;
    this.httpClient.removeHeader('Authorization');
  }

  /**
   * Make request to backend API
   */
  async request<T = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown,
    options?: Partial<RequestOptions>
  ): Promise<ApiResponse<T>> {
    try {
      const data = await this.httpClient.request<ApiResponse<T>>(path, {
        method,
        body: body as Record<string, unknown>,
        ...options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get HTTP client instance (for advanced usage)
   */
  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  /**
   * Get current config
   */
  getConfig(): Readonly<ClientConfig> {
    return { ...this.config };
  }
}

/**
 * TipForgeClient
 *
 * Main client for interacting with TipForge backend API.
 * Handles authentication, request/response handling, and error management.
 */

export interface ClientConfig {
  baseUrl: string;
  token?: string;
  timeout?: number;
}

export class TipForgeClient {
  private config: Required<ClientConfig>;

  constructor(config: ClientConfig) {
    this.config = {
      timeout: 30000,
      ...config,
      baseUrl: config.baseUrl.replace(/\/$/, ''), // Remove trailing slash
    };
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.config.token = token;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.config.token = undefined;
  }

  /**
   * Get current config
   */
  getConfig(): Readonly<ClientConfig> {
    return this.config;
  }
}

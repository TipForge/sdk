import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  CreatorProfileRequest,
  CreatorProfileResponse,
  CreateTipRequest,
  TransactionResponse,
  TransactionHistoryResponse,
  CreatorEarningsResponse,
  WalletConnectionRequest,
  WalletResponse,
  SocialProfileRequest,
  SocialProfileResponse,
  UserResponse,
} from './types';

/**
 * TipForgeClient
 *
 * Main SDK client for interacting with TipForge backend.
 * Provides clean abstraction over REST API.
 *
 * Usage:
 *   const client = new TipForgeClient('https://api.tipforge.com', token);
 *   const tip = await client.createTip({ creatorId: '123', amount: 5 });
 */
export class TipForgeClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.token = token || null;
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
  }

  /**
   * Internal method to make HTTP requests
   */
  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json() as Promise<T>;
  }

  // Auth endpoints

  async signup(payload: SignupRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('POST', '/api/v1/auth/signup', payload);
  }

  async login(payload: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('POST', '/api/v1/auth/login', payload);
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('GET', '/api/v1/auth/me');
  }

  // Creator endpoints

  async registerAsCreator(payload: CreatorProfileRequest): Promise<CreatorProfileResponse> {
    return this.request<CreatorProfileResponse>('POST', '/api/v1/creators/register', payload);
  }

  async getCreatorProfile(creatorId: string): Promise<CreatorProfileResponse> {
    return this.request<CreatorProfileResponse>('GET', `/api/v1/creators/${creatorId}`);
  }

  async updateCreatorProfile(
    creatorId: string,
    payload: Partial<CreatorProfileRequest>
  ): Promise<CreatorProfileResponse> {
    return this.request<CreatorProfileResponse>('PATCH', `/api/v1/creators/${creatorId}`, payload);
  }

  // Social profile endpoints

  async addSocialProfile(payload: SocialProfileRequest): Promise<SocialProfileResponse> {
    return this.request<SocialProfileResponse>('POST', '/api/v1/social-profiles', payload);
  }

  async removeSocialProfile(profileId: string): Promise<void> {
    await this.request<void>('DELETE', `/api/v1/social-profiles/${profileId}`);
  }

  // Wallet endpoints

  async connectWallet(payload: WalletConnectionRequest): Promise<WalletResponse> {
    return this.request<WalletResponse>('POST', '/api/v1/wallets', payload);
  }

  async getWallets(): Promise<WalletResponse[]> {
    return this.request<WalletResponse[]>('GET', '/api/v1/wallets');
  }

  async setDefaultWallet(walletId: string): Promise<WalletResponse> {
    return this.request<WalletResponse>('PATCH', `/api/v1/wallets/${walletId}/default`);
  }

  // Payment endpoints

  async createTip(payload: CreateTipRequest): Promise<TransactionResponse> {
    return this.request<TransactionResponse>('POST', '/api/v1/tips', payload);
  }

  async getTransactionHistory(page = 1, pageSize = 20): Promise<TransactionHistoryResponse> {
    const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    return this.request<TransactionHistoryResponse>(
      'GET',
      `/api/v1/transactions?${query.toString()}`
    );
  }

  async getTransaction(transactionId: string): Promise<TransactionResponse> {
    return this.request<TransactionResponse>('GET', `/api/v1/transactions/${transactionId}`);
  }

  // Creator earnings

  async getCreatorEarnings(creatorId: string): Promise<CreatorEarningsResponse> {
    return this.request<CreatorEarningsResponse>('GET', `/api/v1/creators/${creatorId}/earnings`);
  }

  // Health check

  async health(): Promise<{ status: string; version: string }> {
    return this.request<{ status: string; version: string }>('GET', '/api/v1/health');
  }
}

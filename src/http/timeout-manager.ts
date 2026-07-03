/**
 * Timeout Manager
 *
 * Manages timeout handling for requests.
 */

export interface TimeoutConfig {
  default: number;
  min: number;
  max: number;
}

export class TimeoutManager {
  private config: TimeoutConfig;

  constructor(config: Partial<TimeoutConfig> = {}) {
    this.config = {
      default: config.default ?? 30000,
      min: config.min ?? 1000,
      max: config.max ?? 300000,
    };
  }

  /**
   * Validate and normalize timeout value
   */
  normalizeTimeout(timeout?: number): number {
    if (timeout === undefined) {
      return this.config.default;
    }

    if (timeout < this.config.min) {
      return this.config.min;
    }

    if (timeout > this.config.max) {
      return this.config.max;
    }

    return timeout;
  }

  /**
   * Create abort signal with timeout
   */
  createAbortSignal(timeout?: number): AbortSignal {
    const normalizedTimeout = this.normalizeTimeout(timeout);
    return AbortSignal.timeout(normalizedTimeout);
  }

  /**
   * Execute function with timeout
   */
  async executeWithTimeout<T>(fn: () => Promise<T>, timeout?: number): Promise<T> {
    const normalizedTimeout = this.normalizeTimeout(timeout);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), normalizedTimeout);

    try {
      return await fn();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<TimeoutConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<TimeoutConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

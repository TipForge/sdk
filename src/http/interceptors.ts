/**
 * Request/Response Interceptors
 *
 * Allows hooks into request and response lifecycle.
 */

import { RequestOptions } from './http-client';

export type RequestInterceptor = (
  options: RequestOptions
) => RequestOptions | Promise<RequestOptions>;
export type ResponseInterceptor = <T>(response: T) => T | Promise<T>;
export type ErrorInterceptor = (error: unknown) => unknown | Promise<unknown>;

export class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Execute request interceptors
   */
  async executeRequestInterceptors(options: RequestOptions): Promise<RequestOptions> {
    let result = options;
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  /**
   * Execute response interceptors
   */
  async executeResponseInterceptors<T>(response: T): Promise<T> {
    let result = response;
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  /**
   * Execute error interceptors
   */
  async executeErrorInterceptors(error: unknown): Promise<unknown> {
    let result = error;
    for (const interceptor of this.errorInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }
}

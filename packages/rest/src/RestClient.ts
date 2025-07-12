/**
 * Base REST client for interacting with Yurba.one API
 */
export class REST {
  private baseURL: string;
  private token: string;
  private headers: Record<string, string>;
  private abortControllers: Map<string, AbortController> = new Map();

  /**
   * Creates a new REST client
   * @param token - Authorization token
   * @param baseURL - Base API URL (default https://api.yurba.one)
   */
  constructor(token: string, baseURL: string = 'https://api.yurba.one') {
    this.token = token;
    this.baseURL = baseURL;
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': this.token
    };
  }

  /**
   * Executes GET request to API
   * @param endpoint - API endpoint
   * @param queryParams - Query parameters
   * @param timeout - Request timeout in milliseconds
   * @returns Request result
   */
  async get<T>(endpoint: string, queryParams: Record<string, any> = {}, timeout?: number): Promise<T> {
    const url = this.buildUrl(endpoint, queryParams);
    return this.request<T>('GET', url, undefined, timeout);
  }

  /**
   * Executes POST request to API
   * @param endpoint - API endpoint
   * @param data - Data to send
   * @param timeout - Request timeout in milliseconds
   * @returns Request result
   */
  async post<T>(endpoint: string, data: any = {}, timeout?: number): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>('POST', url, data, timeout);
  }

  /**
   * Executes PUT request to API
   * @param endpoint - API endpoint
   * @param data - Data to send
   * @param timeout - Request timeout in milliseconds
   * @returns Request result
   */
  async put<T>(endpoint: string, data: any = {}, timeout?: number): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>('PUT', url, data, timeout);
  }

  /**
   * Executes PATCH request to API
   * @param endpoint - API endpoint
   * @param data - Data to send
   * @param timeout - Request timeout in milliseconds
   * @returns Request result
   */
  async patch<T>(endpoint: string, data: any = {}, timeout?: number): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>('PATCH', url, data, timeout);
  }

  /**
   * Executes DELETE request to API
   * @param endpoint - API endpoint
   * @param timeout - Request timeout in milliseconds
   * @returns Request result
   */
  async delete<T>(endpoint: string, timeout?: number): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>('DELETE', url, undefined, timeout);
  }

  /**
   * Cancels request by endpoint
   * @param endpoint - API endpoint
   */
  cancelRequest(endpoint: string): void {
    const controller = this.abortControllers.get(endpoint);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(endpoint);
    }
  }

  /**
   * Виконує запит до API з обробкою помилок
   * @param method - HTTP метод
   * @param url - URL запиту
   * @param data - Дані для відправки
   * @param timeout - Таймаут запиту в мілісекундах
   * @returns Результат запиту
   */
  private async request<T>(method: string, url: string, data?: any, timeout?: number): Promise<T> {
    const controller = new AbortController();
    const { signal } = controller;
    
    // Зберігаємо контролер для можливості скасування запиту
    const endpoint = new URL(url).pathname;
    this.abortControllers.set(endpoint, controller);
    
    // Налаштовуємо таймаут, якщо вказано
    let timeoutId: NodeJS.Timeout | undefined;
    if (timeout) {
      timeoutId = setTimeout(() => {
        controller.abort();
        this.abortControllers.delete(endpoint);
      }, timeout);
    }

    const options: RequestInit = {
      method,
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
      signal
    };

    try {
      const response = await fetch(url, options);
      
      // Очищаємо таймаут і видаляємо контролер
      if (timeoutId) clearTimeout(timeoutId);
      this.abortControllers.delete(endpoint);
      
      if (!response.ok) {
        let errorBody: string;
        let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorBody = JSON.stringify(errorData);
          if (errorData.detail) {
            errorMessage = `API Error: ${errorData.detail}`;
          }
        } catch {
          errorBody = await response.text();
        }
        
        throw new ApiError(errorMessage, response.status, errorBody);
      }

      return await response.json() as T;
    } catch (error) {
      // Очищаємо таймаут і видаляємо контролер
      if (timeoutId) clearTimeout(timeoutId);
      this.abortControllers.delete(endpoint);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request aborted', 0);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(`Network error: ${(error as Error).message}`, 0);
    }
  }

  /**
   * Виконує запит для завантаження файлів
   * @param endpoint - Ендпоінт API
   * @param formData - Дані форми для відправки
   * @param timeout - Таймаут запиту в мілісекундах
   * @returns Результат запиту
   */
  async uploadFile<T>(endpoint: string, formData: FormData, timeout?: number): Promise<T> {
    const url = this.buildUrl(endpoint);
    const controller = new AbortController();
    const { signal } = controller;
    
    // Зберігаємо контролер для можливості скасування запиту
    const endpointPath = new URL(url).pathname;
    this.abortControllers.set(endpointPath, controller);
    
    // Налаштовуємо таймаут, якщо вказано
    let timeoutId: NodeJS.Timeout | undefined;
    if (timeout) {
      timeoutId = setTimeout(() => {
        controller.abort();
        this.abortControllers.delete(endpointPath);
      }, timeout);
    }
    
    const headers = { ...this.headers };
    delete headers['Content-Type']; // Дозволяємо браузеру встановити правильний Content-Type з boundary
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        signal
      });
      
      // Очищаємо таймаут і видаляємо контролер
      if (timeoutId) clearTimeout(timeoutId);
      this.abortControllers.delete(endpointPath);
      
      if (!response.ok) {
        let errorBody: string;
        let errorMessage = `File upload failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorBody = JSON.stringify(errorData);
          if (errorData.detail) {
            errorMessage = `Upload Error: ${errorData.detail}`;
          }
        } catch {
          errorBody = await response.text();
        }
        
        throw new ApiError(errorMessage, response.status, errorBody);
      }

      return await response.json() as T;
    } catch (error) {
      // Очищаємо таймаут і видаляємо контролер
      if (timeoutId) clearTimeout(timeoutId);
      this.abortControllers.delete(endpointPath);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('File upload aborted', 0);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(`Network error during file upload: ${(error as Error).message}`, 0);
    }
  }

  /**
   * Будує URL з ендпоінту та параметрів запиту
   * @param endpoint - Ендпоінт API
   * @param queryParams - Параметри запиту
   * @returns Повний URL
   */
  private buildUrl(endpoint: string, queryParams: Record<string, any> = {}): string {
    const url = new URL(`${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
    
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    
    return url.toString();
  }
}

/**
 * Клас для обробки помилок API
 */
export class ApiError extends Error {
  statusCode: number;
  responseBody?: string;

  constructor(message: string, statusCode: number, responseBody?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
    
    // Для правильного наслідування в TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
/**
 * Базовий REST клієнт для взаємодії з API Yurba.one
 */
export declare class RestClient {
    private baseURL;
    private token;
    private headers;
    private abortControllers;
    /**
     * Створює новий REST клієнт
     * @param token - Токен авторизації
     * @param baseURL - Базовий URL API (за замовчуванням https://api.yurba.one)
     */
    constructor(token: string, baseURL?: string);
    /**
     * Виконує GET запит до API
     * @param endpoint - Ендпоінт API
     * @param queryParams - Параметри запиту
     * @param timeout - Таймаут запиту в мілісекундах
     * @returns Результат запиту
     */
    get<T>(endpoint: string, queryParams?: Record<string, any>, timeout?: number): Promise<T>;
    /**
     * Виконує POST запит до API
     * @param endpoint - Ендпоінт API
     * @param data - Дані для відправки
     * @param timeout - Таймаут запиту в мілісекундах
     * @returns Результат запиту
     */
    post<T>(endpoint: string, data?: any, timeout?: number): Promise<T>;
    /**
     * Виконує PUT запит до API
     * @param endpoint - Ендпоінт API
     * @param data - Дані для відправки
     * @param timeout - Таймаут запиту в мілісекундах
     * @returns Результат запиту
     */
    put<T>(endpoint: string, data?: any, timeout?: number): Promise<T>;
    /**
     * Виконує PATCH запит до API
     * @param endpoint - Ендпоінт API
     * @param data - Дані для відправки
     * @param timeout - Таймаут запиту в мілісекундах
     * @returns Результат запиту
     */
    patch<T>(endpoint: string, data?: any, timeout?: number): Promise<T>;
    /**
     * Виконує DELETE запит до API
     * @param endpoint - Ендпоінт API
     * @param timeout - Таймаут запиту в мілісекундах
     * @returns Результат запиту
     */
    delete<T>(endpoint: string, timeout?: number): Promise<T>;
    /**
     * Скасовує запит за ендпоінтом
     * @param endpoint - Ендпоінт API
     */
    cancelRequest(endpoint: string): void;
    /**
     * Виконує запит до API з обробкою помилок
     * @param method - HTTP метод
     * @param url - URL запиту
     * @param data - Дані для відправки
     * @param timeout - Таймаут запиту в мілісекундах
     * @returns Результат запиту
     */
    private request;
    /**
     * Виконує запит для завантаження файлів
     * @param endpoint - Ендпоінт API
     * @param formData - Дані форми для відправки
     * @param timeout - Таймаут запиту в мілісекундах
     * @returns Результат запиту
     */
    uploadFile<T>(endpoint: string, formData: FormData, timeout?: number): Promise<T>;
    /**
     * Будує URL з ендпоінту та параметрів запиту
     * @param endpoint - Ендпоінт API
     * @param queryParams - Параметри запиту
     * @returns Повний URL
     */
    private buildUrl;
}
/**
 * Клас для обробки помилок API
 */
export declare class ApiError extends Error {
    statusCode: number;
    responseBody?: string;
    constructor(message: string, statusCode: number, responseBody?: string);
}
//# sourceMappingURL=RestClient.d.ts.map
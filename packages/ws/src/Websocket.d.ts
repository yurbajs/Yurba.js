import { EventEmitter } from 'events';
interface ReconnectingWebSocketOptions {
    maxReconnectAttempts?: number;
    retryDelay?: number;
    debug?: boolean;
    pingInterval?: number;
    pongTimeout?: number;
}
/**
 * WebSocket клієнт з автоматичним перепідключенням
 * @extends EventEmitter
 */
declare class ReconnectingWebSocket extends EventEmitter {
    private url;
    private options;
    private ws;
    private reconnectAttempts;
    private isConnected;
    private messageQueue;
    private pingIntervalId?;
    private pongTimeoutId?;
    private forceClosed;
    /**
     * Створює новий WebSocket клієнт з автоматичним перепідключенням
     * @param url URL для підключення
     * @param options Опції для WebSocket
     */
    constructor(url: string, options?: ReconnectingWebSocketOptions);
    /**
     * Підключається до WebSocket сервера
     * @private
     */
    private connect;
    /**
     * Обробляє подію відкриття з'єднання
     * @private
     */
    private handleOpen;
    /**
     * Обробляє подію закриття з'єднання
     * @param code Код закриття
     * @private
     */
    private handleClose;
    /**
     * Обробляє помилки WebSocket
     * @param err Об'єкт помилки
     * @private
     */
    private handleError;
    /**
     * Обробляє вхідні повідомлення
     * @param data Дані повідомлення
     * @private
     */
    private handleMessage;
    /**
     * Запускає інтервал відправки пінг-повідомлень
     * @private
     */
    private startPingInterval;
    /**
     * Зупиняє інтервал відправки пінг-повідомлень
     * @private
     */
    private stopPingInterval;
    /**
     * Обробляє відповідь pong від сервера
     * @private
     */
    private handlePong;
    /**
     * Відправляє дані через WebSocket
     * @param data Дані для відправки
     */
    send(data: string): void;
    /**
     * Закриває WebSocket з'єднання
     * @param code Код закриття
     * @param reason Причина закриття
     */
    close(code?: number, reason?: string): void;
    /**
     * Перевіряє, чи підключений WebSocket
     * @returns true, якщо підключений
     */
    isOpen(): boolean;
    /**
     * Очищає чергу повідомлень
     */
    clearQueue(): void;
}
export default ReconnectingWebSocket;
//# sourceMappingURL=Websocket.d.ts.map
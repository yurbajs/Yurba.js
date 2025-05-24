"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const events_1 = require("events");
/**
 * WebSocket клієнт з автоматичним перепідключенням
 * @extends EventEmitter
 */
class ReconnectingWebSocket extends events_1.EventEmitter {
    /**
     * Створює новий WebSocket клієнт з автоматичним перепідключенням
     * @param url URL для підключення
     * @param options Опції для WebSocket
     */
    constructor(url, options = {}) {
        super();
        this.ws = null;
        this.reconnectAttempts = 0;
        this.isConnected = false;
        this.messageQueue = [];
        this.forceClosed = false;
        this.url = url;
        this.options = {
            maxReconnectAttempts: 5,
            retryDelay: 5000,
            debug: false,
            pingInterval: 30000,
            pongTimeout: 5000,
            ...options,
        };
        this.connect();
    }
    /**
     * Підключається до WebSocket сервера
     * @private
     */
    connect() {
        if (this.forceClosed) {
            return;
        }
        if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
            this.emit('error', new Error('Maximum reconnection attempts reached. Giving up.'));
            return;
        }
        if (this.options.debug) {
            this.emit('debug', `Attempting to connect WebSocket... [Attempt ${this.reconnectAttempts + 1}]`);
        }
        try {
            this.ws = new ws_1.default(this.url);
            this.reconnectAttempts++;
            this.ws.on('open', () => this.handleOpen());
            this.ws.on('close', (code) => this.handleClose(code));
            this.ws.on('error', (err) => this.handleError(err));
            this.ws.on('message', (data) => this.handleMessage(data));
            this.ws.on('pong', () => this.handlePong());
        }
        catch (err) {
            this.handleError(err instanceof Error ? err : new Error(String(err)));
        }
    }
    /**
     * Обробляє подію відкриття з'єднання
     * @private
     */
    handleOpen() {
        if (this.options.debug) {
            this.emit('debug', 'WebSocket connected');
        }
        this.reconnectAttempts = 0;
        this.isConnected = true;
        this.emit('open');
        // Відправляємо повідомлення з черги
        while (this.messageQueue.length > 0) {
            const msg = this.messageQueue.shift();
            if (msg && this.ws?.readyState === ws_1.default.OPEN) {
                this.ws.send(msg);
            }
        }
        // Запускаємо пінг для підтримки з'єднання
        this.startPingInterval();
    }
    /**
     * Обробляє подію закриття з'єднання
     * @param code Код закриття
     * @private
     */
    handleClose(code) {
        if (this.options.debug) {
            this.emit('debug', `WebSocket closed with code ${code}`);
        }
        this.isConnected = false;
        this.stopPingInterval();
        if (!this.forceClosed && this.reconnectAttempts < this.options.maxReconnectAttempts) {
            if (this.options.debug) {
                this.emit('debug', `Reconnecting in ${this.options.retryDelay / 1000} seconds...`);
            }
            setTimeout(() => this.connect(), this.options.retryDelay);
        }
        else if (this.forceClosed) {
            if (this.options.debug) {
                this.emit('debug', 'WebSocket closed by user');
            }
            this.emit('close', code);
        }
        else {
            this.emit('error', new Error('WebSocket closed permanently after max attempts.'));
            this.emit('close', code);
        }
    }
    /**
     * Обробляє помилки WebSocket
     * @param err Об'єкт помилки
     * @private
     */
    handleError(err) {
        this.emit('error', new Error(`WebSocket error: ${err.message}`));
        if (this.ws) {
            try {
                this.ws.close();
            }
            catch (closeErr) {
                // Ігноруємо помилки при закритті
            }
        }
    }
    /**
     * Обробляє вхідні повідомлення
     * @param data Дані повідомлення
     * @private
     */
    handleMessage(data) {
        if (this.options.debug) {
            this.emit('debug', `Message received: ${data}`);
        }
        this.emit('message', data.toString());
    }
    /**
     * Запускає інтервал відправки пінг-повідомлень
     * @private
     */
    startPingInterval() {
        this.stopPingInterval();
        if (this.options.pingInterval > 0) {
            this.pingIntervalId = setInterval(() => {
                if (this.isConnected && this.ws?.readyState === ws_1.default.OPEN) {
                    if (this.options.debug) {
                        this.emit('debug', 'Sending ping');
                    }
                    try {
                        this.ws.ping();
                        // Встановлюємо таймаут для pong
                        this.pongTimeoutId = setTimeout(() => {
                            if (this.options.debug) {
                                this.emit('debug', 'Pong timeout - reconnecting');
                            }
                            if (this.ws) {
                                try {
                                    this.ws.terminate();
                                }
                                catch (err) {
                                    // Ігноруємо помилки при терміновому закритті
                                }
                            }
                        }, this.options.pongTimeout);
                    }
                    catch (err) {
                        this.handleError(err instanceof Error ? err : new Error(String(err)));
                    }
                }
            }, this.options.pingInterval);
        }
    }
    /**
     * Зупиняє інтервал відправки пінг-повідомлень
     * @private
     */
    stopPingInterval() {
        if (this.pingIntervalId) {
            clearInterval(this.pingIntervalId);
            this.pingIntervalId = undefined;
        }
        if (this.pongTimeoutId) {
            clearTimeout(this.pongTimeoutId);
            this.pongTimeoutId = undefined;
        }
    }
    /**
     * Обробляє відповідь pong від сервера
     * @private
     */
    handlePong() {
        if (this.options.debug) {
            this.emit('debug', 'Received pong');
        }
        if (this.pongTimeoutId) {
            clearTimeout(this.pongTimeoutId);
            this.pongTimeoutId = undefined;
        }
    }
    /**
     * Відправляє дані через WebSocket
     * @param data Дані для відправки
     */
    send(data) {
        if (this.isConnected && this.ws?.readyState === ws_1.default.OPEN) {
            if (this.options.debug) {
                this.emit('debug', `Sending data via WebSocket: ${data}`);
            }
            try {
                this.ws.send(data);
            }
            catch (err) {
                this.handleError(err instanceof Error ? err : new Error(String(err)));
            }
        }
        else {
            if (this.options.debug) {
                this.emit('debug', `WebSocket not connected. Queuing message: ${data}`);
            }
            this.messageQueue.push(data);
        }
    }
    /**
     * Закриває WebSocket з'єднання
     * @param code Код закриття
     * @param reason Причина закриття
     */
    close(code = 1000, reason = '') {
        if (this.options.debug) {
            this.emit('debug', `Closing WebSocket with code ${code} and reason "${reason}"`);
        }
        this.forceClosed = true;
        this.stopPingInterval();
        if (this.ws) {
            try {
                this.ws.close(code, reason);
            }
            catch (err) {
                // Ігноруємо помилки при закритті
            }
        }
    }
    /**
     * Перевіряє, чи підключений WebSocket
     * @returns true, якщо підключений
     */
    isOpen() {
        return this.isConnected && this.ws?.readyState === ws_1.default.OPEN;
    }
    /**
     * Очищає чергу повідомлень
     */
    clearQueue() {
        this.messageQueue = [];
    }
}
exports.default = ReconnectingWebSocket;
//# sourceMappingURL=Websocket.js.map
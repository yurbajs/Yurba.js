import WebSocket from 'ws';
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
class ReconnectingWebSocket extends EventEmitter {
  private url: string;
  private options: Required<ReconnectingWebSocketOptions>;
  private ws: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private isConnected: boolean = false;
  private messageQueue: string[] = [];
  private pingIntervalId?: NodeJS.Timeout;
  private pongTimeoutId?: NodeJS.Timeout;
  private forceClosed: boolean = false;

  /**
   * Створює новий WebSocket клієнт з автоматичним перепідключенням
   * @param url URL для підключення
   * @param options Опції для WebSocket
   */
  constructor(url: string, options: ReconnectingWebSocketOptions = {}) {
    super();
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
  private connect(): void {
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
      this.ws = new WebSocket(this.url);
      this.reconnectAttempts++;

      this.ws.on('open', () => this.handleOpen());
      this.ws.on('close', (code: number) => this.handleClose(code));
      this.ws.on('error', (err: Error) => this.handleError(err));
      this.ws.on('message', (data: WebSocket.Data) => this.handleMessage(data));
      this.ws.on('pong', () => this.handlePong());
    } catch (err) {
      this.handleError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Обробляє подію відкриття з'єднання
   * @private
   */
  private handleOpen(): void {
    if (this.options.debug) {
      this.emit('debug', 'WebSocket connected');
    }
    this.reconnectAttempts = 0;
    this.isConnected = true;
    this.emit('open');
    
    // Відправляємо повідомлення з черги
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift();
      if (msg && this.ws?.readyState === WebSocket.OPEN) {
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
  private handleClose(code: number): void {
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
    } else if (this.forceClosed) {
      if (this.options.debug) {
        this.emit('debug', 'WebSocket closed by user');
      }
      this.emit('close', code);
    } else {
      this.emit('error', new Error('WebSocket closed permanently after max attempts.'));
      this.emit('close', code);
    }
  }

  /**
   * Обробляє помилки WebSocket
   * @param err Об'єкт помилки
   * @private
   */
  private handleError(err: Error): void {
    this.emit('error', new Error(`WebSocket error: ${err.message}`));
    if (this.ws) {
      try {
        this.ws.close();
      } catch (closeErr) {
          console.log(`Dev: ${closeErr}`)
      }
    }
  }

  /**
   * Обробляє вхідні повідомлення
   * @param data Дані повідомлення
   * @private
   */
  private handleMessage(data: WebSocket.Data): void {
    if (this.options.debug) {
      this.emit('debug', `Message received: ${data}`);
    }
    this.emit('message', data.toString());
  }

  /**
   * Запускає інтервал відправки пінг-повідомлень
   * @private
   */
  private startPingInterval(): void {
    this.stopPingInterval();
    
    if (this.options.pingInterval > 0) {
      this.pingIntervalId = setInterval(() => {
        if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
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
                } catch (err) {
                  console.log(`Dev: ${err}`)
                }
              }
            }, this.options.pongTimeout);
          } catch (err) {
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
  private stopPingInterval(): void {
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
  private handlePong(): void {
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
  public send(data: string): void {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      if (this.options.debug) {
        this.emit('debug', `Sending data via WebSocket: ${data}`);
      }
      try {
        this.ws.send(data);
      } catch (err) {
        this.handleError(err instanceof Error ? err : new Error(String(err)));
      }
    } else {
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
  public close(code: number = 1000, reason: string = ''): void {
    if (this.options.debug) {
      this.emit('debug', `Closing WebSocket with code ${code} and reason "${reason}"`);
    }
    this.forceClosed = true;
    this.stopPingInterval();
    
    if (this.ws) {
      try {
        this.ws.close(code, reason);
      } catch (err) {
        console.log(`Dev: ${err}`)
        // Ігноруємо помилки при закритті
      }
    }
  }

  /**
   * Перевіряє, чи підключений WebSocket
   * @returns true, якщо підключений
   */
  public isOpen(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Очищає чергу повідомлень
   */
  public clearQueue(): void {
    this.messageQueue = [];
  }
}

export default ReconnectingWebSocket;
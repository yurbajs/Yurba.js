import { default as ReconnectingWebSocket } from "@yurbajs/ws";
import { EventEmitter } from "events";
import Logger, { LogLevel } from "../utils/Logger";
import { Message, ShortUserModel, IWebSocketManager } from "@yurbajs/types";

let logging = new Logger("WSM", { enabled: false });

if (process.env.MODULES === 'WSM') {
  try {
    require('dotenv').config();
    
    if (process.env.Debug) {
      logging = new Logger("WSM", { enabled: true, level: (process.env.Level as unknown) as LogLevel });
    }
  } catch {
    // no-op
  }
}



/**
 * Менеджер WebSocket з'єднань
 * @extends EventEmitter
 */
export default class WSM extends EventEmitter implements IWebSocketManager {
  private ws: ReconnectingWebSocket | null = null;
  private token: string;
  private subscriptions: Map<string, number[]> = new Map();
  private connectionTimeoutId: NodeJS.Timeout | null = null;

  /**
   * Створює новий менеджер WebSocket
   * @param token Токен авторизації
   */
  constructor(token: string) {
    super();
    this.token = token;
  }

  /**
   * Підключається до WebSocket сервера
   * @param botData Дані бота
   * @returns Promise, який вирішується після успішного підключення
   */
  async connect(botData: ShortUserModel): Promise<void> {
    this.ws = new ReconnectingWebSocket(
      `wss://api.yurba.one/ws?token=${this.token}`,
      {
        maxReconnectAttempts: 10,
        retryDelay: 5000,
        debug: true,
      }
    );

    this.ws.on("open", () => {
      logging.info("WebSocket connection opened.");

      // Відновлюємо підписки
      this.restoreSubscriptions();

      // Підписуємося на діалог бота
      this.subscribeToEvents("dialog", botData.ID);

      this.emit("ready"); // Емітуємо подію "ready" для Client
    });

    this.ws.on("message", (data: string) => {
      logging.debug("WebSocket received a message:", data);
      try {
        const message: Message = JSON.parse(data.toString());
        this.emit("message", message); // Емітуємо подію "message" для Client
      } catch (err) {
        logging.error("Failed to parse WebSocket message:", err);
        this.emit(
          "error",
          new Error(`Failed to parse WebSocket message: ${err}`)
        );
      }
    });

    this.ws.on("close", (code) => {
      logging.warn(`WebSocket connection closed with code ${code}.`);
      this.emit("close", code); // Емітуємо подію "close" для Client
    });

    this.ws.on("error", (err: Error) => {
      logging.error("WebSocket error:", err);
      this.emit("error", err); // Емітуємо подію "error" для Client
    });

    await this.waitForWebSocketOpen();
  }

  /**
   * Підписується на події певної категорії
   * @param category Категорія подій
   * @param thing_id ID об'єкта
   */
  public subscribeToEvents(category: string, thing_id: number): void {
    const subscribeData = {
      command: "subscribe",
      category,
      thing_id,
    };

    logging.info(
      `Subscribing to events for category: ${category}, thing_id: ${thing_id}`
    );

    // Зберігаємо підписку для можливого відновлення
    if (!this.subscriptions.has(category)) {
      this.subscriptions.set(category, []);
    }
    if (!this.subscriptions.get(category)?.includes(thing_id)) {
      this.subscriptions.get(category)?.push(thing_id);
    }

    this.ws?.send(JSON.stringify(subscribeData));
  }

  /**
   * Відписується від подій певної категорії
   * @param category Категорія подій
   * @param thing_id ID об'єкта
   */
  public unsubscribeFromEvents(category: string, thing_id: number): void {
    const unsubscribeData = {
      command: "unsubscribe",
      category,
      thing_id,
    };

    logging.info(
      `Unsubscribing from events for category: ${category}, thing_id: ${thing_id}`
    );

    // Видаляємо підписку зі збережених
    if (this.subscriptions.has(category)) {
      const ids = this.subscriptions.get(category);
      if (ids) {
        const index = ids.indexOf(thing_id);
        if (index !== -1) {
          ids.splice(index, 1);
        }
        if (ids.length === 0) {
          this.subscriptions.delete(category);
        }
      }
    }

    this.ws?.send(JSON.stringify(unsubscribeData));
  }

  /**
   * Відновлює всі збережені підписки
   * @private
   */
  private restoreSubscriptions(): void {
    logging.info("Restoring subscriptions...");
    this.subscriptions.forEach((ids, category) => {
      ids.forEach((id) => {
        const subscribeData = {
          command: "subscribe",
          category,
          thing_id: id,
        };
        this.ws?.send(JSON.stringify(subscribeData));
        logging.info(`Restored subscription: ${category}, thing_id: ${id}`);
      });
    });
  }

  /**
   * Чекає на відкриття WebSocket з'єднання
   * @returns Promise, який вирішується після відкриття з'єднання
   * @private
   */
  private waitForWebSocketOpen(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.isOpen()) {
        logging.info("WebSocket already open.");
        resolve();
        return;
      }
      
      logging.info("Waiting for WebSocket to open...");

      const onOpen = () => {
        if (this.connectionTimeoutId) {
          clearTimeout(this.connectionTimeoutId);
          this.connectionTimeoutId = null;
        }
        this.ws?.removeListener("error", onError);
        resolve();
      };

      const onError = (err: Error) => {
        if (this.connectionTimeoutId) {
          clearTimeout(this.connectionTimeoutId);
          this.connectionTimeoutId = null;
        }
        this.ws?.removeListener("open", onOpen);
        reject(err);
      };

      this.ws?.once("open", onOpen);
      this.ws?.once("error", onError);

      // Встановлюємо таймаут для підключення
      this.connectionTimeoutId = setTimeout(() => {
        this.ws?.removeListener("open", onOpen);
        this.ws?.removeListener("error", onError);
        reject(new Error("WebSocket connection timeout"));
      }, 10000);
    });
  }

  /**
   * Закриває WebSocket з'єднання
   */
  close(): void {
    logging.info("Closing WebSocket connection...");
    if (this.connectionTimeoutId) {
      clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  /**
   * Перевіряє, чи підключений WebSocket
   * @returns true, якщо підключений
   */
  isConnected(): boolean {
    return this.ws?.isOpen() || false;
  }
}

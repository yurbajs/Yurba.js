import { REST } from '@yurbajs/rest';
import { EventEmitter } from 'events';
import * as pkg from '../../package.json';
import Logger, { LogLevel } from '../utils/Logger';
import { UserModel, CommandArgsSchema, CommandHandler, Message, PhotoModel, TokenValidationError, WebSocketError, ApiRequestError, ClientOptions, MiddlewareFunction, MiddlewareConfig } from '@yurbajs/types';

import WSM from './WebsocketManager';
import MessageManager from './MessageManager';
import CommandManager from './CommandManager';
import MiddlewareManager from './MiddlewareManager';



interface DevConfig {
  debug: boolean;
  level?: LogLevel;
}

let Dev: DevConfig = {
  debug: false,
  level: LogLevel.DEBUG
};

if (process.env.MODULES === 'yurbajs') {
  try {
    require('dotenv').config();
    
    Dev = {
      debug: Boolean(process.env.DEBUG),
      level: (process.env.LEVEL as unknown) as LogLevel
    };
  } catch {  
    // no-op
  }
}
const logging = new Logger('Client', { level: (Dev.level as unknown) as LogLevel });

const log = (...args: unknown[]): void => {
  if (Dev.debug) {
    logging.debug(...args);
  }
};

const erlog = (...args: unknown[]): void => {
  logging.error(...args);
};

/**
 * Основний клас для роботи з Yurba API
 * @extends EventEmitter
 */
class Client extends EventEmitter {
  private token: string;
  private prefix: string;
  private wsm: WSM;
  public api: REST;
  private messageManager: MessageManager;
  private commandManager: CommandManager;
  private middlewareManager: MiddlewareManager;
  private _user?: UserModel;
  private isReady: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  /**
   * Створює новий клієнт Yurba
   * @param token Токен авторизації
   * @param prefix Префікс для команд
   */
  constructor(token: string, options: ClientOptions = {}) {
    super();
    this.validateToken(token);
    this.token = token;
    this.prefix = options.prefix || '/';
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.api = new REST(token);
    this.wsm = new WSM(token);
    this.messageManager = new MessageManager(this.api);
    this.commandManager = new CommandManager(
      {
        sendMessage: this.sendMessage.bind(this),
        deleteMessage: this.deleteMessage.bind(this),
      },
      this.getUser.bind(this)
    );
    this.middlewareManager = new MiddlewareManager();

    // Встановлюємо обробники подій для перепідключення
    this.wsm.on('close', () => {
      this.isReady = false;
      this.handleReconnect();
    });

    this.wsm.on('error', () => {
      this.isReady = false;
      this.handleReconnect();
    });
  }

  /**
   * Перевіряє токен на валідність
   * @private
   */
  private checkToken(): void {
    if (!this.token) throw new Error('Token is not set');
  }

  /**
   * Валідує формат токена Yurba
   * @private
   */
  private validateToken(token: string): void {
    if (!token || typeof token !== 'string') {
      throw new TokenValidationError('Token must be a non-empty string');
    }
    
    if (!token.startsWith('y.') || token.length < 34) {
      throw new TokenValidationError('Invalid Yurba token format. Token should start with "y." and be at least 34 characters long');
    }
  }

  /**
   * Getter для даних користувача бота
   * @returns {UserModel | undefined} Дані користувача або undefined, якщо не ініціалізовано
   */
  get user(): UserModel | undefined {
    return this._user;
  }

  /**
   * Реєструє нову команду
   * @param command Назва команди
   * @param argsSchema Схема аргументів команди
   * @param handler Обробник команди
   * 
   * @example
   * client.registerCommand('hello', { name: 'string' }, (message, args) => {
   *   console.log(`Hello, ${args.name}!`);
   * });
   * 
   * @example
   * client.registerCommand('add', { a: 'int', b: 'int' }, (message, args) => {
   *   const sum = args.a + args.b;
   *   message.reply(`The sum is ${sum}`);
   * });
   */
  registerCommand(command: string, argsSchema: CommandArgsSchema, handler: CommandHandler): void {
    this.commandManager.registerCommand(command, argsSchema, handler);
  }

  /**
   * Повертає список зареєстрованих команд
   * @returns {string[]} Масив назв команд
   * 
   * @example
   * const commands = client.getCommands();
   * console.log('Registered commands:', commands);
   * // Result: Registered commands: [ 'info', 'help' ]
   */
  public getCommands(): string[] {
    return this.commandManager.getCommands();
  }

  /**
   * Ініціалізує клієнт
   * @returns Promise, який вирішується після успішної ініціалізації
   */
  async init(): Promise<void> {
    this.checkToken();
    
    try {
      const user = await this.api.users.getMe();
      this._user = user; // Зберігаємо дані користувача

      log('User data:', user);

      this.wsm.on('ready', () => {
        this.isReady = true;
        this.reconnectAttempts = 0;
        this.emit('ready');
      });
      
      this.wsm.on('message', (message: Message) => this.handleMessage(message));
      
      await this.wsm.connect(user as UserModel);
    } catch (error) {
      erlog('Failed to initialize client:', error);
      throw new ApiRequestError(
        `Failed to initialize client: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        '/get_me'
      );
    }
  }

  /**
   * Обробляє перепідключення до WebSocket
   * @private
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      erlog('Maximum reconnect attempts reached');
      this.emit('reconnectFailed');
      return;
    }

    this.reconnectAttempts++;
    log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(async () => {
      try {
        if (this._user) {
          await this.wsm.connect(this._user as UserModel);
        } else {
          await this.init();
        }
      } catch (error) {
        const wsError = new WebSocketError(`Reconnect failed: ${error instanceof Error ? error.message : String(error)}`);
        erlog('Reconnect failed:', wsError);
        this.emit('reconnectError', wsError);
      }
    }, 5000 * Math.pow(2, this.reconnectAttempts - 1)); // Експоненціальна затримка
  }

  /**
   * Обробляє командні повідомлення
   * @param msg Об'єкт повідомлення
   * @private
   */
  private async handleCommandMessage(msg: Message['Message']): Promise<void> {
    try {
      await this.commandManager.handleCommand(msg, this.messageManager.enhanceMessage.bind(this.messageManager));
    } catch (err) {
      this.emit('commandError', { error: err, message: msg });
      if (err instanceof Error && err.message?.includes('not found')) {
        this.emit('unknownCommand', msg.Text, msg);
      }
    }
  }

  /**
   * Обробляє вхідні повідомлення
   * Делегує обробку повідомлень MessageManager та виконання команд CommandManager
   * Емітує події для інших обробників
   * @param message Об'єкт вхідного повідомлення
   * @private
   */
  private async handleMessage(message: Message): Promise<void> {
    try {
      // Виконуємо всі middleware
      await this.middlewareManager.execute(message).catch(err => {
        erlog('Middleware error:', err);
        this.emit('middlewareError', { error: err, message });
      });

      const { Type, Message: msg } = message;
      if (!msg) return;

      this.messageManager.enhanceMessage(msg);

      // Обробляємо команди
      if (Type === 'message' && msg.Text && msg.Text.startsWith(this.prefix)) {
        await this.handleCommandMessage(msg);
      }

      // Емітуємо подію з типом повідомлення
      this.emit(Type, msg);
      
      // Також емітуємо загальну подію 'message' для зручності
      if (Type === 'message') {
        this.emit('message', msg);
      }
    } catch (error) {
      erlog('Error handling message:', error);
      this.emit('error', error);
    }
  }

  /**
   * Чекає на певну подію та вирішується, коли функція перевірки повертає true
   *
   * @template T Тип аргументів, переданих події
   * @param event Назва події для прослуховування
   * @param check Функція, яка отримує аргументи події та повертає boolean,
   *              що вказує, чи виконана бажана умова
   * @param options Додаткові параметри:
   *   - `timeout`: Максимальний час очікування події в мілісекундах. За замовчуванням 60000.
   *   - `multiple`: Якщо true, вирішується з усіма аргументами як масивом; інакше вирішується з першим аргументом або повним масивом аргументів, якщо їх кілька.
   *   - `signal`: AbortSignal для скасування операції очікування.
   * @returns Promise, який вирішується з аргументами події, коли умова виконана,
   *          або відхиляється, якщо досягнуто таймаут або операцію скасовано.
   *
   * @example 1
   * // Чекати на повідомлення з текстом "Hello"
   * await client.waitFor('message', msg => msg.Text === 'Hello', { timeout: 5000 });
   *
   * @example 2
   * // Чекати на користувацьку подію та отримати всі аргументи
   * const [arg1, arg2] = await client.waitFor('customEvent', () => true, { multiple: true });
   */
  async waitFor<T extends any[] = any[]>(
    event: string,
    check: (...args: T) => boolean,
    options: {
      timeout?: number;
      multiple?: boolean;
      signal?: AbortSignal;
    } = {}
  ): Promise<any> {
    const { timeout = 60000, multiple = false, signal } = options;

    return new Promise<any>((resolve, reject) => {
      let finished = false;

      const cleanup = () => {
        finished = true;
        clearTimeout(timeoutId);
        this.off(event, listener);
        if (signal) signal.removeEventListener('abort', abortHandler);
      };

      const timeoutId = setTimeout(() => {
        if (!finished) {
          cleanup();
          reject(new Error(`Timeout waiting for event: ${event}`));
        }
      }, timeout);

      const abortHandler = () => {
        if (!finished) {
          cleanup();
          reject(new Error('Operation aborted'));
        }
      };

      if (signal) {
        if (signal.aborted) {
          cleanup();
          return reject(new Error('Operation aborted'));
        }
        signal.addEventListener('abort', abortHandler);
      }

      const listener = (...args: any[]) => {
        try {
          if (check(...args as T)) {
            cleanup();
            if (multiple) {
              resolve(args);
            } else {
              resolve(args.length === 1 ? args[0] : args);
            }
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      this.on(event, listener);
    });
  }

  /**
   * Відправляє повідомлення в діалог
   * @param dialogId ID діалогу
   * @param text Текст повідомлення
   * @param replyToId ID повідомлення, на яке відповідаємо (опціонально)
   * @param photos_list Список фото для прикріплення (опціонально)
   * @param attachments Список вкладень (опціонально)
   * @param edit ID повідомлення для редагування (опціонально)
   * @param repost Дані репосту (опціонально)
   * @returns Promise, який вирішується з даними відповіді
   */
  async sendMessage(
    dialogId: number,
    text: string,
    replyToId: number | null = null,
    photos_list: any[] | null = null,
    attachments: any[] | null = null,
    edit: number | null = null,
    repost: any = null
  ): Promise<Message> {
    try {
      log(`Sending message to dialog ${dialogId}: ${text}`);
      const response = await this.api.messages.send(
        dialogId,
        text,
        replyToId,
        photos_list,
        attachments,
        edit,
        repost
      );
      log(`Message sent to dialog ${dialogId}: ${text}`);
      return response;
    } catch (err) {
      if (err instanceof Error) {
        erlog('Error sending message:', err.message);
      }
      throw err;
    }
  }

  /**
   * Отримує інформацію про користувача за тегом
   * @param userTag Тег користувача
   * @returns Promise, який вирішується з даними користувача
   */
  async getUser(userTag: string): Promise<UserModel | null> {
    try {
      const response = await this.api.users.getByTag(userTag);
      log(`Fetched user ${userTag}`, response);
      return response;
    } catch (err) {
      erlog('Error getting user:', err instanceof Error ? err.message : err);
      return null;
    }
  }

  /**
   * Отримує фото з Yurba
   * @param photoId ID фото для отримання
   * @returns Promise, який вирішується з відповіддю API
   */
  async getPhoto(photoId: string): Promise<PhotoModel | null> {
    try {
      const response = await this.api.media.getPhoto(photoId);
      log(`Fetched photo ${photoId}`, response);
      return response;
    } catch (err) {
      erlog('Error getting photo:', err instanceof Error ? err.message : err);
      return null;
    }
  }

  /**
   * Видаляє повідомлення за його ID
   * @param ID ID повідомлення для видалення
   */
  async deleteMessage(ID: number): Promise<boolean> {
    try {
      await this.api.messages.delete(ID);
      return true;
    } catch (err) {
      erlog('Error deleting message:', err instanceof Error ? err.message : err);
      return false;
    }
  }

  /**
   * Додає слухача для вказаної події
   * @param event Назва або символ події
   * @param listener Функція зворотного виклику
   * @returns Екземпляр Client
   * @example
   * client.on('message', (msg) => {
   *   console.log('Received message:', msg);
   * });
   */
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  /**
   * Додає одноразового слухача для вказаної події
   * Слухач викликається лише наступного разу, коли подія спрацьовує, потім видаляється
   * @param event Назва або символ події
   * @param listener Функція зворотного виклику
   * @returns Екземпляр Client
   * @example
   * client.once('ready', () => {
   *   console.log('Bot is ready!');
   * });
   */
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  /**
   * Видаляє слухача для вказаної події
   * @param event Назва або символ події
   * @param listener Функція зворотного виклику для видалення
   * @returns Екземпляр Client
   * @example
   * const handler = (msg) => {};
   * client.on('message', handler);
   * client.off('message', handler);
   */
  off(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.off(event, listener);
  }

  /**
   * Емітує вказану подію з заданими аргументами
   * @internal
   * @param event Назва або символ події
   * @param args Аргументи для передачі слухачам подій
   * @returns True, якщо подія мала слухачів, false в іншому випадку
   * @example
   ```
    client.emit('customEvent', { foo: 'bar' });
   ```
   */
  emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  /**
   * Видаляє конкретного слухача з події
   * Аліас для off()
   * @param event Назва або символ події
   * @param listener Функція зворотного виклику для видалення
   * @returns Екземпляр Client
   */
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.removeListener(event, listener);
  }

  /**
   * Видаляє всіх слухачів або тих, що вказані для події
   * @param event Назва або символ події (опціонально)
   * @returns Екземпляр Client
   * @example
   * client.removeAllListeners('message');
   */
  removeAllListeners(event?: string | symbol): this {
    return super.removeAllListeners(event);
  }

  /**
   * Додає middleware функцію для виконання для кожного вхідного повідомлення
   * @param middleware Middleware функція
   * @param config Конфігурація middleware
   */
  use(middleware: MiddlewareFunction, config?: MiddlewareConfig): void {
    this.middlewareManager.use(middleware, config);
  }

  /**
   * Видаляє middleware за назвою
   * @param name Назва middleware
   */
  removeMiddleware(name: string): boolean {
    return this.middlewareManager.remove(name);
  }

  /**
   * Отримує список всіх middleware
   */
  getMiddlewares(): MiddlewareConfig[] {
    return this.middlewareManager.list();
  }
}

const Version = pkg.version;
const Author = pkg.author;

export { Client, Dev, Logger, Version, Author };
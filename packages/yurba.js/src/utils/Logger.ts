/**
 * Рівні логування
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * Опції логера
 */
export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  useColors?: boolean;
  timestamp?: boolean;
  logToFile?: boolean;
  logFilePath?: string;
  enabled?: boolean; // Додано новий параметр для вмикання/вимикання логера
}

/**
 * Клас для логування повідомлень
 */
export default class Logger {
  private level: LogLevel;
  private prefix: string;
  private useColors: boolean;
  private timestamp: boolean;
  private logToFile: boolean;
  private logFilePath: string;
  private enabled: boolean; // Додано нове поле

  /**
   * Створює новий логер
   * @param prefix Префікс для повідомлень
   * @param options Опції логера
   */
  constructor(prefix: string = '', options: LoggerOptions = {}) {
    this.prefix = prefix;
    this.level = options.level ?? LogLevel.INFO;
    this.useColors = options.useColors ?? true;
    this.timestamp = options.timestamp ?? true;
    this.logToFile = options.logToFile ?? false;
    this.logFilePath = options.logFilePath ?? './logs/app.log';
    this.enabled = options.enabled ?? true; // Ініціалізація нового поля
  }

  /**
   * Встановлює рівень логування
   * @param level Рівень логування
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Вмикає або вимикає логер
   * @param enabled true - для ввімкнення, false - для вимкнення
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Перевіряє чи ввімкнений логер
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Логує повідомлення на рівні DEBUG
   * @param args Аргументи для логування
   */
  debug(...args: any[]): void {
    if (!this.enabled) return;
    this.log(LogLevel.DEBUG, 'DEBUG', '\x1b[36m', ...args);
  }

  /**
   * Логує повідомлення на рівні INFO
   * @param args Аргументи для логування
   */
  info(...args: any[]): void {
    if (!this.enabled) return;
    this.log(LogLevel.INFO, 'INFO', '\x1b[32m', ...args);
  }

  /**
   * Логує повідомлення на рівні WARN
   * @param args Аргументи для логування
   */
  warn(...args: any[]): void {
    if (!this.enabled) return;
    this.log(LogLevel.WARN, 'WARN', '\x1b[33m', ...args);
  }

  /**
   * Логує повідомлення на рівні ERROR
   * @param args Аргументи для логування
   */
  error(...args: any[]): void {
    if (!this.enabled) return;
    this.log(LogLevel.ERROR, 'ERROR', '\x1b[31m', ...args);
  }

  /**
   * Внутрішній метод для логування
   * @param level Рівень логування
   * @param levelName Назва рівня
   * @param color Колір для консолі
   * @param args Аргументи для логування
   * @private
   */
  private log(level: LogLevel, levelName: string, color: string, ...args: any[]): void {
    if (level < this.level) return;

    const now = new Date();
    const timeStr = this.timestamp ? `[${now.toISOString()}] ` : '';
    const prefixStr = this.prefix ? `[${this.prefix}] ` : '';
    const levelStr = `[${levelName}] `;

    if (this.useColors) {
      console.log(`${timeStr}${color}${prefixStr}${levelStr}\x1b[0m`, ...args);
    } else {
      console.log(`${timeStr}${prefixStr}${levelStr}`, ...args);
    }

    if (this.logToFile) {
      this.writeToFile(`${now.toISOString()} ${levelName} ${this.prefix} ${args.join(' ')}\n`);
    }
  }

  /**
   * Записує лог у файл
   * @param message Повідомлення для запису
   * @private
   */
  private writeToFile(message: string): void {
    try {
      if (typeof window !== 'undefined') {
        const logs = localStorage.getItem('yurba_logs') || '';
        localStorage.setItem('yurba_logs', logs + message);
      }
      else if (typeof require !== 'undefined') {
        const fs = require('fs');
        const path = require('path');
        const dir = path.dirname(this.logFilePath);
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.appendFileSync(this.logFilePath, message);
      }
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }
}

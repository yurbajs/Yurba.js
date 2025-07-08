import { Message, CommandArgsSchema, CommandHandler } from '../core';

export interface IMessageManager {
  enhanceMessage(message: Message['Message']): void;
}

export interface ICommandManager {
  registerCommand(command: string, argsSchema: CommandArgsSchema, handler: CommandHandler, description?: string): void;
  handleCommand(message: Message['Message'], enhanceMessage: (msg: Message['Message']) => void): Promise<void>;
  getCommands(): string[];
  removeCommand(command: string): boolean;
  addAlias(alias: string, command: string): void;
  setCooldown(command: string, userId: number, cooldownMs: number): void;
  checkCooldown(command: string, userId: number): number;
}

export interface IWebSocketManager {
  connect(botData: any): Promise<void>;
  subscribeToEvents(category: string, thingId: number): void;
  unsubscribeFromEvents(category: string, thingId: number): void;
  close(): void;
  isConnected(): boolean;
}

export interface ClientOptions {
  prefix?: string;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  debug?: boolean;
}

export interface MiddlewareConfig {
  name: string;
  priority?: number;
  enabled?: boolean;
}

export type MiddlewareFunction = (message: Message) => Promise<void>;

export interface IMiddlewareManager {
  use(middleware: MiddlewareFunction, config?: MiddlewareConfig): void;
  remove(name: string): boolean;
  execute(message: Message): Promise<void>;
  list(): MiddlewareConfig[];
}
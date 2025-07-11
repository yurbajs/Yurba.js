import { CommandArgsSchema, CommandHandler, Message, ICommandManager } from "@yurbajs/types";
import Logger from "../utils/Logger";
import { CommandError } from "@yurbajs/types";

const logging = new Logger("CommandManager");

/**
 * Менеджер команд для клієнта
 */
export default class CommandManager implements ICommandManager {
  private commands: Map<
    string,
    {
      handler: CommandHandler;
      argsSchema: CommandArgsSchema;
      description?: string;
    }
  >;
  private api: {
    sendMessage: (...args: any[]) => Promise<any>;
    deleteMessage: (id: number) => Promise<any>;
  };
  private getUser: (userTag: string) => Promise<any>;
  private aliases: Map<string, string> = new Map();
  private cooldowns: Map<string, Map<number, number>> = new Map();

  /**
   * Створює новий менеджер команд
   * @param api Об'єкт з методами API
   * @param getUser Функція для отримання користувача
   */
  constructor(
    api: {
      sendMessage: (...args: any[]) => Promise<any>;
      deleteMessage: (id: number) => Promise<any>;
    },
    getUser: (userTag: string) => Promise<any>
  ) {
    this.commands = new Map();
    this.api = api;
    this.getUser = getUser;
  }

  /**
   * Реєструє нову команду
   * @param command Назва команди
   * @param argsSchema Схема аргументів команди
   * @param handler Обробник команди
   * @param description Опис команди (опціонально)
   */
  registerCommand(
    command: string,
    argsSchema: CommandArgsSchema,
    handler: CommandHandler,
    description?: string
  ): void {
    if (!command || typeof command !== "string" || !command.trim()) {
      throw new Error("Command name is required");
    }
    if (this.commands.has(command)) {
      throw new Error(`Command "${command}" is already registered.`);
    }
    this.commands.set(command, { handler, argsSchema, description });
    logging.info(`Registered command: ${command}`);
  }

  /**
   * Додає аліас для команди
   * @param alias Аліас команди
   * @param command Оригінальна команда
   */
  addAlias(alias: string, command: string): void {
    if (!this.commands.has(command)) {
      throw new Error(`Cannot add alias for non-existent command "${command}"`);
    }
    this.aliases.set(alias, command);
    logging.info(`Added alias "${alias}" for command "${command}"`);
  }

  /**
   * Встановлює кулдаун для команди
   * @param command Назва команди
   * @param userId ID користувача
   * @param cooldownMs Час кулдауну в мілісекундах
   */
  setCooldown(command: string, userId: number, cooldownMs: number): void {
    if (!this.cooldowns.has(command)) {
      this.cooldowns.set(command, new Map());
    }
    this.cooldowns.get(command)?.set(userId, Date.now() + cooldownMs);
  }

  /**
   * Перевіряє, чи команда на кулдауні для користувача
   * @param command Назва команди
   * @param userId ID користувача
   * @returns Час до закінчення кулдауну в мілісекундах або 0, якщо кулдаун закінчився
   */
  checkCooldown(command: string, userId: number): number {
    if (!this.cooldowns.has(command)) {
      return 0;
    }

    const userCooldowns = this.cooldowns.get(command);
    if (!userCooldowns || !userCooldowns.has(userId)) {
      return 0;
    }

    const expirationTime = userCooldowns.get(userId) || 0;
    const now = Date.now();

    if (now < expirationTime) {
      return expirationTime - now;
    }

    userCooldowns.delete(userId);
    return 0;
  }

  /**
   * Головний метод для обробки команд
   * @param message Об'єкт повідомлення
   * @param enhanceMessage Функція для розширення повідомлення
   */
  async handleCommand(
    message: Message["Message"],
    enhanceMessage: (msg: Message["Message"]) => void
  ): Promise<void> {
    enhanceMessage(message);

    const { Text, Author } = message;
    if (!Text || !Author) {
      throw new Error("Invalid message: missing Text or Author");
    }

    const [commandName, ...args] = Text.slice(1).split(" ");

    // Перевіряємо оригінальну команду або аліас
    let actualCommand = commandName;
    if (this.aliases.has(commandName)) {
      actualCommand = this.aliases.get(commandName) || commandName;
    }

    if (!this.commands.has(actualCommand)) {
      throw new Error(`Command "${commandName}" not found.`);
    }

    // Перевіряємо кулдаун
    const cooldownTime = this.checkCooldown(actualCommand, Author.ID);
    if (cooldownTime > 0) {
      const secondsLeft = Math.ceil(cooldownTime / 1000);
      throw new Error(
        `Command "${commandName}" is on cooldown. Please wait ${secondsLeft} seconds.`
      );
    }

    const { handler, argsSchema } = this.commands.get(actualCommand)!;

    try {
      const parsedArgs = await this.parseArgs([...args], argsSchema, message);
      if (!parsedArgs) {
        throw new Error("Invalid arguments for the command.");
      }

      logging.debug(
        `Executing command "${actualCommand}" with args:`,
        parsedArgs
      );
      await handler(message, parsedArgs as any);
    } catch (error) {
      logging.error(`Error executing command "${actualCommand}":`, error);
      throw error;
    }
  }

  /**
   * Парсинг аргументів з підтримкою типів string, int, user, repost
   * @param args Масив аргументів
   * @param argsSchema Схема аргументів
   * @param message Об'єкт повідомлення
   * @returns Об'єкт з розпарсеними аргументами
   */
  async parseArgs<T extends Record<string, unknown>>(
    args: string[],
    argsSchema: CommandArgsSchema,
    message: Message["Message"]
  ): Promise<T> {
    const parsedArgs: Record<string, unknown> = {};

    for (const [argName, argConfig] of Object.entries(argsSchema)) {
      let type: string,
        required = true,
        defaultValue: any,
        captureRest = false;

      if (typeof argConfig === "string") {
        type = argConfig;
        defaultValue = null;
      } else if (Array.isArray(argConfig)) {
        type = argConfig[0];
        if (argConfig.length >= 3 && argConfig[2] === "rest") {
          captureRest = true;
        }
        if (argConfig.length >= 2) {
          required = argConfig[1] !== false;
          defaultValue = argConfig[1] === false ? null : argConfig[1];
        }
      } else {
        type = argConfig.type;
        required = argConfig.required ?? true;
        defaultValue = argConfig.default ?? null;
        captureRest = argConfig.rest === true;
      }

      let argValue: string | undefined;
      if (captureRest) {
        argValue = args.join(" ");
        args = [];
      } else {
        argValue = args.shift();
      }

      if (argValue === undefined) {
        if (required) {
          throw new CommandError(`Missing required argument: ${argName}`, 'parseArgs');
        } else {
          // Якщо аргумент необов'язковий, використовуємо значення за замовчуванням
          if (type === "user" && defaultValue && this.getUser) {
            try {
              const user = await this.getUser(defaultValue);
              parsedArgs[argName] = user;
            } catch (error) {
              logging.error(`Default user "${defaultValue}" not found:`, error);
              throw new CommandError(`Default user "${defaultValue}" not found.`, 'parseArgs');
            }
          } else {
            parsedArgs[argName] = defaultValue;
          }
          continue;
        }
      }

      switch (type) {
        case "string":
          parsedArgs[argName] = argValue;
          break;
        case "int": {
          const intValue = parseInt(argValue, 10);
          if (isNaN(intValue)) {
            throw new CommandError(`Argument "${argName}" must be an integer.`, 'parseArgs');
          }
          parsedArgs[argName] = intValue;
          break;
        }
        case "float": {
          const floatValue = parseFloat(argValue);
          if (isNaN(floatValue)) {
            throw new CommandError(`Argument "${argName}" must be a number.`, 'parseArgs');
          }
          parsedArgs[argName] = floatValue;
          break;
        }
        case "boolean": {
          const lowerValue = argValue.toLowerCase();
          if (["true", "yes", "1", "y"].includes(lowerValue)) {
            parsedArgs[argName] = true;
          } else if (["false", "no", "0", "n"].includes(lowerValue)) {
            parsedArgs[argName] = false;
          } else {
            throw new CommandError(
              `Argument "${argName}" must be a boolean (true/false, yes/no, 1/0, y/n).`,
              'parseArgs'
            );
          }
          break;
        }
        case "user": {
          if (!this.getUser) throw new CommandError("getUser function not provided", 'parseArgs');
          const userTag = argValue.startsWith("@")
            ? argValue.slice(1)
            : argValue;
          try {
            const user = await this.getUser(userTag);
            if (!user) {
              throw new CommandError(`User "${argValue}" not found.`, 'parseArgs');
            }
            parsedArgs[argName] = user;
          } catch (error) {
            logging.error(`Error getting user "${argValue}":`, error);
            throw new CommandError(`User "${argValue}" not found.`, 'parseArgs');
          }
          break;
        }
        case "repost":
          if (message.Repost?.ID) {
            parsedArgs[argName] = message.Repost;
          } else {
            throw new CommandError("Repost is required but not found.", 'parseArgs');
          }
          break;
        default:
          throw new CommandError(`Unknown argument type: ${type}`, 'parseArgs');
      }
    }

    return parsedArgs as T;
  }

  /**
   * Повертає список зареєстрованих команд
   * @returns Масив назв команд
   */
  public getCommands(): string[] {
    return Array.from(this.commands.keys());
  }

  /**
   * Повертає інформацію про команду
   * @param command Назва команди
   * @returns Об'єкт з інформацією про команду або undefined, якщо команда не знайдена
   */
  public getCommandInfo(
    command: string
  ): { argsSchema: CommandArgsSchema; description?: string } | undefined {
    const commandInfo = this.commands.get(command);
    if (!commandInfo) return undefined;

    return {
      argsSchema: commandInfo.argsSchema,
      description: commandInfo.description,
    };
  }

  /**
   * Видаляє команду
   * @param command Назва команди
   * @returns true, якщо команда була видалена, false в іншому випадку
   */
  public removeCommand(command: string): boolean {
    const result = this.commands.delete(command);

    // Видаляємо всі аліаси для цієї команди
    for (const [alias, cmd] of this.aliases.entries()) {
      if (cmd === command) {
        this.aliases.delete(alias);
      }
    }

    return result;
  }
}

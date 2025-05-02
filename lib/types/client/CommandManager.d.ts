import { CommandArgsSchema, CommandHandler, Message } from '../types';
/**
 * Менеджер команд для клієнта.
 */
export default class CommandManager {
    private commands;
    private api;
    private getUser;
    constructor(api: {
        sendMessage: (...args: any[]) => Promise<any>;
        deleteMessage: (id: number) => Promise<any>;
    }, getUser: (userTag: string) => Promise<any>);
    /**
     * Реєструє нову команду.
     */
    registerCommand(command: string, argsSchema: CommandArgsSchema, handler: CommandHandler): void;
    /**
     * Головний метод для обробки команд.
     */
    handleCommand(message: Message['Message'], enhanceMessage: (msg: Message['Message']) => void): Promise<void>;
    /**
     * Парсинг аргументів з підтримкою типів string, int, user, repost.
     */
    parseArgs(args: string[], argsSchema: CommandArgsSchema, message: Message['Message']): Promise<any>;
    getCommands(): string[];
}
//# sourceMappingURL=CommandManager.d.ts.map
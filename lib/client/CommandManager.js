"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Менеджер команд для клієнта.
 */
class CommandManager {
    constructor(api, getUser) {
        this.commands = new Map();
        this.api = api;
        this.getUser = getUser;
    }
    /**
     * Реєструє нову команду.
     */
    registerCommand(command, argsSchema, handler) {
        if (this.commands.has(command)) {
            throw new Error(`Command "${command}" is already registered.`);
        }
        this.commands.set(command, { handler, argsSchema });
    }
    /**
     * Головний метод для обробки команд.
     */
    async handleCommand(message, enhanceMessage) {
        enhanceMessage(message);
        const { Text } = message;
        const [command, ...args] = Text.slice(1).split(' ');
        if (!this.commands.has(command)) {
            throw new Error(`Command "${command}" not found.`);
        }
        const { handler, argsSchema } = this.commands.get(command);
        const parsedArgs = await this.parseArgs([...args], argsSchema, message);
        if (!parsedArgs) {
            throw new Error('Invalid arguments for the command.');
        }
        await handler(message, parsedArgs);
    }
    /**
     * Парсинг аргументів з підтримкою типів string, int, user, repost.
     */
    async parseArgs(args, argsSchema, message) {
        const parsedArgs = {};
        for (const [argName, argConfig] of Object.entries(argsSchema)) {
            let type, required = true, defaultValue, captureRest = false;
            if (typeof argConfig === 'string') {
                type = argConfig;
                defaultValue = null;
            }
            else if (Array.isArray(argConfig)) {
                type = argConfig[0];
                if (argConfig.length >= 3 && argConfig[2] === 'rest') {
                    captureRest = true;
                }
                if (argConfig.length === 2) {
                    required = argConfig[1] !== false;
                    defaultValue = argConfig[1] === false ? null : argConfig[1];
                }
            }
            else {
                type = argConfig.type;
                required = argConfig.required ?? true;
                defaultValue = argConfig.default ?? null;
                captureRest = argConfig.rest === true;
            }
            let argValue;
            if (captureRest) {
                argValue = args.join(' ');
                args = [];
            }
            else {
                argValue = args.shift();
            }
            if (argValue === undefined) {
                if (required) {
                    throw new Error(`Missing required argument: ${argName}`);
                }
                else {
                    // Якщо аргумент необов'язковий, використовуємо значення за замовчуванням
                    if (type === 'user' && defaultValue && this.getUser) {
                        try {
                            const user = await this.getUser(defaultValue);
                            parsedArgs[argName] = user;
                        }
                        catch {
                            throw new Error(`Default user "${defaultValue}" not found.`);
                        }
                    }
                    else {
                        parsedArgs[argName] = defaultValue;
                    }
                    continue;
                }
            }
            switch (type) {
                case 'string':
                    parsedArgs[argName] = argValue;
                    break;
                case 'int':
                    const intValue = parseInt(argValue, 10);
                    if (isNaN(intValue)) {
                        throw new Error(`Argument "${argName}" must be an integer.`);
                    }
                    parsedArgs[argName] = intValue;
                    break;
                case 'user':
                    if (!this.getUser)
                        throw new Error('getUser function not provided');
                    const userTag = argValue.startsWith('@') ? argValue.slice(1) : argValue;
                    try {
                        const user = await this.getUser(userTag);
                        parsedArgs[argName] = user;
                    }
                    catch {
                        throw new Error(`User "${argValue}" not found.`);
                    }
                    break;
                case 'repost':
                    if (message.Repost?.ID) {
                        parsedArgs[argName] = message.Repost;
                    }
                    else {
                        throw new Error('Repost is required but not found.');
                    }
                    break;
                default:
                    throw new Error(`Unknown argument type: ${type}`);
            }
        }
        return parsedArgs;
    }
    getCommands() {
        return Array.from(this.commands.keys());
    }
}
exports.default = CommandManager;

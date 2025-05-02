"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = exports.Version = exports.Logger = exports.Dev = exports.Client = void 0;
const Apis_1 = __importDefault(require("../rest/Apis"));
const events_1 = require("events");
const pkg = __importStar(require("../../package.json"));
const Logger_1 = __importDefault(require("../utils/Logger"));
exports.Logger = Logger_1.default;
const WebsocketManager_1 = __importDefault(require("./WebsocketManager"));
const MessageManager_1 = __importDefault(require("./MessageManager"));
const CommandManager_1 = __importDefault(require("./CommandManager"));
const logging = new Logger_1.default('DEV');
const Dev = {
    debug: true,
};
exports.Dev = Dev;
const log = (...args) => {
    if (Dev.debug) {
        logging.debug('\n', ...args, '\n');
    }
};
const erlog = (...args) => {
    logging.error('\n', ...args, '\n');
};
// Клас Client
class Client extends events_1.EventEmitter {
    constructor(token, prefix = '/') {
        super();
        this.middlewares = [];
        this.token = token;
        this.prefix = prefix;
        this.api = new Apis_1.default(token);
        this.wsm = new WebsocketManager_1.default(token);
        this.messageManager = new MessageManager_1.default(this.api);
        this.commandManager = new CommandManager_1.default({
            sendMessage: this.sendMessage.bind(this),
            deleteMessage: this.deleteMessage.bind(this),
        }, this.getUser.bind(this));
    }
    checkToken() {
        if (!this.token)
            throw new Error('Token is not set');
    }
    /**
     * Getter for bot's user data (user info)
     * @returns {UserModel | undefined} The user data or undefined if not initialized.
     */
    get user() {
        return this._user;
    }
    /**
     * Registers a new command.
     * @param command The name of the command.
     * @param argsSchema The schema of the command's arguments.
     * @param handler The handler of the command.
     *
     * @example
     * client.registerCommand('hello', { name: 'string' }, (message, args) => {
     *   console.log(`Hello, ${args.name}!`);
     * });
     *
     * @example
     * client.registerCommand('add', { a: 'int', b: 'int' }, (message, args) => {
     *   const sum = args.a + args.b;
     *   messege.reply(`The sum is ${sum}`);
     * });
     */
    registerCommand(command, argsSchema, handler) {
        this.commandManager.registerCommand(command, argsSchema, handler);
    }
    /**
     * Returns the list of registered command names.
     * @returns {string[]} Array of command names.
     *
     * @example
     * const commands = client.getCommands();
     * console.log('Registered commands:', commands);
     * // Result: Registered commands: [ 'info', 'help' ]
     */
    getCommands() {
        return this.commandManager.getCommands();
    }
    async init() {
        const user = await this.api.getMe();
        this._user = user; // Save user in a private field
        log('User data:', user);
        this.wsm.on('ready', () => this.emit('ready'));
        this.wsm.on('message', (message) => this.handleMessage(message));
        await this.wsm.connect(user);
    }
    /**
     * Handles command messages.
     * @param msg The message object.
     */
    async handleCommandMessage(msg) {
        try {
            await this.commandManager.handleCommand(msg, this.messageManager.enhanceMessage.bind(this.messageManager));
        }
        catch (err) {
            this.emit('commandError', { error: err, message: msg });
            if (err instanceof Error && err.message?.includes('not found')) {
                this.emit('uknownCommand', msg.Text, msg);
            }
        }
    }
    /**
     * Handles incoming messages.
     * Delegates message processing to MessageManager and command execution to CommandManager.
     * Emits events for other handlers.
     * @param message The incoming message object.
     */
    async handleMessage(message) {
        for (const mw of this.middlewares)
            await mw(message);
        const { Type, Message: msg } = message;
        if (!msg)
            return;
        this.messageManager.enhanceMessage(msg);
        if (Type === 'message' && msg.Text.startsWith(this.prefix)) {
            await this.handleCommandMessage(msg);
        }
        this.emit(Type, msg);
    }
    /**
     * Waits for a specific event to occur and resolves when a check function returns true.
     *
     * @template T The type of arguments passed to the event.
     * @param event The event name to listen for.
     * @param check A function that receives the event arguments and returns a boolean
     *              indicating if the desired condition is met.
     * @param options Optional parameters:
     *   - `timeout`: Maximum time in milliseconds to wait for the event before rejecting. Default is 60000.
     *   - `multiple`: If true, resolves with all arguments as an array; otherwise, resolves with the first argument or the full args array if there are several.
     *   - `once`: If true, removes the listener after the first match. Default is true.
     *   - `signal`: An AbortSignal to cancel the wait operation.
     * @returns A promise that resolves with the event arguments when the condition is met,
     *          or rejects if the timeout is reached or the operation is aborted.
     *
     * @example 1
     * // Wait for a message with text "Hello"
     * await client.waitFor('message', msg => msg.Text === 'Hello', { timeout: 5000 });
     *
     * @example 2
     * // Wait for a custom event and get all arguments
     * const [arg1, arg2] = await client.waitFor('customEvent', () => true, { multiple: true });
     */
    async waitFor(event, check, options = {}) {
        const { timeout = 60000, multiple = false, signal } = options;
        return new Promise((resolve, reject) => {
            let finished = false;
            const cleanup = () => {
                finished = true;
                clearTimeout(timeoutId);
                this.off(event, listener);
                if (signal)
                    signal.removeEventListener('abort', abortHandler);
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
            const listener = (...args) => {
                try {
                    if (check(...args)) {
                        cleanup();
                        if (multiple) {
                            resolve(args);
                        }
                        else {
                            resolve(args.length === 1 ? args[0] : args);
                        }
                    }
                }
                catch (error) {
                    cleanup();
                    reject(error);
                }
            };
            this.on(event, listener);
        });
    }
    /**
     * Sends a message to a dialog.
     * @async
     * @param dialogId The ID of the dialog.
     * @param text The message text.
     * @param replyToId The ID of the message to reply to (optional).
     * @param photos_list List of photos to attach (optional).
     * @param attachments List of attachments (optional).
     * @param edit ID of the message to edit (optional).
     * @param repost Repost data (optional).
     * @returns A promise that resolves with the response data.
     */
    async sendMessage(dialogId, text, replyToId = null, photos_list = null, attachments = null, edit = null, repost = null) {
        try {
            log(`Sending message to dialog ${dialogId}: ${text}`);
            const response = await this.api.sendMessage(dialogId, text, replyToId, photos_list, attachments, edit, repost);
            log(`Message sent to dialog ${dialogId}: ${text}`);
            return response;
        }
        catch (err) {
            if (err instanceof Error) {
                erlog('Error sending message:', err.message);
            }
            throw err;
        }
    }
    /**
     * Gets user information by user tag.
     * @async
     * @param userTag The user's tag.
     * @returns A promise that resolves with the user data.
     */
    async getUser(userTag) {
        try {
            const response = await this.api.getUser(userTag);
            log(`Fetched user ${userTag}\n`, response);
            return response;
        }
        catch (err) {
            erlog('Error getting user:', err instanceof Error ? err.message : err);
            return null;
        }
    }
    /**
     * Gets a photo from Yurba.
     * @async
     * @param photoId The ID of the photo to get.
     * @returns A promise that resolves with the response of the API.
     */
    async getPhoto(photoId) {
        try {
            const response = await this.api.getPhoto(photoId);
            log(`Fetched photo ${photoId}\n`, response);
            return response;
        }
        catch (err) {
            erlog('Error getting photo:', err instanceof Error ? err.message : err);
            return null;
        }
    }
    /**
     * Deletes a message by its ID.
     * @async
     * @param ID The ID of the message to delete.
     */
    async deleteMessage(ID) {
        try {
            await this.api.deleteMessage(ID);
            return true;
        }
        catch (err) {
            erlog('Error deleting message:', err instanceof Error ? err.message : err);
            return false;
        }
    }
    /**
     * Adds a listener for the specified event.
     * @param event The event name or symbol.
     * @param listener The callback function.
     * @returns The Client instance.
     * @example
     * client.on('message', (msg) => {
     *   console.log('Received message:', msg);
     * });
     */
    on(event, listener) {
        return super.on(event, listener);
    }
    /**
     * Adds a one-time listener for the specified event.
     * The listener is invoked only the next time the event is fired, then removed.
     * @param event The event name or symbol.
     * @param listener The callback function.
     * @returns The Client instance.
     * @example
     * client.once('ready', () => {
     *   console.log('Bot is ready!');
     * });
     */
    once(event, listener) {
        return super.once(event, listener);
    }
    /**
     * Removes a listener for the specified event.
     * @param event The event name or symbol.
     * @param listener The callback function to remove.
     * @returns The Client instance.
     * @example
     * const handler = (msg) => {};
     * client.on('message', handler);
     * client.off('message', handler);
     */
    off(event, listener) {
        return super.off(event, listener);
    }
    /**
     * Emits the specified event with the given arguments.
     * @internal
     * @param event The event name or symbol.
     * @param args Arguments to pass to event listeners.
     * @returns True if the event had listeners, false otherwise.
     * @example
     ```
      client.emit('customEvent', { foo: 'bar' });
     ```
     */
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    /**
     * Removes a specific listener from the event.
     * Alias for off().
     * @param event The event name or symbol.
     * @param listener The callback function to remove.
     * @returns The Client instance.
     */
    removeListener(event, listener) {
        return super.removeListener(event, listener);
    }
    /**
     * Removes all listeners, or those of the specified event.
     * @param event The event name or symbol (optional).
     * @returns The Client instance.
     * @example
     * client.removeAllListeners('message');
     */
    removeAllListeners(event) {
        return super.removeAllListeners(event);
    }
    /**
     * Adds a middleware function to be executed for each incoming message.
     * @param middleware The middleware function.
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }
}
exports.Client = Client;
const Version = pkg.version;
exports.Version = Version;
const Author = pkg.author;
exports.Author = Author;

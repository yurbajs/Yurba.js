"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ReconnectingWebSocket_1 = __importDefault(require("./ReconnectingWebSocket"));
const Apis_1 = __importDefault(require("./Apis"));
const events_1 = require("events");
const package_json_1 = __importDefault(require("../package.json"));
const logs_1 = __importDefault(require("./utils/logs"));
const logging = new logs_1.default('DEV');
const Dev = {
    debug: false,
};
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
    /**
     * Constructs a new Client instance.
     *
     * @param token - The token used for authentication.
     * @param prefix - The prefix used for commands, defaults to '/'.
     *
     * Initializes the WebSocket connection, command map, and API interface.
     * Sets up Yurba CLI client information based on package metadata.
     * Logs initialization details if in developer mode.
     */
    constructor(token, prefix = '/') {
        super();
        this.token = token;
        this.prefix = prefix;
        this.ws = null;
        this.commands = new Map();
        this.isReady = false;
        this.api = new Apis_1.default(this.token);
        this.yurbacli = {
            version: package_json_1.default.version,
            author: package_json_1.default.author,
            description: package_json_1.default.description,
            repository: package_json_1.default.repository.url,
        };
        if (Dev.debug) {
            logging.info(`Yurba-cli Developer mode is enabled\n- Version: ${package_json_1.default.version}\n- Author: ${package_json_1.default.author}\n- Description: ${package_json_1.default.description}\n- Repository: ${package_json_1.default.repository.url}\n`);
        }
        log(`Client initialized with token: ${this.token}`);
    }
    /**
     * Initializes the client.
     *
     * Checks for the presence of the bot token.
     * If present, fetches the bot's data and stores it globally.
     * Sets up the WebSocket connection and subscribes to events.
     * Emits a 'ready' event when the WebSocket connection is established.
     * Logs initialization-related messages if in developer mode.
     *
     * @returns A promise that resolves when initialization is complete.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                erlog('Bot token is missing!');
                process.exit(1);
            }
            try {
                const botData = yield this.getMe();
                log('Bot data fetched:', botData);
                globalThis.botData = botData;
                this.ws = new ReconnectingWebSocket_1.default(`wss://api.yurba.one/ws?token=${this.token}`);
                this.ws.on('open', () => {
                    log('WebSocket opened, subscribing to events...');
                    this.subscribeToEvents('dialog', botData.ID);
                    if (!this.isReady) {
                        this.emit('ready');
                        this.isReady = true;
                    }
                });
                this.ws.on('message', (data) => {
                    log('WebSocket received a message:', data);
                    const message = JSON.parse(data);
                    this.handleMessage(message);
                });
                this.ws.on('close', () => {
                    log('WebSocket connection closed.');
                });
                this.ws.on('error', (err) => {
                    erlog('WebSocket error:', err);
                });
                yield this.waitForWebSocketOpen(this.ws);
            }
            catch (err) {
                if (err instanceof Error) {
                    erlog('Initialization error:', err.message);
                }
                process.exit(1);
            }
        });
    }
    getMe() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                token: this.token,
            };
            try {
                log('Fetching bot data...');
                const response = yield axios_1.default.get('https://api.yurba.one/get_me', { headers });
                if (response.status !== 200) {
                    erlog(`Failed to get bot data, status code: ${response.status}`);
                    throw new Error(`Failed to get bot data, status code: ${response.status}`);
                }
                log('Bot data successfully fetched.');
                return response.data;
            }
            catch (error) {
                if (error instanceof Error && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    erlog('Invalid token or unauthorized access. Please check your token.');
                    process.exit(1);
                }
                else if (error instanceof Error) {
                    erlog('Error fetching bot data:', error.message);
                    process.exit(1);
                }
                throw error;
            }
        });
    }
    subscribeToEvents(category, thing_id) {
        var _a;
        const subscribeData = {
            command: 'subscribe',
            category,
            thing_id,
        };
        log(`Subscribing to events for category: ${category}, thing_id: ${thing_id}`);
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(subscribeData));
    }
    waitForWebSocketOpen(websocket) {
        return new Promise((resolve, reject) => {
            if (websocket.readyState === WebSocket.OPEN) {
                log('WebSocket already open, resolving...');
                resolve();
            }
            else if (websocket.readyState === WebSocket.CLOSED) {
                erlog('WebSocket is closed, rejecting...');
                reject(new Error('WebSocket is closed'));
            }
            else {
                log('Waiting for WebSocket to open...');
                websocket.on('open', resolve);
                websocket.on('error', reject);
            }
        });
    }
    /**
     * Waits for a specific event to occur and resolves when a check function returns true.
     *
     * @param event - The event name to listen for.
     * @param check - A function that receives the event arguments and returns a boolean
     *                indicating if the desired condition is met.
     * @param options - Optional parameters to control the behavior of the wait:
     *   - `timeout`: Maximum time in milliseconds to wait for the event before rejecting. Default is 60000.
     *   - `multiple`: If true, resolve with all arguments; otherwise, resolve with the first or the full args array if multiple.
     *   - `once`: If true, remove the listener after the first match. Default is true.
     *   - `signal`: An AbortSignal to cancel the wait operation.
     * @returns A promise that resolves with the event arguments when the condition is met,
     *          or rejects if the timeout is reached or the operation is aborted.
     */
    waitFor(event_1, check_1) {
        return __awaiter(this, arguments, void 0, function* (event, check, options = {}) {
            const { timeout = 60000, multiple = false, once = true, signal } = options;
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    this.removeListener(event, listener);
                    reject(new Error(`Timeout waiting for event: ${event}`));
                }, timeout);
                // Обробник для скасування через AbortSignal
                const abortHandler = () => {
                    clearTimeout(timeoutId);
                    this.removeListener(event, listener);
                    reject(new Error('Operation aborted'));
                };
                if (signal) {
                    if (signal.aborted) {
                        return reject(new Error('Operation aborted'));
                    }
                    signal.addEventListener('abort', abortHandler);
                }
                const listener = (...args) => {
                    try {
                        if (check(...args)) {
                            clearTimeout(timeoutId);
                            if (signal) {
                                signal.removeEventListener('abort', abortHandler);
                            }
                            if (once) {
                                this.removeListener(event, listener);
                            }
                            // Якщо multiple === true – повертаємо усі аргументи,
                            // інакше, якщо args.length === 1 повертаємо перший аргумент,
                            // або весь масив, якщо їх декілька
                            if (multiple) {
                                resolve(args);
                            }
                            else {
                                resolve(args.length === 1 ? args[0] : args);
                            }
                        }
                    }
                    catch (error) {
                        clearTimeout(timeoutId);
                        if (signal) {
                            signal.removeEventListener('abort', abortHandler);
                        }
                        this.removeListener(event, listener);
                        reject(error);
                    }
                };
                this.on(event, listener);
            });
        });
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                const receivedTime = Date.now();
                log('Received message:', message);
                const { Type, Message: msg } = message;
                if (!msg)
                    return;
                const userData = {
                    user: {
                        id: (_a = msg.Author) === null || _a === void 0 ? void 0 : _a.ID,
                        name: (_b = msg.Author) === null || _b === void 0 ? void 0 : _b.Name,
                        surname: (_c = msg.Author) === null || _c === void 0 ? void 0 : _c.Surname,
                        link: (_d = msg.Author) === null || _d === void 0 ? void 0 : _d.Link,
                        avatar: (_e = msg.Author) === null || _e === void 0 ? void 0 : _e.Avatar,
                    },
                    chat: {
                        id: (_f = msg.Dialog) === null || _f === void 0 ? void 0 : _f.ID,
                        name: (_g = msg.Dialog) === null || _g === void 0 ? void 0 : _g.Name,
                        avatar: (_h = msg.Dialog) === null || _h === void 0 ? void 0 : _h.Avatar,
                    },
                    timestamp: msg.Timestamp,
                };
                // Додаємо методи для всіх типів повідомлень (включаючи join і leave)
                msg.reply = (text_1, ...args_1) => __awaiter(this, [text_1, ...args_1], void 0, function* (text, photos_list = null, attachments = null) {
                    var _a;
                    return yield this.api.sendMessage((_a = msg.Dialog) === null || _a === void 0 ? void 0 : _a.ID, text, msg.ID, photos_list, attachments);
                });
                msg.response = (text_1, ...args_1) => __awaiter(this, [text_1, ...args_1], void 0, function* (text, photos_list = null, attachments = null, edit = null) {
                    var _a;
                    const response = yield this.api.sendMessage((_a = msg.Dialog) === null || _a === void 0 ? void 0 : _a.ID, text, msg.ID, photos_list, attachments, edit);
                    response.edit = (newText_1, ...args_2) => __awaiter(this, [newText_1, ...args_2], void 0, function* (newText, newPhotosList = photos_list, newAttachments = attachments) {
                        var _a;
                        return yield this.api.sendMessage((_a = msg.Dialog) === null || _a === void 0 ? void 0 : _a.ID, newText, msg.ID, newPhotosList, newAttachments, response.ID);
                    });
                    return response;
                });
                msg.delete = () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.api.deleteMessage(msg.ID);
                });
                msg.edit = (text, replyToId, photos_list, attachments) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    return yield this.api.sendMessage((_a = msg.Dialog) === null || _a === void 0 ? void 0 : _a.ID, text || msg.Text, replyToId || ((_b = msg.ReplyTo) === null || _b === void 0 ? void 0 : _b.ID) || null, photos_list || msg.Photos, attachments || msg.Attachments, msg.ID);
                });
                switch (Type) {
                    case 'message':
                        switch (msg.Type) {
                            case 'join':
                            case 'leave':
                                this.emit(msg.Type, msg); // Тепер передаємо msg замість userData
                                break;
                            default:
                                const text = msg.Text.trim();
                                if (text.startsWith(this.prefix)) {
                                    log(`Processing command: ${text}`);
                                    const reactionStart = Date.now();
                                    yield this.handleCommand(msg);
                                    const reactionEnd = Date.now();
                                    const responseStart = Date.now();
                                    const responseEnd = Date.now();
                                    log(`Reaction Time: ${reactionEnd - reactionStart} ms`);
                                    log(`Response Time: ${responseEnd - responseStart} ms`);
                                    log(`Total Time from Receive to Response: ${responseEnd - receivedTime} ms`);
                                }
                                this.emit('message', msg);
                        }
                        break;
                    case 'message_delete':
                    case 'notification':
                        this.emit(Type, msg);
                        if (Type === 'notification' && msg.Type) {
                            this.emit(msg.Type, msg);
                        }
                        break;
                    default:
                        log('Unknown message type:', Type);
                }
            }
            catch (err) {
                if (err instanceof Error) {
                    erlog(`Error handling message: (TYPE: ${message.Type} (${message.Message.Type}) :: Message: ${JSON.stringify(message.Message)}`, err);
                }
                else {
                    erlog('Unknown error handling message:', err);
                }
            }
        });
    }
    handleCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Text, Dialog, ID } = message;
            const [command, ...args] = Text.slice(1).split(' ');
            log(`Received command: ${command} with arguments: ${args}`);
            // Define the response method for sending messages
            message.response = (text_1, ...args_1) => __awaiter(this, [text_1, ...args_1], void 0, function* (text, photos_list = null, attachments = null, edit = null) {
                const response = yield this.api.sendMessage(Dialog.ID, text, ID, photos_list, attachments, edit);
                // Attach the edit method to the response object
                response.edit = (newText_1, ...args_2) => __awaiter(this, [newText_1, ...args_2], void 0, function* (newText, newPhotosList = photos_list, newAttachments = attachments) {
                    return yield this.api.sendMessage(Dialog.ID, newText, ID, newPhotosList, newAttachments, response.ID);
                });
                return response; // Return the full response object
            });
            // Define the reply method for replying to messages
            message.reply = (text_1, ...args_1) => __awaiter(this, [text_1, ...args_1], void 0, function* (text, photos_list = null, attachments = null, edit = null) {
                yield this.api.sendMessage(Dialog.ID, text, ID, photos_list, attachments, edit);
            });
            // Define the delete method for deleting messages
            message.delete = () => __awaiter(this, void 0, void 0, function* () {
                yield this.api.deleteMessage(ID);
            });
            // Define the edit method for editing messages
            message.edit = (text, replyToId, photos_list, attachments) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                yield this.api.sendMessage(Dialog.ID, text || message.Text, replyToId || ((_a = message.ReplyTo) === null || _a === void 0 ? void 0 : _a.ID) || null, photos_list || message.Photos, attachments || message.Attachments, message.ID);
            });
            // Check if the command exists in the commands map
            if (this.commands.has(command)) {
                const commandData = this.commands.get(command);
                const { handler, argsSchema } = commandData;
                // Parse arguments according to the schema
                const parsedArgs = yield this.parseArgs(args, argsSchema, message);
                if (!parsedArgs) {
                    if (message.response) {
                        yield message.response('Invalid arguments for the command.');
                    }
                    return;
                }
                // Execute the command handler
                log(`Executing command handler for: ${command}`);
                yield handler(message, parsedArgs);
                this.emit('command', command, message, parsedArgs);
            }
            else {
                // Emit an error if the command is not found
                this.emit('error', 'not_found_command', message, command);
            }
        });
    }
    parseArgs(args, argsSchema, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const parsedArgs = {};
            const schemaEntries = Object.entries(argsSchema);
            for (let i = 0; i < schemaEntries.length; i++) {
                const [argName, argConfig] = schemaEntries[i];
                let type, required = true, defaultValue, captureRest = false;
                // Обробка різних форматів аргументів (рядок, масив чи об'єкт)
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
                        if (argConfig[1] === false) {
                            required = false;
                            defaultValue = null;
                        }
                        else {
                            required = false;
                            defaultValue = argConfig[1];
                        }
                    }
                }
                else {
                    type = argConfig.type;
                    required = (_a = argConfig.required) !== null && _a !== void 0 ? _a : true;
                    defaultValue = (_b = argConfig.default) !== null && _b !== void 0 ? _b : null;
                    captureRest = argConfig.rest === true;
                }
                // Якщо аргумент має захопити решту тексту
                let argValue;
                if (captureRest) {
                    argValue = args.join(' ');
                    args = []; // очистити залишковий масив
                }
                else {
                    argValue = args.shift();
                }
                if (argValue === undefined) {
                    if (required) {
                        if (message.response) {
                            yield message.response(`Відсутній обов’язковий аргумент: ${argName}`);
                        }
                        return null;
                    }
                    else {
                        parsedArgs[argName] = defaultValue;
                        continue;
                    }
                }
                // Парсинг значення згідно з типом
                switch (type) {
                    case 'string':
                        parsedArgs[argName] = argValue;
                        break;
                    case 'int':
                        const intValue = parseInt(argValue, 10);
                        if (isNaN(intValue)) {
                            if (message.response) {
                                yield message.response(`Аргумент "${argName}" має бути числом.`);
                            }
                            return null;
                        }
                        parsedArgs[argName] = intValue;
                        break;
                    // Інші типи (user, repost, тощо) залишаються без змін
                    case 'user':
                        const userTag = argValue.startsWith('@') ? argValue.slice(1) : argValue;
                        try {
                            const user = yield this.getUser(userTag);
                            parsedArgs[argName] = user;
                        }
                        catch (err) {
                            if (message.response) {
                                yield message.response(`Користувача "${argValue}" не знайдено.`);
                            }
                            return null;
                        }
                        break;
                    case 'repost':
                        if ((_c = message.Repost) === null || _c === void 0 ? void 0 : _c.ID) {
                            parsedArgs[argName] = message.Repost;
                        }
                        else {
                            if (message.response) {
                                yield message.response('Вимагається репост, але не знайдено.');
                            }
                            return null;
                        }
                        break;
                    default:
                        if (message.response) {
                            yield message.response(`Невідомий тип аргументу: ${type}`);
                        }
                        return null;
                }
            }
            if (args.length > 0) {
                if (message.response) {
                    yield message.response(`Невідомі аргументи: ${args.join(', ')}`);
                }
                return null;
            }
            return parsedArgs;
        });
    }
    /**
     * Registers a new command.
     * @param command The name of the command.
     * @param argsSchema The schema of the command arguments.
     * @param handler The handler of the command.
     */
    registerCommand(command, argsSchema, handler) {
        if (typeof command !== 'string' || command.trim() === '') {
            erlog(`Invalid command name ${command}. Command must be a string and cannot be empty.`);
            return;
        }
        if (typeof handler !== 'function') {
            erlog(`Invalid handler for ${command}. Handler must be a function.`);
            return;
        }
        if (this.commands.has(command)) {
            erlog(`Command "${command}" is already registered.`);
            return;
        }
        log(`Registering command: ${command}`);
        this.commands.set(command, { handler, argsSchema });
    }
    /**
     * Sends a message to the specified dialog.
     * @param dialogId The ID of the dialog.
     * @param text The text of the message.
     * @param replyToId The ID of the message to reply to. If not specified, the message won't be a reply.
     * @param photos_list The list of photos to attach. If not specified, the message won't have any photos.
     * @param attachments The list of attachments to attach. If not specified, the message won't have any attachments.
     * @param edit The ID of the message to edit. If not specified, the message won't be an edit.
     * @param repost The ID of the message to repost. If not specified, the message won't be a repost.
     * @returns A promise that resolves with the response of the API.
     */
    sendMessage(dialogId_1, text_1) {
        return __awaiter(this, arguments, void 0, function* (dialogId, text, replyToId = null, photos_list = null, attachments = null, edit = null, repost = null) {
            const messageData = {
                text,
                photos_list: photos_list || [],
                replyTo: replyToId || null,
                edit: edit || null,
                attachments: attachments || [],
                repost: repost || null,
            };
            try {
                log(`Sending message to dialog ${dialogId}: ${text}`);
                const response = yield axios_1.default.post(`https://api.yurba.one/dialogs/${dialogId}/messages`, messageData, {
                    headers: { 'Content-Type': 'application/json', token: this.token },
                });
                log(`Message sent to dialog ${dialogId}: ${text}`);
                return response.data; // Return the full response data
            }
            catch (err) {
                if (err instanceof Error) {
                    erlog('Error sending message:', err.message);
                }
                throw err; // Re-throw the error to handle it upstream
            }
        });
    }
    getUser(userTag) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield axios_1.default.get(`https://api.yurba.one/user/${userTag}`, {
                    headers: { token: this.token },
                });
                log(`Was get user ${userTag}\n`, response.data);
                return response.data;
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error('Error getting user:', err.message);
                    const axiosError = err;
                    if (((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data) && typeof axiosError.response.data === 'object' && 'detail' in axiosError.response.data) {
                        throw new Error(axiosError.response.data.detail);
                    }
                    else {
                        throw new Error('Невідома помилка');
                    }
                }
            }
        });
    }
    getPhoto(photoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://api.yurba.one/photos/${photoId}`);
                log(`Was get photo ${photoId}\n`, response.data);
                return response.data;
            }
            catch (err) {
                if (err instanceof Error) {
                    erlog('Error getting photo:', err.message);
                }
            }
        });
    }
    deleteMessage(ID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(ID);
            try {
                yield axios_1.default.post(`https://api.yurba.one/dialogs/messages/${ID}`, {
                    headers: { 'Content-Type': 'application/json', token: this.token },
                });
            }
            catch (err) {
                if (err instanceof Error) {
                    erlog('Error delete message:', err.message);
                }
            }
        });
    }
}
exports.default = { Client, Dev, Logger: logs_1.default };

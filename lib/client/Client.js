"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.Dev = exports.Client = void 0;
const WSM_1 = __importDefault(require("./WSM"));
const axios_1 = __importDefault(require("axios"));
const Apis_1 = __importDefault(require("../rest/Apis"));
const events_1 = require("events");
const Logger_1 = __importDefault(require("../utils/Logger"));
exports.Logger = Logger_1.default;
const MessageManager_1 = __importDefault(require("./MessageManager"));
const CommandManager_1 = __importDefault(require("./CommandManager"));
const logging = new Logger_1.default("DEV");
const Dev = {
  debug: true,
};
exports.Dev = Dev;
const log = (...args) => {
  if (Dev.debug) {
    logging.debug("\n", ...args, "\n");
  }
};
const erlog = (...args) => {
  logging.error("\n", ...args, "\n");
};
// Клас Client
class Client extends events_1.EventEmitter {
  constructor(token, prefix = "/") {
    super();
    this.token = token;
    this.prefix = prefix;
    this.api = new Apis_1.default(token);
    this.wsm = new WSM_1.default(token);
    this.messageManager = new MessageManager_1.default(this.api);
    this.commandManager = new CommandManager_1.default();
  }
  /**
   * Registers a new command.
   * @param command The command to register.
   * @param argsSchema The schema of the command's arguments.
   * @param handler The handler of the command.
   */
  registerCommand(command, argsSchema, handler) {
    this.commandManager.registerCommand(command, argsSchema, handler);
  }
  async init() {
    const botData = await this.getMe();
    globalThis.botData = botData;
    log("Bot data:", botData);
    this.wsm.on("ready", () => this.emit("ready"));
    this.wsm.on("message", (message) => this.handleMessage(message));
    await this.wsm.connect(botData);
  }
  async handleMessage(message) {
    const { Type, Message: msg } = message;
    if (!msg) return;
    // Делегуємо обробку повідомлення MessageManager
    this.messageManager.enhanceMessage(msg);
    // Якщо це команда, делегуємо її виконання CommandManager
    if (Type === "message" && msg.Text.startsWith(this.prefix)) {
      const [command, ...args] = msg.Text.slice(1).split(" ");
      try {
        await this.commandManager.executeCommand(command, args, msg);
      } catch (err) {
        console.warn(`Unknown command: ${command}`);
        this.emit("uknownCommand", command, msg);
      }
    }
    // Емітуємо подію для інших обробників
    this.emit(Type, msg);
  }
  async getMe() {
    return await this.api.getMe();
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
  async waitFor(event, check, options = {}) {
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
        reject(new Error("Operation aborted"));
      };
      if (signal) {
        if (signal.aborted) {
          return reject(new Error("Operation aborted"));
        }
        signal.addEventListener("abort", abortHandler);
      }
      const listener = (...args) => {
        try {
          if (check(...args)) {
            clearTimeout(timeoutId);
            if (signal) {
              signal.removeEventListener("abort", abortHandler);
            }
            if (once) {
              this.removeListener(event, listener);
            }
            // Якщо multiple === true – повертаємо усі аргументи,
            // інакше, якщо args.length === 1 повертаємо перший аргумент,
            // або весь масив, якщо їх декілька
            if (multiple) {
              resolve(args);
            } else {
              resolve(args.length === 1 ? args[0] : args);
            }
          }
        } catch (error) {
          clearTimeout(timeoutId);
          if (signal) {
            signal.removeEventListener("abort", abortHandler);
          }
          this.removeListener(event, listener);
          reject(error);
        }
      };
      this.on(event, listener);
    });
  }
  async sendMessage(
    dialogId,
    text,
    replyToId = null,
    photos_list = null,
    attachments = null,
    edit = null,
    repost = null,
  ) {
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
      const response = await axios_1.default.post(
        `https://api.yurba.one/dialogs/${dialogId}/messages`,
        messageData,
        {
          headers: { "Content-Type": "application/json", token: this.token },
        },
      );
      log(`Message sent to dialog ${dialogId}: ${text}`);
      return response.data; // Return the full response data
    } catch (err) {
      if (err instanceof Error) {
        erlog("Error sending message:", err.message);
      }
      throw err; // Re-throw the error to handle it upstream
    }
  }
  async getUser(userTag) {
    try {
      const response = await axios_1.default.get(
        `https://api.yurba.one/user/${userTag}`,
        {
          headers: { token: this.token },
        },
      );
      log(`Was get user ${userTag}\n`, response.data);
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error getting user:", err.message);
        const axiosError = err;
        if (
          axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "detail" in axiosError.response.data
        ) {
          throw new Error(axiosError.response.data.detail);
        } else {
          throw new Error("Невідома помилка");
        }
      }
    }
  }
  /**
   * Gets a photo from Yurba.
   * @param photoId The ID of the photo to get.
   * @returns A promise that resolves with the response of the API.
   */
  async getPhoto(photoId) {
    try {
      const response = await axios_1.default.get(
        `https://api.yurba.one/photos/${photoId}`,
      );
      log(`Was get photo ${photoId}\n`, response.data);
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        erlog("Error getting photo:", err.message);
      }
    }
  }
  async deleteMessage(ID) {
    console.log(ID);
    try {
      await axios_1.default.delete(
        `https://api.yurba.one/dialogs/messages/${ID}`,
        {
          headers: { "Content-Type": "application/json", token: this.token },
        },
      );
    } catch (err) {
      if (err instanceof Error) {
        erlog("Error delete message:", err.message);
      }
    }
  }
}
exports.Client = Client;

"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const events_1 = require("events");
class ReconnectingWebSocket extends events_1.EventEmitter {
  constructor(url, options = {}) {
    super();
    this.ws = null;
    this.reconnectAttempts = 0;
    this.isConnected = false;
    this.messageQueue = [];
    this.url = url;
    this.options = {
      maxReconnectAttempts: 5,
      retryDelay: 5000,
      ...options,
    };
    this.connect();
  }
  connect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.emit(
        "error",
        new Error("Maximum reconnection attempts reached. Giving up."),
      );
      return;
    }
    this.emit(
      "debug",
      `Attempting to connect WebSocket... [Attempt ${this.reconnectAttempts + 1}]`,
    );
    this.ws = new ws_1.default(this.url);
    this.reconnectAttempts++;
    this.ws.on("open", () => this.handleOpen());
    this.ws.on("close", (code) => this.handleClose(code));
    this.ws.on("error", (err) => this.handleError(err));
    this.ws.on("message", (data) => this.handleMessage(data));
  }
  handleOpen() {
    this.emit("debug", "WebSocket connected");
    this.reconnectAttempts = 0;
    this.isConnected = true;
    this.emit("open");
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift();
      if (msg) this.ws?.send(msg);
    }
  }
  handleClose(code) {
    this.emit("debug", `WebSocket closed with code ${code}`);
    this.isConnected = false;
    if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
      this.emit(
        "debug",
        `Reconnecting in ${this.options.retryDelay / 1000} seconds...`,
      );
      setTimeout(() => this.connect(), this.options.retryDelay);
    } else {
      this.emit(
        "error",
        new Error("WebSocket closed permanently after max attempts."),
      );
    }
  }
  handleError(err) {
    this.emit("error", new Error(`WebSocket error: ${err.message}`));
    this.ws?.close();
    setTimeout(() => this.connect(), this.options.retryDelay);
  }
  handleMessage(data) {
    this.emit("debug", `Message received: ${data}`);
    this.emit("message", data);
  }
  send(data) {
    if (this.isConnected && this.ws) {
      this.emit("debug", `Sending data via WebSocket: ${data}`);
      this.ws.send(data);
    } else {
      this.emit("debug", `WebSocket not connected. Queuing message: ${data}`);
      this.messageQueue.push(data);
    }
  }
  close(code = 1000, reason = "") {
    this.emit(
      "debug",
      `Closing WebSocket with code ${code} and reason "${reason}"`,
    );
    this.ws?.close(code, reason);
  }
}
exports.default = ReconnectingWebSocket;

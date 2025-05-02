"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Websocket_1 = __importDefault(require("../rest/Websocket"));
const events_1 = require("events");
const Logger_1 = __importDefault(require("../utils/Logger"));
const logging = new Logger_1.default('WSM');
class WSM extends events_1.EventEmitter {
    constructor(token) {
        super();
        this.ws = null;
        this.token = token;
    }
    async connect(botData) {
        this.ws = new Websocket_1.default(`wss://api.yurba.one/ws?token=${this.token}`);
        this.ws.on('open', () => {
            logging.info('WebSocket connection opened.');
            this.subscribeToEvents('dialog', botData.ID);
            this.emit('ready'); // Емітуємо подію "ready" для Client
        });
        this.ws.on('message', (data) => {
            logging.debug('WebSocket received a message:', data);
            const message = JSON.parse(data);
            this.emit('message', message); // Емітуємо подію "message" для Client
        });
        this.ws.on('close', () => {
            logging.warn('WebSocket connection closed.');
            this.emit('close'); // Емітуємо подію "close" для Client
        });
        this.ws.on('error', (err) => {
            logging.error('WebSocket error:', err);
            this.emit('error', err); // Емітуємо подію "error" для Client
        });
        await this.waitForWebSocketOpen();
    }
    subscribeToEvents(category, thing_id) {
        const subscribeData = {
            command: 'subscribe',
            category,
            thing_id,
        };
        logging.info(`Subscribing to events for category: ${category}, thing_id: ${thing_id}`);
        this.ws?.send(JSON.stringify(subscribeData));
    }
    waitForWebSocketOpen() {
        return new Promise((resolve, reject) => {
            if (this.ws.readyState === WebSocket.OPEN) {
                logging.info('WebSocket already open.');
                resolve();
            }
            else if (this.ws.readyState === WebSocket.CLOSED) {
                logging.error('WebSocket is closed.');
                reject(new Error('WebSocket is closed'));
            }
            else {
                logging.info('Waiting for WebSocket to open...');
                this.ws?.on('open', resolve);
                this.ws?.on('error', reject);
            }
        });
    }
    close() {
        this.ws?.close();
    }
}
exports.default = WSM;

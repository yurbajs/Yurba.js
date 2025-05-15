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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = void 0;
/**
 * ANSI color codes for terminal output.
 * @internal
 */
const COLORS = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    green: '\x1b[32m',
    gray: '\x1b[90m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    bgBrightBlack: '\x1b[100m',
    bgGray: '\x1b[48m',
    bgBrightRed: '\x1b[101m',
    bgBrightGreen: '\x1b[102m',
    bgBrightYellow: '\x1b[103m',
    bgBrightBlue: '\x1b[104m',
    bgBrightMagenta: '\x1b[105m',
    bgBrightCyan: '\x1b[106m',
    bgBrightWhite: '\x1b[107m',
    bold: '\x1b[1m',
    underline: '\x1b[4m',
    reverse: '\x1b[7m',
    blink: '\x1b[5m',
    hidden: '\x1b[8m',
    strikethrough: '\x1b[9m',
};
/**
 * Log level color mapping.
 * @internal
 */
const logLevels = {
    error: COLORS.red,
    warn: COLORS.yellow,
    info: COLORS.blue,
    debug: COLORS.brightGreen,
    success: COLORS.green,
};
/**
 * A simple terminal progress bar.
 * @example
 * const bar = new ProgressBar(100, "Uploading");
 * bar.update(50);
 * bar.increment();
 * bar.stop();
 */
class ProgressBar {
    /**
     * Create a new ProgressBar.
     * @param total Total number of steps.
     * @param description Optional description.
     * @param width Bar width in characters.
     * @param color Bar color.
     */
    constructor(total, description = '', width = 20, color = Logger.col.green) {
        this.total = total;
        this.current = 0;
        this.description = description;
        this.width = width;
        this.color = color;
        this.startTime = Date.now();
        this.isFinished = false;
    }
    /**
     * Update the progress bar to a specific value.
     * @param current Current progress value.
     */
    update(current) {
        if (this.isFinished)
            return;
        this.current = Math.min(current, this.total);
        this.render();
    }
    /**
     * Increment the progress bar by a step.
     * @param step Step size (default 1).
     */
    increment(step = 1) {
        if (this.isFinished)
            return;
        this.current = Math.min(this.current + step, this.total);
        this.render();
    }
    /**
     * Finish and stop the progress bar.
     */
    stop() {
        if (this.isFinished)
            return;
        this.isFinished = true;
        this.current = this.total;
        this.render();
        process.stdout.write('\n');
    }
    getElapsedTime() {
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    render() {
        if (!process.stdout.isTTY)
            return;
        const percent = (this.current / this.total) * 100;
        const filledLength = Math.round((this.width * this.current) / this.total);
        const filled = '█'.repeat(filledLength);
        const empty = ' '.repeat(this.width - filledLength);
        const descriptionColor = Logger.col.brightBlue;
        const percentageColor = Logger.col.brightYellow;
        const elapsedColor = Logger.col.gray;
        const line = [
            `${descriptionColor}${this.description}${Logger.col.reset}`,
            `[${this.color}${filled}${Logger.col.reset}${empty}]`,
            `${percentageColor}${percent.toFixed(1)}%${Logger.col.reset}`,
            `${elapsedColor}${this.getElapsedTime()}${Logger.col.reset}`
        ].join(' ');
        process.stdout.write(`\r${line}`);
    }
}
exports.ProgressBar = ProgressBar;
/**
 * Logger utility for colored and leveled console output.
 * @example
 * const logger = new Logger("BOT");
 * logger.info("Bot started");
 * logger.error("Something went wrong");
 */
class Logger {
    /**
     * Create a new Logger.
     * @param prefix Prefix for all log messages.
     */
    constructor(prefix = 'DEV') {
        this.prefix = prefix;
    }
    formatTime() {
        const now = new Date();
        return `${Logger.col.bgBrightBlack}[${now.toLocaleTimeString()}]${Logger.col.reset}`;
    }
    log(level, ...args) {
        const color = logLevels[level] || Logger.col.reset;
        const levelLabel = `${color}[${level.toUpperCase()}]${Logger.col.reset}`;
        const formattedArgs = args.map((arg) => {
            if (typeof arg === 'object') {
                return Promise.resolve().then(() => __importStar(require('util'))).then(util => util.inspect(arg, { colors: true, depth: null }));
            }
            return arg;
        });
        const message = `${this.prefix} ${levelLabel} ${formattedArgs.join(' ')}`;
        switch (level) {
            case "error":
                console.error(this.formatTime(), '›', message);
                break;
            case "warn":
                console.warn(this.formatTime(), '›', message);
                break;
            case "info":
                console.info(this.formatTime(), '›', message);
                break;
            case "debug":
                console.debug(this.formatTime(), '›', message);
                break;
            default:
                console.log(this.formatTime(), '›', message);
        }
    }
    /**
     * Log an error message.
     */
    error(...args) { this.log('error', ...args); }
    /**
     * Log a warning message.
     */
    warn(...args) { this.log('warn', ...args); }
    /**
     * Log an info message.
     */
    info(...args) { this.log('info', ...args); }
    /**
     * Log a debug message.
     */
    debug(...args) { this.log('debug', ...args); }
    /**
     * Log a success message.
     */
    success(...args) { this.log('success', ...args); }
    /**
     * Create a new progress bar.
     * @param total Total steps for the progress bar.
     * @param options Progress bar options.
     * @returns ProgressBar instance.
     */
    createProgressBar(total, options = {}) {
        return new ProgressBar(total, options.description || '', options.width || 20, options.color || Logger.col.green);
    }
}
/**
 * ANSI color codes for styling.
 */
Logger.col = COLORS;
exports.default = Logger;

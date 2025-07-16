---
title: Creating Your Bot Files
editLink: true
sidebar: true
---

# Creating Your Bot Files

Now that your project is properly configured, it's time to create the core files that will bring your bot to life. This guide will walk you through creating a complete, functional bot with proper structure and best practices.

## Basic Bot Structure

We'll create a bot with the following structure:

```
my-yurba-bot/
├── src/
│   ├── index.js          # Main entry point
│   ├── config.js         # Configuration management
│   ├── commands/         # Command handlers
│   │   ├── ping.js
│   │   ├── help.js
│   │   └── info.js
│   ├── events/           # Event handlers
│   │   ├── ready.js
│   │   └── message.js
│   ├── middleware/       # Custom middleware
│   │   └── logger.js
│   └── utils/            # Utility functions
│       ├── logger.js
│       └── helpers.js
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project configuration
└── README.md            # Documentation
```

## Step 1: Create the Main Entry Point

Create your main bot file:

::: code-group

```javascript [src/index.js (CommonJS)]
const { Client } = require('yurba.js');
const config = require('./config');
const logger = require('./utils/logger');

// Import middleware
const loggerMiddleware = require('./middleware/logger');

// Import event handlers
const readyHandler = require('./events/ready');
const messageHandler = require('./events/message');

// Import commands
const pingCommand = require('./commands/ping');
const helpCommand = require('./commands/help');
const infoCommand = require('./commands/info');

class YurbaBot {
    constructor() {
        // Validate configuration
        config.validate();
        
        // Initialize client
        this.client = new Client(config.token, {
            prefix: config.prefix,
            maxReconnectAttempts: config.maxReconnectAttempts || 5
        });
        
        this.setupMiddleware();
        this.setupCommands();
        this.setupEvents();
        
        logger.info('Bot initialized successfully');
    }
    
    setupMiddleware() {
        // Add logging middleware
        this.client.use(loggerMiddleware, { name: 'logger' });
        
        logger.debug('Middleware configured');
    }
    
    setupCommands() {
        // Register commands
        this.client.registerCommand('ping', {}, pingCommand);
        this.client.registerCommand('help', {}, helpCommand);
        this.client.registerCommand('info', { user: 'string?' }, infoCommand);
        
        logger.info(`Registered ${this.client.getCommands().length} commands`);
    }
    
    setupEvents() {
        // Setup event handlers
        this.client.on('ready', () => readyHandler(this.client));
        this.client.on('message', (message) => messageHandler(this.client, message));
        
        // Error handling
        this.client.on('error', (error) => {
            logger.error('Client error:', error);
        });
        
        this.client.on('reconnectFailed', () => {
            logger.error('Failed to reconnect after maximum attempts');
            process.exit(1);
        });
        
        logger.debug('Event handlers configured');
    }
    
    async start() {
        try {
            logger.info('Starting bot...');
            await this.client.init();
        } catch (error) {
            logger.error('Failed to start bot:', error);
            process.exit(1);
        }
    }
    
    async stop() {
        logger.info('Stopping bot...');
        this.client.removeAllListeners();
        process.exit(0);
    }
}

// Create and start bot
const bot = new YurbaBot();

// Graceful shutdown handling
process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    bot.stop();
});

process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    bot.stop();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the bot
bot.start();
```

```typescript [src/index.ts (TypeScript)]
import { Client } from 'yurba.js';
import config from './config';
import logger from './utils/logger';

// Import middleware
import loggerMiddleware from './middleware/logger';

// Import event handlers
import readyHandler from './events/ready';
import messageHandler from './events/message';

// Import commands
import pingCommand from './commands/ping';
import helpCommand from './commands/help';
import infoCommand from './commands/info';

class YurbaBot {
    private client: Client;
    
    constructor() {
        // Validate configuration
        config.validate();
        
        // Initialize client
        this.client = new Client(config.token, {
            prefix: config.prefix,
            maxReconnectAttempts: config.maxReconnectAttempts || 5
        });
        
        this.setupMiddleware();
        this.setupCommands();
        this.setupEvents();
        
        logger.info('Bot initialized successfully');
    }
    
    private setupMiddleware(): void {
        // Add logging middleware
        this.client.use(loggerMiddleware, { name: 'logger' });
        
        logger.debug('Middleware configured');
    }
    
    private setupCommands(): void {
        // Register commands
        this.client.registerCommand('ping', {}, pingCommand);
        this.client.registerCommand('help', {}, helpCommand);
        this.client.registerCommand('info', { user: 'string?' }, infoCommand);
        
        logger.info(`Registered ${this.client.getCommands().length} commands`);
    }
    
    private setupEvents(): void {
        // Setup event handlers
        this.client.on('ready', () => readyHandler(this.client));
        this.client.on('message', (message) => messageHandler(this.client, message));
        
        // Error handling
        this.client.on('error', (error: Error) => {
            logger.error('Client error:', error);
        });
        
        this.client.on('reconnectFailed', () => {
            logger.error('Failed to reconnect after maximum attempts');
            process.exit(1);
        });
        
        logger.debug('Event handlers configured');
    }
    
    public async start(): Promise<void> {
        try {
            logger.info('Starting bot...');
            await this.client.init();
        } catch (error) {
            logger.error('Failed to start bot:', error);
            process.exit(1);
        }
    }
    
    public async stop(): Promise<void> {
        logger.info('Stopping bot...');
        this.client.removeAllListeners();
        process.exit(0);
    }
}

// Create and start bot
const bot = new YurbaBot();

// Graceful shutdown handling
process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    bot.stop();
});

process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    bot.stop();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the bot
bot.start();
```

:::

## Step 2: Create Configuration Module

Create a robust configuration system:

::: code-group

```javascript [src/config.js (CommonJS)]
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const config = {
    // Bot configuration
    token: process.env.YURBA_TOKEN,
    prefix: process.env.BOT_PREFIX || '/',
    name: process.env.BOT_NAME || 'YurbaBot',
    
    // Environment settings
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
    
    // Bot behavior settings
    maxReconnectAttempts: parseInt(process.env.MAX_RECONNECT_ATTEMPTS) || 5,
    commandCooldown: parseInt(process.env.COMMAND_COOLDOWN) || 1000,
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 2000,
    
    // Feature flags
    features: {
        autoReconnect: process.env.AUTO_RECONNECT !== 'false',
        commandLogging: process.env.COMMAND_LOGGING !== 'false',
        errorReporting: process.env.ERROR_REPORTING !== 'false',
        middleware: process.env.MIDDLEWARE !== 'false'
    },
    
    // Paths
    paths: {
        commands: path.join(__dirname, 'commands'),
        events: path.join(__dirname, 'events'),
        middleware: path.join(__dirname, 'middleware'),
        logs: path.join(__dirname, '..', 'logs')
    },
    
    // Validation method
    validate() {
        const errors = [];
        
        if (!this.token) {
            errors.push('YURBA_TOKEN is required in environment variables');
        }
        
        if (this.token && !this.token.startsWith('y.')) {
            errors.push('Invalid token format. Token must start with "y."');
        }
        
        if (this.token && this.token.length < 34) {
            errors.push('Token appears to be too short. Expected at least 34 characters.');
        }
        
        if (!this.prefix || this.prefix.length === 0) {
            errors.push('Bot prefix cannot be empty');
        }
        
        if (this.maxReconnectAttempts < 1 || this.maxReconnectAttempts > 50) {
            errors.push('maxReconnectAttempts must be between 1 and 50');
        }
        
        if (this.commandCooldown < 0) {
            errors.push('commandCooldown cannot be negative');
        }
        
        if (errors.length > 0) {
            throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
        }
        
        return true;
    },
    
    // Get environment-specific settings
    isDevelopment() {
        return this.environment === 'development';
    },
    
    isProduction() {
        return this.environment === 'production';
    },
    
    isTest() {
        return this.environment === 'test';
    }
};

module.exports = config;
```

```typescript [src/config.ts (TypeScript)]
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface BotFeatures {
    autoReconnect: boolean;
    commandLogging: boolean;
    errorReporting: boolean;
    middleware: boolean;
}

interface BotPaths {
    commands: string;
    events: string;
    middleware: string;
    logs: string;
}

interface BotConfig {
    token: string;
    prefix: string;
    name: string;
    environment: string;
    debug: boolean;
    logLevel: string;
    maxReconnectAttempts: number;
    commandCooldown: number;
    maxMessageLength: number;
    features: BotFeatures;
    paths: BotPaths;
    validate(): boolean;
    isDevelopment(): boolean;
    isProduction(): boolean;
    isTest(): boolean;
}

const config: BotConfig = {
    // Bot configuration
    token: process.env.YURBA_TOKEN!,
    prefix: process.env.BOT_PREFIX || '/',
    name: process.env.BOT_NAME || 'YurbaBot',
    
    // Environment settings
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
    
    // Bot behavior settings
    maxReconnectAttempts: parseInt(process.env.MAX_RECONNECT_ATTEMPTS || '5'),
    commandCooldown: parseInt(process.env.COMMAND_COOLDOWN || '1000'),
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH || '2000'),
    
    // Feature flags
    features: {
        autoReconnect: process.env.AUTO_RECONNECT !== 'false',
        commandLogging: process.env.COMMAND_LOGGING !== 'false',
        errorReporting: process.env.ERROR_REPORTING !== 'false',
        middleware: process.env.MIDDLEWARE !== 'false'
    },
    
    // Paths
    paths: {
        commands: path.join(__dirname, 'commands'),
        events: path.join(__dirname, 'events'),
        middleware: path.join(__dirname, 'middleware'),
        logs: path.join(__dirname, '..', 'logs')
    },
    
    // Validation method
    validate(): boolean {
        const errors: string[] = [];
        
        if (!this.token) {
            errors.push('YURBA_TOKEN is required in environment variables');
        }
        
        if (this.token && !this.token.startsWith('y.')) {
            errors.push('Invalid token format. Token must start with "y."');
        }
        
        if (this.token && this.token.length < 34) {
            errors.push('Token appears to be too short. Expected at least 34 characters.');
        }
        
        if (!this.prefix || this.prefix.length === 0) {
            errors.push('Bot prefix cannot be empty');
        }
        
        if (this.maxReconnectAttempts < 1 || this.maxReconnectAttempts > 50) {
            errors.push('maxReconnectAttempts must be between 1 and 50');
        }
        
        if (this.commandCooldown < 0) {
            errors.push('commandCooldown cannot be negative');
        }
        
        if (errors.length > 0) {
            throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
        }
        
        return true;
    },
    
    // Get environment-specific settings
    isDevelopment(): boolean {
        return this.environment === 'development';
    },
    
    isProduction(): boolean {
        return this.environment === 'production';
    },
    
    isTest(): boolean {
        return this.environment === 'test';
    }
};

export default config;
```

:::

## Step 3: Create Utility Functions

### Logger Utility

::: code-group

```javascript [src/utils/logger.js (CommonJS)]
const fs = require('fs');
const path = require('path');

class Logger {
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.enableFile = options.enableFile || false;
        this.logDir = options.logDir || path.join(__dirname, '..', '..', 'logs');
        this.colors = {
            debug: '\x1b[36m',    // Cyan
            info: '\x1b[32m',     // Green
            warn: '\x1b[33m',     // Yellow
            error: '\x1b[31m',    // Red
            reset: '\x1b[0m'      // Reset
        };
        
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
        
        // Create logs directory if file logging is enabled
        if (this.enableFile && !fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }
    
    shouldLog(level) {
        return this.levels[level] >= this.levels[this.level];
    }
    
    formatMessage(level, ...args) {
        const timestamp = new Date().toISOString();
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        return {
            console: `${this.colors[level]}[${timestamp}] [${level.toUpperCase()}]${this.colors.reset} ${message}`,
            file: `[${timestamp}] [${level.toUpperCase()}] ${message}`
        };
    }
    
    writeToFile(level, message) {
        if (!this.enableFile) return;
        
        const date = new Date().toISOString().split('T')[0];
        const logFile = path.join(this.logDir, `${date}.log`);
        
        fs.appendFileSync(logFile, message + '\n');
    }
    
    log(level, ...args) {
        if (!this.shouldLog(level)) return;
        
        const formatted = this.formatMessage(level, ...args);
        
        // Console output
        console.log(formatted.console);
        
        // File output
        this.writeToFile(level, formatted.file);
    }
    
    debug(...args) {
        this.log('debug', ...args);
    }
    
    info(...args) {
        this.log('info', ...args);
    }
    
    warn(...args) {
        this.log('warn', ...args);
    }
    
    error(...args) {
        this.log('error', ...args);
    }
}

// Create default logger instance
const logger = new Logger({
    level: process.env.LOG_LEVEL || 'info',
    enableFile: process.env.LOG_TO_FILE === 'true'
});

module.exports = logger;
```

```typescript [src/utils/logger.ts (TypeScript)]
import fs from 'fs';
import path from 'path';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
    level?: LogLevel;
    enableFile?: boolean;
    logDir?: string;
}

interface Colors {
    [key: string]: string;
}

interface Levels {
    [key: string]: number;
}

class Logger {
    private level: LogLevel;
    private enableFile: boolean;
    private logDir: string;
    private colors: Colors;
    private levels: Levels;
    
    constructor(options: LoggerOptions = {}) {
        this.level = options.level || 'info';
        this.enableFile = options.enableFile || false;
        this.logDir = options.logDir || path.join(__dirname, '..', '..', 'logs');
        this.colors = {
            debug: '\x1b[36m',    // Cyan
            info: '\x1b[32m',     // Green
            warn: '\x1b[33m',     // Yellow
            error: '\x1b[31m',    // Red
            reset: '\x1b[0m'      // Reset
        };
        
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
        
        // Create logs directory if file logging is enabled
        if (this.enableFile && !fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }
    
    private shouldLog(level: LogLevel): boolean {
        return this.levels[level] >= this.levels[this.level];
    }
    
    private formatMessage(level: LogLevel, ...args: any[]): { console: string; file: string } {
        const timestamp = new Date().toISOString();
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        return {
            console: `${this.colors[level]}[${timestamp}] [${level.toUpperCase()}]${this.colors.reset} ${message}`,
            file: `[${timestamp}] [${level.toUpperCase()}] ${message}`
        };
    }
    
    private writeToFile(level: LogLevel, message: string): void {
        if (!this.enableFile) return;
        
        const date = new Date().toISOString().split('T')[0];
        const logFile = path.join(this.logDir, `${date}.log`);
        
        fs.appendFileSync(logFile, message + '\n');
    }
    
    private log(level: LogLevel, ...args: any[]): void {
        if (!this.shouldLog(level)) return;
        
        const formatted = this.formatMessage(level, ...args);
        
        // Console output
        console.log(formatted.console);
        
        // File output
        this.writeToFile(level, formatted.file);
    }
    
    public debug(...args: any[]): void {
        this.log('debug', ...args);
    }
    
    public info(...args: any[]): void {
        this.log('info', ...args);
    }
    
    public warn(...args: any[]): void {
        this.log('warn', ...args);
    }
    
    public error(...args: any[]): void {
        this.log('error', ...args);
    }
}

// Create default logger instance
const logger = new Logger({
    level: (process.env.LOG_LEVEL as LogLevel) || 'info',
    enableFile: process.env.LOG_TO_FILE === 'true'
});

export default logger;
```

:::

### Helper Utilities

::: code-group

```javascript [src/utils/helpers.js (CommonJS)]
/**
 * Utility functions for the bot
 */

/**
 * Formats a timestamp to a readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date = new Date()) {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncates a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated string
 */
function truncate(str, length = 100, suffix = '...') {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Escapes special characters in a string for safe display
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeMarkdown(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[*_`~\\]/g, '\\$&');
}

/**
 * Validates if a string is a valid Yurba token
 * @param {string} token - Token to validate
 * @returns {boolean} True if valid token format
 */
function isValidToken(token) {
    if (!token || typeof token !== 'string') return false;
    return token.startsWith('y.') && token.length >= 34;
}

/**
 * Generates a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Delays execution for a specified time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely parses JSON with error handling
 * @param {string} str - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed object or default value
 */
function safeJsonParse(str, defaultValue = null) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return defaultValue;
    }
}

/**
 * Formats bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Gets uptime in human readable format
 * @param {number} startTime - Start timestamp
 * @returns {string} Formatted uptime
 */
function getUptime(startTime) {
    const uptime = Date.now() - startTime;
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

module.exports = {
    formatDate,
    capitalize,
    truncate,
    escapeMarkdown,
    isValidToken,
    generateId,
    delay,
    safeJsonParse,
    formatBytes,
    getUptime
};
```

```typescript [src/utils/helpers.ts (TypeScript)]
/**
 * Utility functions for the bot
 */

/**
 * Formats a timestamp to a readable string
 */
export function formatDate(date: Date = new Date()): string {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncates a string to a specified length
 */
export function truncate(str: string, length: number = 100, suffix: string = '...'): string {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Escapes special characters in a string for safe display
 */
export function escapeMarkdown(str: string): string {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[*_`~\\]/g, '\\$&');
}

/**
 * Validates if a string is a valid Yurba token
 */
export function isValidToken(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    return token.startsWith('y.') && token.length >= 34;
}

/**
 * Generates a random ID
 */
export function generateId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Delays execution for a specified time
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T = any>(str: string, defaultValue: T | null = null): T | null {
    try {
        return JSON.parse(str) as T;
    } catch (error) {
        return defaultValue;
    }
}

/**
 * Formats bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Gets uptime in human readable format
 */
export function getUptime(startTime: number): string {
    const uptime = Date.now() - startTime;
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes >

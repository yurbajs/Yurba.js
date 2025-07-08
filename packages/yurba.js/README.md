# Yurba.js

A powerful and modern JavaScript/TypeScript library for creating Yurba bots and clients, inspired by discord.js architecture.

## Features

- 🚀 **Modern Architecture** - Built with TypeScript, interfaces, and best practices
- 🔧 **Easy to Use** - Simple and intuitive API similar to discord.js
- 🛡️ **Type Safe** - Full TypeScript support with comprehensive type definitions
- 🔌 **Middleware System** - Powerful middleware system for message processing
- ⚡ **Real-time** - WebSocket support for real-time communication
- 🎯 **Command System** - Advanced command parsing with argument validation
- 🔄 **Auto-reconnect** - Automatic WebSocket reconnection with exponential backoff
- 📦 **Modular** - Separate packages for different functionality

## Installation

```bash
npm install yurba.js
# or
yarn add yurba.js
```

## Quick Start

```typescript
import { Client } from 'yurba.js';

// Create client with options (discord.js style)
const client = new Client('y.YOUR_TOKEN_HERE', {
  prefix: '!',
  maxReconnectAttempts: 10,
  debug: true
});

// Add middleware for logging
client.use(async (message) => {
  console.log(`[${message.Type}] ${message.Message?.Author?.Name}: ${message.Message?.Text}`);
}, { name: 'logger', priority: 1 });

// Register commands
client.registerCommand('hello', { name: ['string', 'World'] }, async (message, args) => {
  await message.reply(`Hello, ${args.name}!`);
});

client.registerCommand('add', { a: 'int', b: 'int' }, async (message, args) => {
  const result = args.a + args.b;
  await message.reply(`${args.a} + ${args.b} = ${result}`);
});

// Event handlers
client.once('ready', () => {
  console.log(`Bot ${client.user?.Name} is ready!`);
});

client.on('message', (message) => {
  // Handle regular messages
});

client.on('commandError', ({ error, message }) => {
  console.error('Command error:', error);
  message.reply('Sorry, there was an error executing that command.');
});

// Initialize the client
client.init().catch(console.error);
```

## Command System

The command system supports various argument types and validation:

```typescript
// String argument with default value
client.registerCommand('greet', { name: ['string', 'Anonymous'] }, async (message, args) => {
  await message.reply(`Hello, ${args.name}!`);
});

// Integer arguments
client.registerCommand('multiply', { a: 'int', b: 'int' }, async (message, args) => {
  await message.reply(`Result: ${args.a * args.b}`);
});

// User argument
client.registerCommand('userinfo', { target: 'user' }, async (message, args) => {
  const user = args.target;
  await message.reply(`User: ${user.Name} (ID: ${user.ID})`);
});

// Boolean argument
client.registerCommand('toggle', { enabled: 'boolean' }, async (message, args) => {
  await message.reply(`Setting is now ${args.enabled ? 'enabled' : 'disabled'}`);
});
```

## Middleware System

Middleware functions are executed for every incoming message:

```typescript
// Logging middleware
client.use(async (message) => {
  console.log(`Message from ${message.Message?.Author?.Name}`);
}, { name: 'logger', priority: 1 });

// Spam filter middleware
client.use(async (message) => {
  if (message.Message?.Text?.includes('spam')) {
    console.log('Spam detected, ignoring message');
    return;
  }
}, { name: 'spam-filter', priority: 2 });

// Remove middleware
client.removeMiddleware('spam-filter');

// List all middleware
console.log(client.getMiddlewares());
```

## Error Handling

The library provides comprehensive error handling:

```typescript
import { TokenValidationError, CommandError, WebSocketError } from 'yurba.js';

try {
  const client = new Client('invalid-token');
} catch (error) {
  if (error instanceof TokenValidationError) {
    console.error('Invalid token format');
  }
}

client.on('commandError', ({ error, message }) => {
  if (error instanceof CommandError) {
    console.error(`Command error in ${error.commandName}:`, error.message);
  }
});
```

## API Reference

### Client Options

```typescript
interface ClientOptions {
  prefix?: string;                // Command prefix (default: '/')
  maxReconnectAttempts?: number;  // Max reconnection attempts (default: 5)
  reconnectDelay?: number;        // Reconnection delay (default: 5000ms)
  debug?: boolean;                // Enable debug logging (default: false)
}
```

### Events

- `ready` - Emitted when the client is ready
- `message` - Emitted for every message
- `commandError` - Emitted when a command fails
- `unknownCommand` - Emitted for unknown commands
- `middlewareError` - Emitted when middleware fails
- `reconnectError` - Emitted when reconnection fails

## License

Apache-2.0

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.
# Getting Started

Welcome to Yurba.js! This guide will help you create your first bot in minutes.

## Installation

```bash
npm install yurba.js
# or
pnpm add yurba.js
# or
yarn add yurba.js
```

## Quick Start

Create a simple bot:

```typescript
import { Client } from 'yurba.js';

const client = new Client({
  token: 'your-bot-token'
});

client.on('ready', () => {
  console.log('Bot is ready!');
});

client.on('message', (message) => {
  if (message.content === 'ping') {
    message.reply('pong!');
  }
});

client.login();
```

## Next Steps

- [Creating a Bot](/creating-bot) - Learn how to set up your bot
- [Commands](/commands) - Handle user commands
- [Events](/events) - Listen to platform events
- [Examples](/examples) - See real-world examples
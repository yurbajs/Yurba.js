# Creating a Bot

This guide will walk you through creating your first Yurba.js bot step by step.

## Setting Up Your Project

First, create a new directory for your bot:

```bash
mkdir my-yurba-bot
cd my-yurba-bot
npm init -y
```

Install Yurba.js:

```bash
npm install yurba.js
```

## Basic Bot Structure

Create an `index.js` file:

```javascript
const { Client } = require('yurba.js');

const client = new Client({
  token: process.env.BOT_TOKEN
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.login();
```

## Environment Variables

Create a `.env` file for your bot token:

```env
BOT_TOKEN=your_bot_token_here
```

Install dotenv to load environment variables:

```bash
npm install dotenv
```

Update your bot to use environment variables:

```javascript
require('dotenv').config();
const { Client } = require('yurba.js');

const client = new Client({
  token: process.env.BOT_TOKEN
});
```

## Adding Event Handlers

Listen to different events:

```javascript
client.on('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

client.on('error', (error) => {
  console.error('Bot error:', error);
});
```

## Running Your Bot

```bash
node index.js
```

## Next Steps

- [Commands](/commands) - Learn about command handling
- [Events](/events) - Explore all available events
- [Examples](/examples) - See more complex examples
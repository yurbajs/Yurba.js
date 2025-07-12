# Examples

Real-world examples to help you build amazing bots with Yurba.js.

## Basic Echo Bot

A simple bot that echoes back user messages:

```javascript
const { Client } = require('yurba.js');

const client = new Client({
  token: process.env.BOT_TOKEN
});

client.on('ready', () => {
  console.log(`${client.user.username} is online!`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  if (message.content.startsWith('!echo ')) {
    const text = message.content.slice(6);
    message.reply(text);
  }
});

client.login();
```

## Moderation Bot

A bot with basic moderation features:

```javascript
const { Client } = require('yurba.js');

const client = new Client({
  token: process.env.BOT_TOKEN
});

const moderators = ['user_id_1', 'user_id_2'];

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const args = message.content.split(' ');
  const command = args[0].toLowerCase();
  
  // Check if user is moderator
  if (!moderators.includes(message.author.id)) {
    return message.reply('You need moderator permissions!');
  }
  
  switch (command) {
    case '!kick':
      const userToKick = message.mentions.users.first();
      if (userToKick) {
        // Kick logic here
        message.reply(`Kicked ${userToKick.username}`);
      }
      break;
      
    case '!ban':
      const userToBan = message.mentions.users.first();
      if (userToBan) {
        // Ban logic here
        message.reply(`Banned ${userToBan.username}`);
      }
      break;
      
    case '!clear':
      const amount = parseInt(args[1]);
      if (amount > 0 && amount <= 100) {
        // Clear messages logic
        message.reply(`Cleared ${amount} messages`);
      }
      break;
  }
});

client.login();
```

## Music Bot

A bot that can play music:

```javascript
const { Client } = require('yurba.js');

const client = new Client({
  token: process.env.BOT_TOKEN
});

const queue = new Map();

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const args = message.content.split(' ');
  const command = args[0].toLowerCase();
  
  switch (command) {
    case '!play':
      const song = args.slice(1).join(' ');
      if (!song) {
        return message.reply('Please provide a song name!');
      }
      
      // Add to queue logic
      message.reply(`Added "${song}" to queue`);
      break;
      
    case '!skip':
      // Skip current song logic
      message.reply('Skipped current song');
      break;
      
    case '!stop':
      // Stop music logic
      message.reply('Music stopped');
      break;
      
    case '!queue':
      // Show queue logic
      message.reply('Current queue: ...');
      break;
  }
});

client.login();
```

## Advanced Command Handler

A more sophisticated command handling system:

```javascript
const { Client } = require('yurba.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  token: process.env.BOT_TOKEN
});

// Load commands dynamically
client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.name, command);
}

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;
  
  const args = message.content.slice(1).split(' ');
  const commandName = args.shift().toLowerCase();
  
  const command = client.commands.get(commandName);
  if (!command) return;
  
  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command!');
  }
});

client.login();
```

### Example Command File

```javascript
// commands/ping.js
module.exports = {
  name: 'ping',
  description: 'Ping command',
  async execute(message, args) {
    const sent = await message.reply('Pinging...');
    const timeDiff = sent.createdTimestamp - message.createdTimestamp;
    sent.edit(`Pong! Latency: ${timeDiff}ms`);
  },
};
```

## Database Integration

Bot with database support:

```javascript
const { Client } = require('yurba.js');
const sqlite3 = require('sqlite3').verbose();

const client = new Client({
  token: process.env.BOT_TOKEN
});

// Initialize database
const db = new sqlite3.Database('bot.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    points INTEGER DEFAULT 0
  )`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  // Add user to database if not exists
  db.run(`INSERT OR IGNORE INTO users (id, username) VALUES (?, ?)`, 
    [message.author.id, message.author.username]);
  
  if (message.content === '!points') {
    db.get(`SELECT points FROM users WHERE id = ?`, [message.author.id], (err, row) => {
      if (row) {
        message.reply(`You have ${row.points} points!`);
      }
    });
  }
  
  if (message.content === '!daily') {
    db.run(`UPDATE users SET points = points + 100 WHERE id = ?`, [message.author.id]);
    message.reply('You received 100 daily points!');
  }
});

client.login();
```

## Next Steps

- [API Reference](https://yurbajs.pages.dev/) - Full API documentation
- [GitHub Repository](https://github.com/RastGame/Yurba.js) - Source code and more examples
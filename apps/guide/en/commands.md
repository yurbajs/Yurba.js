# Commands

Learn how to handle user commands in your Yurba.js bot.

## Basic Command Handling

```javascript
client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  const args = message.content.split(' ');
  const command = args[0].toLowerCase();
  
  switch (command) {
    case '!ping':
      message.reply('Pong!');
      break;
      
    case '!hello':
      message.reply(`Hello, ${message.author.username}!`);
      break;
      
    case '!info':
      message.reply('This is a Yurba.js bot!');
      break;
  }
});
```

## Command with Arguments

```javascript
client.on('messageCreate', (message) => {
  if (message.content.startsWith('!say ')) {
    const text = message.content.slice(5); // Remove '!say '
    message.reply(text);
  }
});
```

## Advanced Command Handler

Create a more structured command system:

```javascript
const commands = new Map();

// Define commands
commands.set('ping', {
  execute: (message, args) => {
    message.reply('Pong!');
  }
});

commands.set('userinfo', {
  execute: (message, args) => {
    const user = message.mentions.users.first() || message.author;
    message.reply(`User: ${user.username}, ID: ${user.id}`);
  }
});

// Command handler
client.on('messageCreate', (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;
  
  const args = message.content.slice(1).split(' ');
  const commandName = args.shift().toLowerCase();
  
  const command = commands.get(commandName);
  if (!command) return;
  
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command!');
  }
});
```

## Command Categories

Organize commands by category:

```javascript
const commands = {
  utility: {
    ping: (message) => message.reply('Pong!'),
    uptime: (message) => message.reply(`Uptime: ${process.uptime()}s`)
  },
  
  moderation: {
    kick: (message, args) => {
      // Kick user logic
    },
    ban: (message, args) => {
      // Ban user logic  
    }
  }
};
```

## Permission Checks

Add permission checking to commands:

```javascript
const adminCommands = ['kick', 'ban', 'mute'];

client.on('messageCreate', (message) => {
  const command = parseCommand(message.content);
  
  if (adminCommands.includes(command.name)) {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      return message.reply('You need administrator permissions!');
    }
  }
  
  executeCommand(command, message);
});
```

## Next Steps

- [Events](/events) - Learn about all available events
- [Examples](/examples) - See real-world bot examples
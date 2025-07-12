# Events

Yurba.js provides a comprehensive event system to handle all platform interactions.

## Client Events

### ready
Emitted when the client is ready to start working.

```javascript
client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});
```

### error
Emitted when an error occurs.

```javascript
client.on('error', (error) => {
  console.error('Client error:', error);
});
```

### disconnect
Emitted when the client disconnects.

```javascript
client.on('disconnect', () => {
  console.log('Client disconnected');
});
```

## Message Events

### messageCreate
Emitted when a message is created.

```javascript
client.on('messageCreate', (message) => {
  console.log(`${message.author.username}: ${message.content}`);
});
```

### messageUpdate
Emitted when a message is updated.

```javascript
client.on('messageUpdate', (oldMessage, newMessage) => {
  console.log(`Message edited: ${oldMessage.content} -> ${newMessage.content}`);
});
```

### messageDelete
Emitted when a message is deleted.

```javascript
client.on('messageDelete', (message) => {
  console.log(`Message deleted: ${message.content}`);
});
```

## User Events

### userUpdate
Emitted when a user updates their profile.

```javascript
client.on('userUpdate', (oldUser, newUser) => {
  console.log(`${oldUser.username} changed their username to ${newUser.username}`);
});
```

### presenceUpdate
Emitted when a user's presence changes.

```javascript
client.on('presenceUpdate', (oldPresence, newPresence) => {
  console.log(`${newPresence.user.username} is now ${newPresence.status}`);
});
```

## Channel Events

### channelCreate
Emitted when a channel is created.

```javascript
client.on('channelCreate', (channel) => {
  console.log(`Channel created: ${channel.name}`);
});
```

### channelUpdate
Emitted when a channel is updated.

```javascript
client.on('channelUpdate', (oldChannel, newChannel) => {
  console.log(`Channel updated: ${oldChannel.name} -> ${newChannel.name}`);
});
```

### channelDelete
Emitted when a channel is deleted.

```javascript
client.on('channelDelete', (channel) => {
  console.log(`Channel deleted: ${channel.name}`);
});
```

## Event Handler Best Practices

### Separate Event Files

Create separate files for different event categories:

```javascript
// events/ready.js
module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};

// events/messageCreate.js
module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (message.author.bot) return;
    // Handle message
  },
};
```

### Dynamic Event Loading

```javascript
const fs = require('fs');
const path = require('path');

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}
```

### Error Handling

Always handle errors in your event listeners:

```javascript
client.on('messageCreate', async (message) => {
  try {
    // Your message handling logic
    await handleMessage(message);
  } catch (error) {
    console.error('Error handling message:', error);
  }
});
```

## Next Steps

- [Examples](/examples) - See complete bot examples
- [API Reference](https://yurbajs.pages.dev/) - Full API documentation
# Yurba.js (TEST RELEASE)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/yurba.js.svg?maxAge=3600)](https://www.npmjs.com/package/yurba.js)
[![npm downloads](https://img.shields.io/npm/dt/yurba.js.svg?maxAge=3600)](https://www.npmjs.com/package/yurba.js)
[![Documentation](https://github.com/RastGame/Yurba.js/actions/workflows/static.yml/badge.svg)](https://rastgame.github.io/Yurba.js/)
[![npm version](https://rasgen.vercel.app/api/npm?package=yurba.js&type=version)](https://www.npmjs.com/package/yurba.js)
[![npm downloads](https://rasgen.vercel.app/api/npm?package=yurba.js&type=downloads)](https://www.npmjs.com/package/yurba.js)

# About
Yurba.js is a 




```js
import { Client } from 'yurba.js';
## Overview

(async () => {
  const client = new Client({ token: process.env.YURBA_TOKEN });
Yurba.js is a powerful, module-based Node.js library that provides seamless integration with the Yurba.one messaging platform. With its focus on performance, reliability and extensibility, Yurba.js offers developers a comprehensive API for handling real-time communication, message processing, and RESTful interactions.

  client.once('ready', () => {
    console.log('✅ Yurba.js client is ready');
  });
## Key Features

  client.on('message', async (message) => {
    console.log(`🔔 Message from ${message.User.Tag}: ${message.Text}`);
    if (message.Text.toLowerCase() === 'ping') {
      await message.reply('Pong!');
    }
  });

  client.registerCommand('sum', { a: 'int', b: 'int' }, async (msg, { a, b }) => {
    await msg.reply(`Result: ${a + b}`);
  });

  await client.init();
})();
```

## Documentation & Support

* **API Reference**: [https://rastgame.github.io/Yurba.js/](https://rastgame.github.io/Yurba.js/)
* **Source Code**: [https://github.com/rastgame/yurba.js](https://github.com/rastgame/yurba.js)
* **Issue Tracker**: [https://github.com/rastgame/yurba.js/issues](https://github.com/rastgame/yurba.js/issues)
* **Community**: Join discussions on the Yurba.one forum

## License

This project is distributed under the terms of the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
- **Real-time WebSocket Communication**
  - Maintain stable, low-latency connections
  - Automatic reconnection handling
  - Built-in connection state management
  
- **Rich Messaging Capabilities** 
  - Send/receive text, media and structured messages
  - Edit and delete message support
  - Message threading and replies
  - Reaction handling
  
- **Advanced Command System**
  - Type-safe command registration
  - Automatic argument parsing and validation
  - Command aliases and groups
  - Permission management
  
- **Robust Event System**
  - Comprehensive event coverage


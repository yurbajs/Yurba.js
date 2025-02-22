
<a href="https://www.npmjs.com/package/yurbacli"><img src="https://img.shields.io/npm/v/yurbacli.svg?maxAge=3600" alt="npm version" /></a>

# Yurba Bot Client Library
This library is under complete redevelopment and is therefore unavailable.

## Features
- ...

## Example usage
### Install yurbacli
```bash
npm install yurbacli
```
### Create new simple bot and registe command 
```javascript
// bot.js
const { Client } = require('yurbacli');

const bot = new Client('TOKEN', '!');

bot.registerCommand('ping', {}, async (msg) => {
	msg.reply('pong');
});

bot.init();
```


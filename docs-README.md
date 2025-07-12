# Yurba.js Documentation

Welcome to the comprehensive documentation for Yurba.js - a powerful library for creating bots and integrating with the Yurba API.

## 📦 Packages

This documentation covers all Yurba.js packages:

- **[yurba.js](./modules/yurba.js.html)** - Main library for bot development
- **[@yurbajs/rest](./modules/_yurbajs_rest.html)** - REST API client
- **[@yurbajs/ws](./modules/_yurbajs_ws.html)** - WebSocket client
- **[@yurbajs/types](./modules/_yurbajs_types.html)** - TypeScript definitions

## 🚀 Quick Start

```typescript
import { Client } from 'yurba.js';

const client = new Client({
  token: 'your-bot-token'
});

client.on('ready', () => {
  console.log('Bot is ready!');
});

client.login();
```

## 📚 Navigation

Use the sidebar to navigate through different modules, classes, and interfaces. Each package is organized with clear categories for easy browsing.

## 🔗 Links

- [GitHub Repository](https://github.com/RastGame/Yurba.js)
- [NPM Package](https://www.npmjs.com/package/yurba.js)
- [Yurba.one Platform](https://yurba.one)

---

Generated with ❤️ by TypeDoc
# TEST REALESE

# yurbacli

Yurba Bot Library for Node.js

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

## Description

`yurba.js` is a TypeScript library for building bots and integrating with the [Yurba.one](https://yurba.one) API. It provides a client for real-time messaging, command handling, and REST API access.

## Features

- Connect to Yurba.one via WebSocket
- Send and receive messages
- Register and handle commands
- Access Yurba.one REST API (users, dialogs, posts, etc.)
- TypeScript types for all major API objects

## Installation

```sh
npm install yurba.js
```

## Usage

```ts
import { Client } from "yurba.js";

const client = new Client("YOUR_TOKEN");

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("message", (msg) => {
  if (msg.Text === "/ping") {
    msg.reply("Pong!");
  }
});

client.init();
```

## Scripts

- `npm run build` — Compile TypeScript to JavaScript
- `npm run dev` — Start in development mode with auto-reload
- `npm run test` — Run tests
- `npm run docs` — Generate API documentation with TypeDoc

## Documentation

API documentation can be generated with:

```sh
npm run docs
```

Docs output is in the [`docs/`](docs/) folder.

## License

This project is licensed under the [Apache-2.0 License](LICENSE).

## Links

- [GitHub Repository](https://github.com/rastgame/yurba.js)
- [Yurba.one](https://yurba.one)

```

You can copy this into your README.md file.
```

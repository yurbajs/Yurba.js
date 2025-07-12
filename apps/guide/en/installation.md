# Installation

## Requirements

- Node.js 16.0.0 or higher
- npm, pnpm, or yarn

## Install Yurba.js

::: code-group

```bash [npm]
npm install yurba.js
```

```bash [pnpm]
pnpm add yurba.js
```

```bash [yarn]
yarn add yurba.js
```

:::

## TypeScript Support

Yurba.js is written in TypeScript and includes full type definitions. No additional `@types` packages needed!

```typescript
import { Client, ClientOptions } from 'yurba.js';

const options: ClientOptions = {
  token: 'your-token'
};

const client = new Client(options);
```

## Verify Installation

Create a simple test file to verify everything works:

```typescript
// test.ts
import { Client } from 'yurba.js';

console.log('Yurba.js installed successfully!');
```

```bash
npx tsx test.ts
# or
node -r ts-node/register test.ts
```
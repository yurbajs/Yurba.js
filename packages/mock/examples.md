# Приклади використання @yurbajs/mock

## Express Server

```js
import { Server } from '@yurbajs/mock';

const mockserver = new Server({
    port: 3333, // default 3000
});

mockserver.start();
```

## MSW (Mock Service Worker)

```js
import { setupServer } from 'msw/node';
import { handlers } from '@yurbajs/mock';

// Для Node.js тестів
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```js
import { setupWorker } from 'msw/browser';
import { handlers } from '@yurbajs/mock';

// Для браузера
const worker = setupWorker(...handlers);
worker.start();
```

## CLI

```bash
# Default port 3000
yurba-mock

# Custom port
yurba-mock --port=3333
```
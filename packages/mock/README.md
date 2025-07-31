<div align="center">
  <br />
  <p>
    <a href="https://yurba.js.org"><img src="https://yurba.js.org/banner.svg" width="500" alt="yurba.js logo" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@yurbajs/ws"><img src="https://img.shields.io/npm/v/@yurbajs/ws.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@yurbajs/ws"><img src="https://img.shields.io/npm/dt/@yurbajs/ws.svg?maxAge=3600" alt="npm downloads" /></a>
    <a href="https://github.com/yurbajs/yurba.js/commits/main"><img src="https://img.shields.io/github/last-commit/yurbajs/yurba.js.svg?logo=github&logoColor=ffffff" alt="Last commit" /></a>
    <a href="https://www.npmjs.com/package/@yurbajs/ws"><img src="https://img.shields.io/npm/last-update/@yurbajs/ws" alt="npm last update"></a>
  </p>
</div>

## About
Mock server api.yurba.one

> WARNING: it's alpha version 

## Install
Node.js 20 or newer is required.

```sh
npm install @yurbajs/mock
yarn add @yurbajs/mock
pnpm add @yurbajs/mock
bun add @yurbajs/mock
```

## Example usage

### Express Server

```js
import { Server } from '@yurbajs/mock';

const mockserver = new Server({
    port: 3333, // default 3000
});

mockserver.start();
```

### MSW (Mock Service Worker)

```js
// For Node.js tests
import { setupServer } from 'msw/node';
import { handlers } from '@yurbajs/mock';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```js
// For browser
import { setupWorker } from 'msw/browser';
import { handlers } from '@yurbajs/mock';

const worker = setupWorker(...handlers);
worker.start();
```

### CLI

```sh
# Default port 3000
yurba-mock

# Custom port
yurba-mock --port=3333
```

## Links

* [Website][website] ([source][website-source])
* [Documentation][documentation]
* [Yurba Account][yurba]
* [Yurba Channel][yurba-channel]
* [Yurba Chat][yurba-chat]
* [GitHub][source]
* [npm][npm]

## Contributing

Want to help make yurba.js better?

* Found a bug? [Open an issue](https://github.com/yurbajs/yurba.js/issues/new).
* Have an idea? [Start a discussion](https://github.com/yurbajs/yurba.js/discussions).
* Want to contribute code? Fork the repository and submit a pull request.

Please make sure to follow our coding style and test your changes before submitting.

## Getting Help

Need assistance?

* Check the [documentation][documentation] first.
* Ask questions in our [Chat][yurba-chat].
* Browse existing [issues](https://github.com/yurbajs/yurba.js/issues) and [discussions](https://github.com/yurbajs/yurba.js/discussions).

[source]: https://github.com/yurbajs/yurba.js/tree/main/packages/ws
[website]: https://yurba.js.org
[website-source]: https://github.com/yurbajs/yurba.js
[documentation]: https://yurba.js.org/docs
[yurba]: https://me.yurba.one/yurbajs
[yurba-channel]: https://me.yurba.one/yjs
[yurba-chat]: https://me.yurba.one/yurba.js
[npm]: https://www.npmjs.com/package/@yurbajs/ws
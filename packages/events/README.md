<div align="center">
  <br />
  <p>
    <a href="https://yurba.js.org"><img src="https://yurba.js.org/banner.svg" width="500" alt="yurba.js logo" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@yurbajs/events"><img src="https://img.shields.io/npm/v/@yurbajs/events.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@yurbajs/events"><img src="https://img.shields.io/npm/dt/@yurbajs/events.svg?maxAge=3600" alt="npm downloads" /></a>
    <a href="https://github.com/yurbajs/yurba.js/commits/main"><img src="https://img.shields.io/github/last-commit/yurbajs/yurba.js.svg?logo=github&logoColor=ffffff" alt="Last commit" /></a>
    <a href="https://www.npmjs.com/package/@yurbajs/events"><img src="https://img.shields.io/npm/last-update/@yurbajs/events" alt="npm last update"></a>
  </p>
</div>

## About
Events is a fork of [mitt](https://www.npmjs.com/package/mitt) upgraded for yurbajs, and will be used in the main package

## Install
Node.js 20 or newer is required.

```sh
npm install @yurbajs/events
yarn add @yurbajs/events
pnpm add @yurbajs/events
bun add @yurbajs/events
```

## Example usage
```js
import { Events } from '@yurbajs/events';

const events = new Events();

// Register an event handler
events.on('message', data => {
  console.log('Message received:', data);
});

// Emit an event
events.emit('message', { text: 'Hello World!' });

// Remove specific event handler
const handler = data => console.log(data);
events.on('event', handler);
events.off('event', handler);

// Remove all event handlers
events.all.clear();
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

[source]: https://github.com/yurbajs/yurba.js/tree/main/packages/events
[website]: https://yurba.js.org
[website-source]: https://github.com/yurbajs/yurba.js
[documentation]: https://yurbajs.pages.dev/
[yurba]: https://me.yurba.one/yurbajs
[yurba-channel]: https://me.yurba.one/yjs
[yurba-chat]: https://me.yurba.one/yurba.js
[npm]: https://www.npmjs.com/package/@yurbajs/events
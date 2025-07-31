// Example usage of @yurbajs/mock

// Express Server example
import { Server } from '@yurbajs/mock';

const server = new Server({ port: 3333 });
server.start();

// MSW example (uncomment when msw is installed)
/*
import { setupServer } from 'msw/node';
import { handlers } from '@yurbajs/mock';

const mswServer = setupServer(...handlers);
mswServer.listen();
console.log('MSW server started');
*/
// Express Server Example
import { Server } from '@yurbajs/mock';

const server = new Server({ port: 3000 });
server.start();

// Server буде доступний на http://localhost:3000
// GET /user/123/testuser - поверне mock користувача
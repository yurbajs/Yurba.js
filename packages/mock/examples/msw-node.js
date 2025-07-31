// MSW Node.js Example (для тестів)
import { setupServer } from 'msw/node';
import { handlers } from '@yurbajs/mock';

const server = setupServer(...handlers);

server.listen();

// Тест з api.yurba.one
fetch('https://api.yurba.one/user/123')
  .then(res => res.json())
  .then(data => console.log(data));

// Або по тегу
fetch('https://api.yurba.one/user/testuser')
  .then(res => res.json())
  .then(data => console.log(data));

server.close();
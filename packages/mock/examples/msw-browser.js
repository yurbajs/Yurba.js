// MSW Browser Example
import { setupWorker } from 'msw/browser';
import { handlers } from '@yurbajs/mock';

const worker = setupWorker(...handlers);

worker.start();

// Запити до api.yurba.one будуть перехоплені
fetch('https://api.yurba.one/user/123')
  .then(res => res.json())
  .then(data => console.log(data));
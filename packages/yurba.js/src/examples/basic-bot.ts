import { Client } from '../client/Client';

// Створюємо клієнта з опціями (схоже на discord.js)
const client = new Client('y.YOUR_TOKEN_HERE', {
  prefix: '!',
  maxReconnectAttempts: 10,
  debug: true
});

// Middleware для логування всіх повідомлень
client.use(async (message) => {
  console.log(`[${message.Type}] ${message.Message?.Author?.Name}: ${message.Message?.Text}`);
}, { name: 'message-logger', priority: 1 });

// Middleware для фільтрації спаму
client.use(async (message) => {
  if (message.Message?.Text?.includes('spam')) {
    console.log('Spam detected, ignoring message');
    return;
  }
}, { name: 'spam-filter', priority: 2 });

// Команда привітання
client.registerCommand('hello', { name: ['string', 'World'] }, async (message, args: any) => {
  await message.reply?.(`Hello, ${args.name}!`);
});

// Команда з користувачем
client.registerCommand('info', { user: 'user' }, async (message, args: any) => {
  const user = args.user;
  await message.reply?.(`User info: ${user.Name} (ID: ${user.ID})`);
});

// Команда з математикою
client.registerCommand('add', { a: 'int', b: 'int' }, async (message, args: any) => {
  const result = args.a + args.b;
  await message.reply?.(`${args.a} + ${args.b} = ${result}`);
});

// Події клієнта (схоже на discord.js)
client.once('ready', () => {
  console.log(`Bot ${client.user?.Name} is ready!`);
});

client.on('message', (message) => {
  console.log(message)
  // Обробка звичайних повідомлень
});

client.on('commandError', ({ error, message }) => {
  console.error('Command error:', error);
  message.reply?.('Sorry, there was an error executing that command.');
});

client.on('unknownCommand', (commandText, message) => {
  message.reply?.(`Unknown command: ${commandText}`);
});

// Ініціалізація клієнта
client.init().catch(console.error);
# Швидкий старт

Цей посібник допоможе вам створити вашого першого бота за кілька хвилин.

## Створення проекту

Створіть новий файл `bot.js`:

```javascript
const { Client } = require('yurba.js');

const client = new Client({
  token: 'ВАШ_ТОКЕН_БОТА'
});

client.on('ready', () => {
  console.log(`Бот ${client.user.username} готовий до роботи!`);
});

client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

client.login();
```

## Отримання токена

1. Перейдіть на [Yurba.one](https://yurba.one)
2. Створіть нового бота
3. Скопіюйте токен бота
4. Замініть `ВАШ_ТОКЕН_БОТА` на справжній токен

## Запуск бота

```bash
node bot.js
```

## Наступні кроки

- [Створення бота](/uk/creating-bot) - детальний посібник
- [Команди](/uk/commands) - як обробляти команди
- [Події](/uk/events) - робота з подіями
# Приклади

> ⚠️ **Тестова версія** - Повна документація доступна [англійською мовою](../examples)

Реальні приклади, які допоможуть вам створювати дивовижних ботів з Yurba.js.

## Простий Echo бот

Простий бот, який повторює повідомлення користувачів:

```javascript
const { Client } = require('yurba.js');

const client = new Client({
  token: process.env.BOT_TOKEN
});

client.on('ready', () => {
  console.log(`${client.user.username} онлайн!`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  if (message.content.startsWith('!echo ')) {
    const text = message.content.slice(6);
    message.reply(text);
  }
});

client.login();
```

## Бот модератор

Бот з базовими функціями модерації:

```javascript
const { Client } = require('yurba.js');

const client = new Client({
  token: process.env.BOT_TOKEN
});

const moderators = ['user_id_1', 'user_id_2'];

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const args = message.content.split(' ');
  const command = args[0].toLowerCase();
  
  // Перевірка чи користувач модератор
  if (!moderators.includes(message.author.id)) {
    return message.reply('Вам потрібні права модератора!');
  }
  
  switch (command) {
    case '!kick':
      const userToKick = message.mentions.users.first();
      if (userToKick) {
        message.reply(`Кікнуто ${userToKick.username}`);
      }
      break;
      
    case '!ban':
      const userToBan = message.mentions.users.first();
      if (userToBan) {
        message.reply(`Забанено ${userToBan.username}`);
      }
      break;
  }
});

client.login();
```

## Наступні кроки

- [API Довідник](https://yurbajs.pages.dev/) - Повна документація API
- [GitHub Репозиторій](https://github.com/RastGame/Yurba.js) - Вихідний код та більше прикладів
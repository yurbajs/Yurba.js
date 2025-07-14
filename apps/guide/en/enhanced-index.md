---
layout: page
---

<EnhancedHero />

<FeatureShowcase />

## Швидкий старт

Почніть використовувати Yurba.js за лічені хвилини:

### 1. Встановлення

```bash
npm install yurba.js
# або
yarn add yurba.js
# або
pnpm add yurba.js
```

### 2. Базове використання

```javascript
import { YurbaClient } from 'yurba.js'

const bot = new YurbaClient({
  token: 'YOUR_BOT_TOKEN'
})

bot.on('ready', () => {
  console.log(`Бот ${bot.user.username} готовий до роботи!`)
})

bot.on('message', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong! 🏓')
  }
})

bot.login()
```

### 3. TypeScript підтримка

```typescript
import { YurbaClient, Message } from 'yurba.js'

const bot = new YurbaClient({
  token: process.env.BOT_TOKEN!,
  prefix: '!'
})

bot.on('message', (message: Message) => {
  // Повне автодоповнення та типізація
  if (message.author.bot) return
  
  if (message.content.startsWith('!hello')) {
    message.channel.send(`Привіт, ${message.author.username}!`)
  }
})
```

## Приклади використання

### Команди з аргументами

```javascript
bot.on('message', (message) => {
  const args = message.content.slice(1).split(' ')
  const command = args.shift()?.toLowerCase()
  
  switch (command) {
    case 'say':
      message.channel.send(args.join(' '))
      break
      
    case 'avatar':
      const user = message.mentions.users.first() || message.author
      message.channel.send(`Аватар ${user.username}: ${user.avatarURL()}`)
      break
  }
})
```

### Обробка подій

```javascript
// Користувач приєднався до каналу
bot.on('userJoin', (user, channel) => {
  channel.send(`Ласкаво просимо, ${user.username}! 👋`)
})

// Повідомлення було видалено
bot.on('messageDelete', (message) => {
  console.log(`Видалено повідомлення: ${message.content}`)
})

// Помилка підключення
bot.on('error', (error) => {
  console.error('Помилка бота:', error)
})
```

## Корисні посилання

- 📚 [Повна документація](https://yurbajs.pages.dev/)
- 🚀 [Посібник для початківців](/start)
- 💬 [Спільнота Yurba](https://me.yurba.one/yurba.js)
- 🐛 [Повідомити про баг](https://github.com/RastGame/Yurba.js/issues)
- 💡 [Запропонувати ідею](https://github.com/RastGame/Yurba.js/discussions)

---

<div style="text-align: center; margin: 4rem 0; padding: 2rem; background: linear-gradient(135deg, rgba(189, 52, 254, 0.1), rgba(65, 209, 255, 0.1)); border-radius: 16px; border: 1px solid rgba(65, 209, 255, 0.2);">
  <h3 style="color: var(--vp-c-brand-1); margin-bottom: 1rem;">Готові почати?</h3>
  <p style="color: var(--vp-c-text-2); margin-bottom: 2rem;">Створіть свого першого бота за 5 хвилин!</p>
  <a href="/start" style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #bd34fe, #41d1ff); color: white; padding: 1rem 2rem; border-radius: 12px; text-decoration: none; font-weight: 600; transition: transform 0.2s ease;">
    🚀 Почати зараз
  </a>
</div>
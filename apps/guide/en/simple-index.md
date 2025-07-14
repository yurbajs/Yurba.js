---
layout: home

hero:
  name: "Yurba.js"
  text: "- Let's go?"
  tagline: "Потужна бібліотека для створення ботів та інтеграції з Yurba API"
  image:
    src: /banner.svg
    alt: Yurba.js

features:
  - icon: ⚡
    title: Швидкість
    details: Оптимізована архітектура для максимальної продуктивності
  - icon: 🛡️
    title: Безпека
    details: Вбудовані механізми захисту та валідації даних
  - icon: 🎯
    title: Простота
    details: Інтуїтивний API, схожий на Discord.js
  - icon: 🔧
    title: Гнучкість
    details: Модульна архітектура для будь-яких потреб
  - icon: 📚
    title: TypeScript
    details: Повна підтримка TypeScript з автодоповненням
  - icon: 🌐
    title: Спільнота
    details: Активна спільнота та регулярні оновлення
---

<HeroActions />

<SimpleHero />

## Швидкий старт

### Встановлення

::: code-group

```bash [npm]
npm install yurba.js
```

```bash [yarn]
yarn add yurba.js
```

```bash [pnpm]
pnpm add yurba.js
```

:::

### Базове використання

```javascript
import { YurbaClient } from 'yurba.js'

const bot = new YurbaClient({
  token: 'YOUR_BOT_TOKEN'
})

bot.on('ready', () => {
  console.log(`Бот ${bot.user.username} готовий!`)
})

bot.on('message', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong! 🏓')
  }
})

bot.login()
```

### TypeScript

```typescript
import { YurbaClient, Message } from 'yurba.js'

const bot = new YurbaClient({
  token: process.env.BOT_TOKEN!
})

bot.on('message', (message: Message) => {
  if (message.content.startsWith('!hello')) {
    message.channel.send(`Привіт, ${message.author.username}!`)
  }
})
```

## Корисні посилання

- 📚 [Повна документація](https://yurbajs.pages.dev/)
- 🚀 [Посібник для початківців](/start)
- 💬 [Спільнота](https://me.yurba.one/yurba.js)
- 🐛 [GitHub Issues](https://github.com/RastGame/Yurba.js/issues)
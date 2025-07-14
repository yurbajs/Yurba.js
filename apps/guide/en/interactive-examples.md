# Інтерактивні приклади

Спробуйте Yurba.js прямо в браузері! Редагуйте код та дивіться результат в реальному часі.

## Базовий бот

<CodePlayground 
  :code="`import { YurbaClient } from 'yurba.js'

const bot = new YurbaClient({
  token: 'YOUR_BOT_TOKEN'
})

bot.on('ready', () => {
  console.log('Бот готовий до роботи!')
})

bot.on('message', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong! 🏓')
  }
})

bot.login()`"
  language="javascript"
  :editable="true"
  :runnable="true"
  explanation="<p>Цей приклад показує базове створення бота з Yurba.js:</p>
  <ul>
    <li><strong>YurbaClient</strong> - основний клас для створення бота</li>
    <li><strong>ready</strong> - подія, що спрацьовує коли бот готовий</li>
    <li><strong>message</strong> - подія для обробки повідомлень</li>
    <li><strong>reply</strong> - метод для відповіді на повідомлення</li>
  </ul>"
  :relatedLinks="[
    { title: 'Документація YurbaClient', url: '/api/client' },
    { title: 'Події бота', url: '/guide/events' }
  ]"
/>

## Команди з аргументами

<CodePlayground 
  :code="`bot.on('message', (message) => {
  // Перевіряємо чи повідомлення починається з префіксу
  if (!message.content.startsWith('!')) return
  
  // Розбиваємо на команду та аргументи
  const args = message.content.slice(1).split(' ')
  const command = args.shift()?.toLowerCase()
  
  switch (command) {
    case 'say':
      if (args.length === 0) {
        message.reply('Вкажіть що сказати!')
        return
      }
      message.channel.send(args.join(' '))
      break
      
    case 'avatar':
      const user = message.mentions.users.first() || message.author
      message.channel.send({
        content: \`Аватар користувача \${user.username}:\`,
        embeds: [{
          image: { url: user.avatarURL() }
        }]
      })
      break
      
    case 'info':
      message.channel.send({
        embeds: [{
          title: 'Інформація про сервер',
          fields: [
            { name: 'Назва', value: message.guild.name },
            { name: 'Учасників', value: message.guild.memberCount.toString() }
          ]
        }]
      })
      break
      
    default:
      message.reply('Невідома команда! Доступні: say, avatar, info')
  }
})`"
  language="javascript"
  :editable="true"
  :runnable="true"
  explanation="<p>Приклад системи команд з аргументами:</p>
  <ul>
    <li><strong>slice(1)</strong> - видаляємо префікс '!'</li>
    <li><strong>split(' ')</strong> - розбиваємо на слова</li>
    <li><strong>shift()</strong> - отримуємо першу команду</li>
    <li><strong>mentions</strong> - доступ до згаданих користувачів</li>
    <li><strong>embeds</strong> - створення красивих повідомлень</li>
  </ul>"
/>

## Обробка подій

<CodePlayground 
  :code="`// Користувач приєднався до каналу
bot.on('userJoin', (user, channel) => {
  console.log(\`\${user.username} приєднався до \${channel.name}\`)
  
  channel.send({
    content: \`Ласкаво просимо, \${user.username}! 👋\`,
    embeds: [{
      title: 'Новий учасник!',
      description: \`\${user.username} приєднався до нашої спільноти\`,
      color: 0x00ff00,
      thumbnail: { url: user.avatarURL() },
      timestamp: new Date().toISOString()
    }]
  })
})

// Повідомлення було видалено
bot.on('messageDelete', (message) => {
  console.log(\`Видалено повідомлення від \${message.author.username}\`)
  
  // Логування в спеціальний канал
  const logChannel = message.guild.channels.cache.find(ch => ch.name === 'logs')
  if (logChannel) {
    logChannel.send({
      embeds: [{
        title: '🗑️ Повідомлення видалено',
        fields: [
          { name: 'Автор', value: message.author.username },
          { name: 'Канал', value: message.channel.name },
          { name: 'Контент', value: message.content || 'Немає тексту' }
        ],
        color: 0xff0000,
        timestamp: new Date().toISOString()
      }]
    })
  }
})

// Помилка підключення
bot.on('error', (error) => {
  console.error('Помилка бота:', error)
  
  // Можна відправити повідомлення адміністратору
  const adminChannel = bot.channels.cache.get('ADMIN_CHANNEL_ID')
  if (adminChannel) {
    adminChannel.send(\`⚠️ Помилка бота: \${error.message}\`)
  }
})`"
  language="javascript"
  :editable="true"
  :runnable="true"
  explanation="<p>Обробка різних подій бота:</p>
  <ul>
    <li><strong>userJoin</strong> - користувач приєднався</li>
    <li><strong>messageDelete</strong> - повідомлення видалено</li>
    <li><strong>error</strong> - обробка помилок</li>
    <li><strong>embeds</strong> - структуровані повідомлення</li>
    <li><strong>timestamp</strong> - додавання часу</li>
  </ul>"
/>

## TypeScript приклад

<CodePlayground 
  :code="`import { YurbaClient, Message, User, TextChannel } from 'yurba.js'

interface BotConfig {
  token: string
  prefix: string
  adminIds: string[]
}

interface CommandContext {
  message: Message
  args: string[]
  user: User
  channel: TextChannel
}

class MyBot {
  private client: YurbaClient
  private config: BotConfig
  
  constructor(config: BotConfig) {
    this.config = config
    this.client = new YurbaClient({
      token: config.token
    })
    
    this.setupEvents()
  }
  
  private setupEvents(): void {
    this.client.on('ready', () => {
      console.log(\`Бот \${this.client.user?.username} готовий!\`)
    })
    
    this.client.on('message', (message: Message) => {
      this.handleMessage(message)
    })
  }
  
  private async handleMessage(message: Message): Promise<void> {
    if (message.author.bot) return
    if (!message.content.startsWith(this.config.prefix)) return
    
    const args = message.content
      .slice(this.config.prefix.length)
      .trim()
      .split(/ +/)
    
    const command = args.shift()?.toLowerCase()
    if (!command) return
    
    const context: CommandContext = {
      message,
      args,
      user: message.author,
      channel: message.channel as TextChannel
    }
    
    await this.executeCommand(command, context)
  }
  
  private async executeCommand(
    command: string, 
    ctx: CommandContext
  ): Promise<void> {
    switch (command) {
      case 'ping':
        await ctx.message.reply('Pong! 🏓')
        break
        
      case 'kick':
        if (!this.isAdmin(ctx.user.id)) {
          await ctx.message.reply('У вас немає прав!')
          return
        }
        
        const userToKick = ctx.message.mentions.users.first()
        if (!userToKick) {
          await ctx.message.reply('Вкажіть користувача для кіку!')
          return
        }
        
        // Логіка кіку користувача
        console.log(\`Кікаємо \${userToKick.username}\`)
        break
        
      default:
        await ctx.message.reply('Невідома команда!')
    }
  }
  
  private isAdmin(userId: string): boolean {
    return this.config.adminIds.includes(userId)
  }
  
  public async start(): Promise<void> {
    await this.client.login()
  }
}

// Використання
const bot = new MyBot({
  token: 'YOUR_BOT_TOKEN',
  prefix: '!',
  adminIds: ['123456789', '987654321']
})

bot.start()`"
  language="typescript"
  :editable="true"
  :runnable="false"
  explanation="<p>Приклад TypeScript бота з класовою архітектурою:</p>
  <ul>
    <li><strong>Інтерфейси</strong> - типізація конфігурації та контексту</li>
    <li><strong>Класи</strong> - організація коду</li>
    <li><strong>Приватні методи</strong> - інкапсуляція логіки</li>
    <li><strong>Async/await</strong> - асинхронна обробка</li>
    <li><strong>Type guards</strong> - перевірка типів</li>
  </ul>"
/>

## Модульна архітектура

<CodePlayground 
  :code="`// commands/ping.js
export const pingCommand = {
  name: 'ping',
  description: 'Перевірка затримки бота',
  async execute(message, args) {
    const sent = await message.reply('Перевіряю...')
    const latency = sent.createdTimestamp - message.createdTimestamp
    
    await sent.edit(\`🏓 Pong! Затримка: \${latency}ms\`)
  }
}

// commands/weather.js
export const weatherCommand = {
  name: 'weather',
  description: 'Погода в місті',
  async execute(message, args) {
    if (!args[0]) {
      return message.reply('Вкажіть назву міста!')
    }
    
    const city = args.join(' ')
    
    try {
      // Тут би був API запит до сервісу погоди
      const weather = await fetchWeather(city)
      
      message.channel.send({
        embeds: [{
          title: \`🌤️ Погода в \${city}\`,
          fields: [
            { name: 'Температура', value: \`\${weather.temp}°C\` },
            { name: 'Опис', value: weather.description },
            { name: 'Вологість', value: \`\${weather.humidity}%\` }
          ],
          color: 0x87CEEB
        }]
      })
    } catch (error) {
      message.reply('Не вдалося отримати дані про погоду!')
    }
  }
}

// bot.js
import { YurbaClient } from 'yurba.js'
import { pingCommand } from './commands/ping.js'
import { weatherCommand } from './commands/weather.js'

const bot = new YurbaClient({ token: 'YOUR_TOKEN' })
const commands = new Map()

// Реєстрація команд
commands.set(pingCommand.name, pingCommand)
commands.set(weatherCommand.name, weatherCommand)

bot.on('message', async (message) => {
  if (!message.content.startsWith('!')) return
  
  const args = message.content.slice(1).split(' ')
  const commandName = args.shift()?.toLowerCase()
  
  const command = commands.get(commandName)
  if (!command) return
  
  try {
    await command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('Помилка виконання команди!')
  }
})

bot.login()`"
  language="javascript"
  :editable="true"
  :runnable="false"
  explanation="<p>Модульна архітектура для великих ботів:</p>
  <ul>
    <li><strong>Окремі файли</strong> - кожна команда в своєму файлі</li>
    <li><strong>Map для команд</strong> - швидкий пошук команд</li>
    <li><strong>Стандартизований інтерфейс</strong> - всі команди мають однакову структуру</li>
    <li><strong>Обробка помилок</strong> - централізована обробка помилок</li>
    <li><strong>ES6 модулі</strong> - сучасний синтаксис імпорту</li>
  </ul>"
/>

## Корисні поради

### 🚀 Продуктивність
- Використовуйте `Map` замість об'єктів для команд
- Кешуйте часто використовувані дані
- Використовуйте `setTimeout` для затримок

### 🛡️ Безпека
- Завжди валідуйте вхідні дані
- Не зберігайте токени в коді
- Використовуйте rate limiting

### 📚 Кращі практики
- Розділяйте логіку на модулі
- Використовуйте TypeScript для великих проектів
- Пишіть тести для критичної функціональності

---

**Спробуйте самі!** Редагуйте код вище та експериментуйте з різними функціями Yurba.js.
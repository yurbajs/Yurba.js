# REST API для Yurba.one

Цей модуль надає REST-клієнт для взаємодії з API Yurba.one, організований за принципами REST.

## Структура

```
rest/
├── RestClient.ts           # Базовий REST клієнт
├── YurbaRestClient.ts      # Головний клієнт для роботи з API
├── Websocket.ts            # Клієнт для WebSocket з'єднань
├── index.ts                # Експорт всіх компонентів
└── resources/              # Ресурси REST API
    ├── AuthResource.ts     # Автентифікація
    ├── DialogResource.ts   # Діалоги
    ├── MediaResource.ts    # Медіа (фото, аудіо, плейлисти)
    ├── MessageResource.ts  # Повідомлення
    ├── PostResource.ts     # Пости
    └── UserResource.ts     # Користувачі
```

## Використання

```typescript
import { YurbaRestClient } from './rest';

// Створення клієнта
const client = new YurbaRestClient('your-token');

// Робота з користувачами
const me = await client.users.getMe();
const user = await client.users.getByTag('username');

// Робота з повідомленнями
const messages = await client.messages.getMessages(dialogId);
await client.messages.send(dialogId, 'Hello, world!');

// Робота з діалогами
const dialogs = await client.dialogs.getAll();
const members = await client.dialogs.getMembers(dialogId);

// Робота з постами
const posts = await client.posts.getPosts('username', 0);
await client.posts.create('username', 'Post content');

// Робота з медіа
const photo = await client.media.getPhoto(photoId);
const playlist = await client.media.getPlaylist(playlistId);

// Автентифікація
await client.auth.login('email@example.com', 'password');
await client.auth.register('Name', 'email@example.com', 'password');
```

## WebSocket

Для роботи з WebSocket з'єднаннями використовуйте клас `ReconnectingWebSocket`:

```typescript
import { ReconnectingWebSocket } from './rest';

const ws = new ReconnectingWebSocket('wss://api.yurba.one/ws');

ws.on('message', (data) => {
  console.log('Received:', data);
});

ws.send(JSON.stringify({ type: 'ping' }));
```
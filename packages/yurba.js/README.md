# Yurba.js

Офіційна JavaScript бібліотека для створення ботів на платформі [Yurba.one](https://yurba.one).

## Структура проекту

Проект організований як монорепозиторій з використанням Lerna:

```
yurbajs/
├── packages/
│   ├── core/         # Основний пакет yurba.js
│   ├── rest/         # REST клієнт (@yurbajs/rest)
│   └── ws/           # WebSocket клієнт (@yurbajs/ws)
└── apps/
    └── examples/     # Приклади використання
```

## Пакети

### yurba.js

Основний пакет для створення ботів на Yurba.one.

```bash
npm install yurba.js
```

### @yurbajs/rest

REST клієнт для взаємодії з API Yurba.one.

```bash
npm install @yurbajs/rest
```

### @yurbajs/ws

WebSocket клієнт для роботи з реальночасовими подіями Yurba.one.

```bash
npm install @yurbajs/ws
```

## Розробка

### Встановлення залежностей

```bash
npm install
```

### Збірка всіх пакетів

```bash
npm run build
```

### Запуск тестів

```bash
npm test
```

## Ліцензія

Apache-2.0
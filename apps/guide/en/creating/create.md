---
title: Create project
editLink: true
sidebar: true

---

# Create project
Вже майже готово! Приступаємо до створення проєкту та файлів бота

## Відриваємо папку/діректорію де буде бот 
Коли ви відриєте треба відкрити в цьому місці термінал та ініцізуавати проєкт створивши (`package.json`)
```sh
npm init
```
### Та заповняємо типу цього:
<img src="/images/npm-init.png" width="700" />

---

<img src="/images/package-json.png" width="500" />

` Enter `

По ітогу в нас вийде щось типу цього:
<img src="/images/ls-cat-package-json.png" width="800" />
> [!NOTE] Або якщо в редактору коду:
<img src="/images/vscodium-ls.png" width="800"  />

# Create config.json / .env

> [!NOTE] Рекомендація
Я б рекомендував все ж, використовувати `.env`, але вибір за вами

## Використання .config

::: code-group

```json [config.json]
{
	"token": "your-token-goes-here"
}
```

```javascript [Використання]
const { token } = require('./config.json');

console.log(token);
```

:::

> [!DANGER] 
> Якщо ви використовуєте `Git`, 


# Git та ``.gitignore``
---
title: Create project
editLink: true
sidebar: true

---

# Create project

Almost ready! Let's proceed to creating the project and bot files.

## Open the folder/directory where the bot will be located
Once you open it, you need to open a terminal in this location and initialize the project by creating (`package.json`)
```sh
npm init
```
### And fill it out like this:
<img src="/images/npm-init.png" width="700" />

---

<img src="/images/package-json.png" width="500" />

` Enter `

As a result, we'll get something like this:
<img src="/images/ls-cat-package-json.png" width="800" />
> [!NOTE] Or if in a code editor:
<img src="/images/vscodium-ls.png" width="800"  />

# Create config.json / .env

> [!NOTE] Recommendation
> I would still recommend using `.env`, but the choice is yours

## Using .config

::: code-group

```json [config.json]
{
	"token": "your-token-goes-here"
}
```

```javascript [Usage]
const { token } = require('./config.json');

console.log(token);
```

:::

> [!DANGER] 
> If you're using `Git`,


# Git and `.gitignore`
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
> If you're using Git, you should not commit this file and should [ignore it via `.gitignore`](/creating/create#git-and-gitignore)


## Using environment variables
Environment variables are special values for your environment (e.g., terminal session, Docker container, or environment variable file). You can pass these values into your code's scope so that you can use them.

One way to pass in environment variables is via the command line interface. When starting your app, instead of `node index.js`, use ` TOKEN=your-token-goes-here node index.js `. You can repeat this pattern to expose other values as well.

You can access the set values in your code via the `process.env` global variable, accessible in any file. Note that values passed this way will always be strings and that you might need to parse them to a number, if using them to do calculations.

::: code-group

```sh [Terminal]
A=123 B=456 YURBA_TOKEN=your-token-goes-here node index.js
```

```javascript [Usage]
console.log(process.env.A);
console.log(process.env.B);
console.log(process.env.YURBA_TOKEN);
```

> [!DANGER] 
> If you're using Git, you should not commit this file and should [ignore it via `.gitignore`](/creating/create#git-and-gitignore)

:::

### Using dotenv
Another common approach is storing these values in a `.env` file. This spares you from always copying your token into the command line. Each line in a `.env` file should hold a `KEY=value` pair.

You can use the [`dotenv` package](https://www.npmjs.com/package/dotenv) for this. Once installed, require and use the package to load your `.env` file and attach the variables to `process.env`:

::: code-group

```sh [npm]
npm install dotenv
```

```sh [pnpm]
pnpm add dotenv
```

```sh [yarn]
yarn add dotenv
```

```sh [bun]
# dotenv is not necessary with Bun
# Bun reads .env files automatically
```

::: 

::: code-group

```env [.env]
A=123
B=456
YURBA_TOKEN=your-token-goes-here
```

```javascript [Usage]
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.A);
console.log(process.env.B);
console.log(process.env.YURBA_TOKEN);
```


## Git and `.gitignore`
Git is a fantastic tool to keep track of your code changes and allows you to upload progress to services like [GitHub](https://github.com/), [GitLab](https://about.gitlab.com/), or [Bitbucket](https://bitbucket.org/product/). While this is super useful to share code with other developers, it also bears the risk of uploading your configuration files with sensitive values!

You can specify files that Git should ignore in its versioning systems with a .gitignore file. Create a .gitignore file in your project directory and add the names of the files and folders you want to ignore:

```
node_modules
.env
config.json
```

> [!TIP]
> Aside from keeping credentials safe, node_modules should be included here. Since this directory can be restored based on the entries in your package.json and package-lock.json files by running npm install, it does not need to be included in Git.
> You can specify quite intricate patterns in .gitignore files, check out the Git documentation on .gitignore for more information!
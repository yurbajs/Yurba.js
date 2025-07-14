---
title: Installing Node.js and yurba.js
editLink: true
sidebar: true
---

# Installing Node.js and yurba.js

## Install Node.js
To use yurba.js, you need to install Node.js, preferably the LTS version.

::: tip TIP
To check if you already have Node installed on your machine (e.g., if you're using a VPS), run `node -v` in your terminal. It is recommended to use the latest LTS version of Node.
:::


On Windows, it's as simple as installing any other program. Download the latest version from [the Node.js website](https://nodejs.org/en/download), open the downloaded file, and follow the steps from the installer.

On macOS, either:
- Download the latest version from [the Node.js website](https://nodejs.org/en/download), open the package installer, and follow the instructions
- Use a package manager like Homebrew with the command `brew install node` 

On Linux, you can consult [this page](https://nodejs.org/en/download) to determine how you should install Node.

#


## Install yurba.js

Once Node.js is installed, you can install yurba.js using your preferred package manager:

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

::: tip
We recommend using pnpm for better performance and disk space efficiency.
:::

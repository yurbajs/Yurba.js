---
title: Creating Your Bot Project
editLink: true
sidebar: true
---

# Creating Your Bot Project

Now that you have Node.js installed and your bot account configured, it's time to create your first yurba.js project. This guide will walk you through setting up a professional project structure with proper configuration management and security practices.

## Project Initialization

### Step 1: Create Project Directory

First, create a dedicated directory/folder for your bot project:

```sh
cd my-yurba-bot
```

### Step 2: Initialize Package.json

Initialize your Node.js project using your preferred package manager:

::: code-group

```bash [npm]
npm init
```

```bash [yarn]
yarn init
```

```bash [pnpm]
pnpm init
```

```bash [bun]
bun init
```

:::

You'll be prompted to fill out project information. Here's an example configuration:

<img src="/images/npm-init.png" width="700" alt="npm init process" />

### Step 3: Verify Package.json

After initialization, your `package.json` should look similar to this:

```json:line-numbers [package.json]
{
  "name": "my-yurba-bot",
  "version": "1.0.0",
  "description": "A powerful bot built with yurba.js",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["yurba", "bot", "yurba.js", "automation"],
  "author": "Your Name",
  "license": "MIT"
}
```

### Configuration File s

Create a `.env` file and the `config.json` file

::: code-group

```sh:line-numbers [.env]
YURBA_TOKEN=your-token-here
```

```json [config.json]
{
  "prefix": "/"
}
```

> [!DANGER] Security Warning
> Never commit the `.env`  file to version control. It contains sensitive information that should remain private.
> Or if you use only `config.json` with `token`

## Project Scripts

Add useful scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "tsc",
    "lint": "eslint . --ext .js,.ts",
    "lint:fix": "eslint . --ext .js,.ts --fix",
    "format": "prettier --write .",
    "test": "jest",
    "clean": "rm -rf dist node_modules package-lock.json && npm install"
  }
}
```

For TypeScript projects:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "dev:watch": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "build:watch": "tsc --watch",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write src",
    "test": "jest",
    "clean": "rm -rf dist node_modules package-lock.json && npm install"
  }
}
```

## Git Repository Setup

### Initialize Git Repository

```bash
# Initialize git repository
git init

# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/yourusername/my-yurba-bot.git
```

### Create .gitignore

Create a comprehensive `.gitignore` file to exclude sensitive and unnecessary files:

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Environment variables and configuration
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
config.json

# Build outputs
dist/
build/
*.tsbuildinfo

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
tmp/
temp/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port
```

> [!IMPORTANT] Critical Files to Ignore
> Always ensure these files are in your `.gitignore`:
>
> - `.env` - Contains sensitive tokens and API keys
> - `config.json` - May contain sensitive configuration
> - `node_modules/` - Large dependency directory
> - `*.log` - Log files may contain sensitive information

## Project Verification

### Verify Project Structure

Your project directory should now look like this:

<img src="/images/ls-cat-package-json.png" width="800" alt="Project structure in terminal" />

Or in your code editor:

<img src="/images/vscodium-ls.png" width="800" alt="Project structure in VS Code" />

```
my-yurba-bot/
├── .env                 # Environment variables (not in git)
├── .gitignore          # Git ignore rules
├── package.json        # Project configuration
├── package-lock.json   # Dependency lock file
├── config.js           # Configuration loader
└── README.md           # Project documentation
```

### Test Configuration Loading

Create a simple test to verify your configuration:

```javascript
// test-config.js
const config = require('./config');

try {
  config.validate();
  console.log('✅ Configuration is valid');
  console.log('Bot name:', config.name);
  console.log('Prefix:', config.prefix);
  console.log('Environment:', config.environment);
  console.log('Debug mode:', config.debug);
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  process.exit(1);
}
```

Run the test:

```bash
node test-config.js
```

## TypeScript Setup (Optional)

If you're using TypeScript, create a `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## Best Practices Summary

### ✅ Do This

- **Use environment variables** for sensitive configuration
- **Create a comprehensive .gitignore** file
- **Validate configuration** on startup
- **Use descriptive project names** and structure
- **Add useful npm scripts** for development
- **Document your project** with a good README

### ❌ Avoid This

- **Hard-coding tokens** in source code
- **Committing sensitive files** to version control
- **Using production tokens** in development
- **Ignoring error handling** in configuration
- **Skipping input validation** for configuration values

## Next Steps

Excellent! You now have a properly structured bot project with secure configuration management. You're ready to move on to [creating your main bot files](/creating/create-files) where you'll write your first bot code.

## Troubleshooting

### Common Issues

**Environment Variables Not Loading**

```bash
# Ensure dotenv is installed
npm install dotenv

# Check .env file exists and has correct format
cat .env
```

**Git Issues**

```bash
# Check git status
git status

# Ensure .gitignore is working
git check-ignore .env
```

**Permission Errors**

```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm
```

**Package Installation Failures**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

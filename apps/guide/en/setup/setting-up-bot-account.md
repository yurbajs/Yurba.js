---
title: Setting up a bot application
editLink: true
sidebar: true
---

# Setting up a Bot Application

Creating a bot account is a crucial step in your yurba.js development journey. This guide will walk you through the process of setting up your bot account and obtaining the necessary authentication tokens.

## Understanding Bot Accounts on Yurba.one

> [!NOTE] Important Information
> Currently, Yurba.one does not provide dedicated bot application endpoints. Instead, you'll need to create a regular user account that will serve as your bot. This approach is temporary and may change in future API versions.

### Why Use a Separate Account?

While you could technically use your personal account for bot development, we **strongly recommend** creating a dedicated account for several reasons:

- **Security**: Keeps your personal account separate from bot activities
- **Organization**: Makes it easier to manage bot-specific settings and data
- **Safety**: Reduces risk to your main account during development and testing
- **Professionalism**: Provides a clean, dedicated identity for your bot

## Creating Your Bot Account

### Step 1: Account Registration

Choose one of these registration methods:

#### Option A: Direct Registration
1. Navigate to [yurba.one/register](https://yurba.one/register/)
2. Fill out the registration form with your bot's information
3. Use a dedicated email address for your bot (e.g., `mybot@yourdomain.com`)
4. Choose a username that clearly identifies it as a bot
5. Complete the registration process

<img src="/images/register.png" width="800" alt="Yurba.one registration page" />

#### Option B: Google OAuth Registration
1. Visit [yurba.one/login](https://yurba.one/login/)
2. Click "Sign in with Google"
3. Use a Google account dedicated to your bot
4. Complete the OAuth flow



> [!TIP] Best Practices for Bot Accounts
> - Use descriptive usernames (e.g., `WeatherBot`, `ModeratorBot`)
> - Set a clear profile picture that represents your bot's function
> - Write a bio that explains what your bot does
> - Consider using a dedicated email domain for all your bots

### Step 2: Account Configuration

After registration, configure your bot account:

- **Profile Setup**
   - Upload a distinctive avatar
   - Write a clear description of your bot's purpose
   - Set appropriate privacy settings

## Obtaining Your Authentication Token

The authentication token is your bot's key to accessing the Yurba API. Handle it with extreme care.

### Accessing Token Settings

1. **Navigate to Security Settings**
   - Go to [Settings → Security](https://yurba.one/settings/?page=security)
   - Copy the token from sessions
   - Store it securely

<img src="/images/tokens.png" width="800" alt="Token generation interface" />

> [!DANGER] Critical Security Warning
> **Never share your token with anyone!** Your token provides complete access to your bot account. Treat it like a password and store it securely using environment variables or secure configuration files.

## Understanding Yurba Tokens

### Token Format

Yurba tokens follow a specific format:
- **Prefix**: Always start with `y.`
- **Length**: Typically 32-34 characters total
- **Characters**: Alphanumeric characters

**Example formats:**
```y.token
y.RT0ZALrC4tUwU7WmEGvq5XdlsRjpMlrL
y.lSRjyiajBHC3EoZ8lLbYDnBpwXiPN9u3
```

> [!NOTE] Example Tokens
> The tokens shown above are examples only and were invalidated before publication. 

## What If Your Token Is Compromised?

If you suspect your token has been compromised:

### Immediate Actions

1. **Revoke the Token**
   - Go to [Settings → Security](https://yurba.one/settings/?page=security)
   - Click "Stop sessions" 
   - This immediately invalidates the compromised token
   ::: warning
    Also, when logging into the account, a new token will be created. It's recommended `to delete it as well`, since there might be a script running that copies all tokens. Log into your account again - this token will definitely not be accessible to anyone but you
   :::


### Prevention Measures

- **Monitor Usage**: Regularly check your bot's activity logs
- **Limit Scope**: Only use tokens where necessary
- **Secure Storage**: Always use environment variables or secure config files
- **Regular Rotation**: Change tokens periodically
- **Access Control**: Limit who has access to your bot's configuration

## Account Recovery

If you lose access to your bot account:

1. **Password Reset**
   - Use the standard password reset process
   - Check the email associated with your bot account

2. **Contact Support**
   - If password reset fails, contact Yurba.one support
   - Provide proof of account ownership
   - Explain that this is a bot account

3. **Backup Strategies**
   - Keep backup access methods (recovery email, phone)
   - Document your bot's account details securely
   - Consider having multiple administrators for important bots

## Testing Your Setup

Before proceeding to development, verify your bot account is properly configured:

### Quick Test Script

Create a simple test to verify your token works:

```javascript
// test-token.js
const { Client } = require('yurba.js');

async function testToken() {
    try {
        const client = new Client(process.env.YURBA_TOKEN);
        
        // Test token by getting user info
        await client.init();
        
        console.log('✅ Token is valid!');
        console.log('Bot account:', client.user?.Name);
        console.log('Account ID:', client.user?.ID);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Token test failed:', error.message);
        process.exit(1);
    }
}

testToken();
```

Run the test:
```bash
YURBA_TOKEN=y.your-token-here node test-token.js
```

## Next Steps

Congratulations! You now have a properly configured bot account with a secure authentication token. You're ready to move on to [creating your bot project](/creating/create-project).

## Troubleshooting

### Common Issues

**Token Not Working**
- Verify the token format (starts with `y.`)
- Check for extra spaces or characters
- Ensure the token hasn't been revoked
- Try generating a new token

**Account Access Issues**
- Verify email and password
- Check for account suspension
- Try password reset
- Contact support if needed

**Security Concerns**
- Immediately revoke compromised tokens
- Change account password
- Enable additional security measures
- Review account activity

## Additional Resources

- **[Yurba.one API Documentation](https://docs.yurba.one/)** - Official API reference
- **[Security Best Practices](https://docs.yurba.one/security)** - Platform security guidelines
- **[Account Management](https://yurba.one/settings)** - Manage your bot account settings

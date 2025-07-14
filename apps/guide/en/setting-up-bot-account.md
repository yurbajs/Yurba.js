# Setting up a bot application

## Creating your bot account
Now that you have successfully installed Node.js and yurba.js, we're ready to get started, but first we need to create a bot account.

> [!NOTE] Information
> Unfortunately, at this time, yurba.one does not provide the ability to create a bot as a specific application, so we have to create a new account (User).

So let's get started!

1. Register a new account at [yurba.one](https://yurba.one/register/) or sign in [through Google](https://yurba.one/login/)

> [!NOTE] 
> You can also use your existing account and sign in (but this is not recommended)

<img src="/images/register.png" width="800" alt="register" />

2. Go to [Settings -> Security](https://yurba.one/settings/?page=security)

> [!DANGER] Token
> Never share your token with anyone, and it's better to store it in .env

<img src="/images/tokens.png" width="800" alt="tokens" />

## What is a token?
This is essentially your password for logging into the yurba.one system, which is why it's not advisable to share it with anyone, either intentionally or accidentally.

Tokens look like this: `y.RT0ZALrC4tUwU7WmEGvq5XdlsRjpMlrL` / `y.lSRjyiajBHC3EoZ8lLbYDnBpwXiPN9u3`. Tokens of this type always start with `y.` and have an average of 32 characters.

> [!NOTE]
> The tokens shown below were immediately deleted before this page was published.

## What happens if I lose my token?
If someone gains access to your token, they literally get all the capabilities to control:
- Spam
- Account deletion
- Name/link changes
- Using the token for attacks
- And much more

> [!DANGER] 
> If your bot token has been compromised or has become publicly accessible, return to the previous page and click "Stop sessions". If access to the account has been lost, contact Yurba.one support.

// Import Client from yurba.js
const { Client } = require("yurba.js");

// Load config
const config = require('./config.json');

// Load `.env`
require('dotenv').config()

// Create client (bot) with your token and prefix
const client = new Client(process.env.YURBA_TOKEN);

// Register first command - ping
client.registerCommand('ping', {}, (message, args) => {
    message.reply(`pong!, ${message.Author.Name}`);
});

// First event - ready
// When the bot starts, it will log 'Ready!' to the console
client.once('ready', () => {
    console.log('Ready!');
});

// Initialize the bot (start it)
client.init();
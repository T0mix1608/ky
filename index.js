// server.js
const express = require('express');
const crypto = require('crypto');
const { Client, GatewayIntentBits } = require('discord.js');
const app = express();

const DISCORD_TOKEN = 'YOUR_DISCORD_TOKEN';  // Replace with your Discord bot token
const CHANNEL_ID = 'YOUR_CHANNEL_ID';  // Replace with the ID of the channel where you want to announce the keys

app.use(express.json());  // Middleware to parse JSON requests

// Function to generate a random key
function generateKey() {
    return crypto.randomBytes(16).toString('hex');
}

let currentKey = generateKey();  // Generate the first key
console.log(`Initial key generated: ${currentKey}`);

// Function to run every 24 hours
setInterval(() => {
    currentKey = generateKey();
    console.log(`New key generated: ${currentKey}`);
    announceKeyOnDiscord(currentKey);  // Announce the new key on Discord
}, 24 * 60 * 60 * 1000);  // 24 hours

// Endpoint to validate the key
app.post('/validate-key', (req, res) => {
    const { key } = req.body;

    if (key === currentKey) {
        return res.status(200).send('Valid key!');
    } else {
        return res.status(400).send('Invalid key!');
    }
});

// Discord bot configuration
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the bot is ready and online
client.once('ready', () => {
    console.log(`Discord bot is online as ${client.user.tag}`);
});

// Function to announce the key on Discord
function announceKeyOnDiscord(key) {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
        channel.send(`The new generated key is: **${key}**`);
    } else {
        console.log('Discord channel not found');
    }
}

// Log the bot into Discord
client.login(DISCORD_TOKEN);

// Start the server on the defined port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

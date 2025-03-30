const mineflayer = require('mineflayer'); // Import mineflayer (or bedrock bot library)
const express = require('express'); // Import Express for Koyeb health check

// Bot Configuration
const bot = mineflayer.createBot({
    host: "YourServer.aternos.me", // Replace with your Aternos server address
    port: 19132, // Replace with your server port
    username: "AFK_Bot", // Bot username
    version: "1.21.70", // Replace with your Minecraft Bedrock version
});

// Bot Event Listeners
bot.on('login', () => {
    console.log("Bot has logged in successfully!");
});

bot.on('spawn', () => {
    console.log("Bot has spawned!");
});

bot.on('end', () => {
    console.log("Bot disconnected. Reconnecting...");
    setTimeout(() => {
        bot.connect(); // Auto-reconnect
    }, 5000);
});

bot.on('error', err => {
    console.error("Bot encountered an error:", err);
});

// Health Check Server for Koyeb
const app = express();

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Health check server running on port ${PORT}`);
});

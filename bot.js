const bedrock = require('bedrock-protocol');
const express = require('express');
const { exec } = require('child_process');

const SERVER_HOST = 'Test-LEaV.aternos.me'; // Your Aternos server IP
let SERVER_PORT = null; // Will be fetched dynamically
const USERNAME = 'chikabot69'; // Bot name

let bot;

// Function to fetch the Aternos server port dynamically
function getAternosPort(callback) {
    exec(`mcstatus ${SERVER_HOST} bedrock --json`, (error, stdout, stderr) => {
        if (error) {
            console.error(`[ERROR] Failed to get Aternos port: ${stderr}`);
            return callback(null);
        }
        try {
            const data = JSON.parse(stdout);
            if (data.host && data.port) {
                console.log(`[INFO] Found server port: ${data.port}`);
                callback(data.port);
            } else {
                callback(null);
            }
        } catch (e) {
            console.error('[ERROR] Failed to parse Aternos response.');
            callback(null);
        }
    });
}

// Function to start the bot
function startBot() {
    if (!SERVER_PORT) {
        console.log('[ERROR] Server port is not set. Retrying in 10 seconds...');
        setTimeout(() => getAternosPort(startBot), 10000);
        return;
    }

    console.log(`[BOT] Connecting to ${SERVER_HOST}:${SERVER_PORT}...`);
    bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: USERNAME,
        offline: true // Set to true if using a cracked server
    });

    bot.on('join', () => {
        console.log('[BOT] Joined the server!');
    });

    bot.on('end', () => {
        console.log('[BOT] Lost connection. Attempting to reconnect in 10 seconds...');
        setTimeout(startBot, 10000);
    });

    bot.on('kicked', (reason) => {
        console.log(`[BOT] Kicked: ${reason}`);
        console.log('[BOT] Reconnecting in 10 seconds...');
        setTimeout(startBot, 10000);
    });

    bot.on('error', (err) => {
        console.log(`[BOT] Error: ${err}`);
    });

    // Send AFK message every 5 minutes
    setInterval(() => {
        if (bot && bot.connected) {
            bot.write('text', {
                type: 'chat',
                needs_translation: false,
                source_name: USERNAME,
                message: 'I am still here!'
            });
            console.log('[BOT] Sent AFK message.');
        }
    }, 300000); // 5 minutes
}

// Start the bot by fetching the current Aternos port
getAternosPort((port) => {
    if (port) {
        SERVER_PORT = port;
        startBot();
    } else {
        console.log('[ERROR] Could not retrieve Aternos port.');
    }
});

// Express server to keep Koyeb awake
const app = express();
const PORT = 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Health check server running on port ${PORT}`));

const bedrock = require('bedrock-protocol');
const fs = require('fs');
const express = require('express');

const SERVER_HOST = 'Test-LEaV.aternos.me';
const SERVER_PORT = 31944;
const USERNAME_1 = 'chikabot69';
const USERNAME_2 = 'ChikaBadmoosh';
const AUTH_TYPE = 'microsoft';
const TOKEN_FILE = './tokens.json';

let bot1 = null;
let bot2 = null;

// Load saved tokens (if available)
function loadTokens() {
    try {
        if (fs.existsSync(TOKEN_FILE)) {
            const data = fs.readFileSync(TOKEN_FILE);
            return JSON.parse(data);
        }
    } catch (err) {
        console.error("[BOT] Failed to load tokens:", err);
    }
    return {};
}

// Save tokens after login
function saveTokens(tokens) {
    if (!tokens || Object.keys(tokens).length === 0) {
        console.log("[BOT] No tokens received. Skipping save.");
        return;
    }

    try {
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
        console.log("[BOT] Tokens saved successfully.");
    } catch (err) {
        console.error("[BOT] Failed to save tokens:", err);
    }
}

function startBot(username, onSpawn) {
    console.log(`[BOT] Attempting to connect as ${username}...`);

    let bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        auth: AUTH_TYPE,
        profilesFolder: './', // Ensure tokens are saved in the working directory
        cacheTokens: true, // Enables automatic token caching
        tokens: loadTokens() // Load stored tokens
    });

    bot.on('login', () => {
        console.log(`[BOT] ${username} Logged in.`);
    });

    bot.on('spawn', () => {
        console.log(`[BOT] ${username} Spawned into the world.`);
        if (onSpawn) onSpawn(bot);
    });

    bot.on('disconnect', (reason) => {
        console.log(`[BOT] ${username} Disconnected: ${reason}`);
        setTimeout(() => reconnectBot(username), 5000); // Auto-reconnect after 5 seconds
    });

    bot.on('kicked', (reason) => {
        console.log(`[BOT] ${username} Kicked: ${reason}`);
    });

    bot.on('error', (err) => {
        console.log(`[BOT] ${username} Error:`, err);
    });

    bot.on('authenticated', () => {
        console.log(`[BOT] ${username} Authenticated successfully.`);
    });

    bot.on('session', (session) => {
        console.log(`[BOT] Saving authentication tokens for ${username}`);
        saveTokens(session.tokens);
    });

    return bot;
}

// Reconnect bot function
function reconnectBot(username) {
    console.log(`[BOT] Reconnecting ${username} in 5 seconds...`);
    setTimeout(() => {
        if (username === USERNAME_1) {
            bot1 = startBot(USERNAME_1);
        } else {
            bot2 = startBot(USERNAME_2);
        }
    }, 5000);
}

// Health check server
const app = express();
app.get('/', (req, res) => {
    res.send('Bots are running!');
});
app.listen(3000, () => {
    console.log("[Server] Health check running on port 3000");
});

// Start the bot cycle
bot1 = startBot(USERNAME_1);
setTimeout(() => {
    bot2 = startBot(USERNAME_2);
}, 30000); // Start second bot after 30 seconds

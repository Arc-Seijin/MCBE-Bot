const bedrock = require('bedrock-protocol');
const express = require('express');
const http = require('http');

const SERVER_HOST = 'Test-LEaV.aternos.me';
const SERVER_PORT = 31944;
const USERNAME_1 = 'chikabot69';       
const USERNAME_2 = 'ChikaBadmoosh69';    

let currentBot = 1; // 1 means chikabot69, 2 means ChikaBadmoosh69
let bot = null;

function startBot(username) {
    console.log(`[BOT] Attempting to connect as ${username}...`);
    const bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        offline: true 
    });

    bot.on('login', () => console.log(`[BOT] ${username} Logged in.`));
    bot.on('spawn', () => console.log(`[BOT] ${username} Spawned.`));
    bot.on('disconnect', reason => console.log(`[BOT] ${username} Disconnected: ${reason}`));
    bot.on('kicked', reason => console.log(`[BOT] ${username} Kicked: ${reason}`));
    bot.on('error', err => console.log(`[BOT] ${username} Error:`, err));

    return bot;
}

async function botCycle() {
    console.log('[CYCLE] Starting bot cycle...');

    // Choose which bot to start
    const username = currentBot === 1 ? USERNAME_1 : USERNAME_2;
    bot = startBot(username);

    await wait(60 * 1000); // wait 1 minute

    // Disconnect the current bot
    if (bot) {
        bot.disconnect();
        bot = null;
    }

    // Switch to the next bot
    currentBot = currentBot === 1 ? 2 : 1;

    // Repeat cycle
    setTimeout(botCycle, 1000);
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Express server for health check
const app = express();
app.get('/', (req, res) => {
    res.send('Bots are running!');
});
app.listen(3000, () => {
    console.log("[SERVER] Health check running on port 3000");
});

// Keep process alive
function keepAlive() {
    setInterval(() => {
        http.get('http://localhost:3000', res => {
            console.log(`[Self-Ping] Status: ${res.statusCode}`);
        }).on('error', err => {
            console.error('[Self-Ping] Error:', err.message);
        });
    }, 5 * 60 * 1000);
}

keepAlive();
botCycle();

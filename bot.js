const bedrock = require('bedrock-protocol');
const express = require('express');
const http = require('http');

const SERVER_HOST = 'Test-LEaV.aternos.me';
const SERVER_PORT = 31944;
const USERNAME_1 = 'chikabot69';         // Bot A
const USERNAME_2 = 'ChikaBadmoosh69';    // Bot B

let bot1 = null;
let bot2 = null;

function startBot(username) {
    console.log(`[BOT] Attempting to connect as ${username}...`);

    const bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username,
        offline: true
    });

    bot.on('login', () => console.log(`[BOT] ${username} logged in.`));
    bot.on('spawn', () => console.log(`[BOT] ${username} spawned.`));
    bot.on('disconnect', reason => console.log(`[BOT] ${username} disconnected: ${reason}`));
    bot.on('kicked', reason => console.log(`[BOT] ${username} kicked: ${reason}`));
    bot.on('error', err => console.error(`[BOT] ${username} error:`, err));

    return bot;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function botCycle() {
    console.log('[CYCLE] Starting bot cycle...');

    while (true) {
        try {
            if (!bot1) {
                bot1 = startBot(USERNAME_1);
            }

            await wait(60_000); // 1 minute
            bot2 = startBot(USERNAME_2);

            await wait(5_000); // 5 seconds

            if (bot1) {
                bot1.disconnect();
                bot1 = null;
            }

            await wait(60_000); // 1 minute
            bot1 = startBot(USERNAME_1);

            await wait(5_000); // 5 seconds

            if (bot2) {
                bot2.disconnect();
                bot2 = null;
            }

        } catch (err) {
            console.error('[CYCLE] Bot cycle error:', err);
        }
    }
}

// Health check server for Koyeb
const app = express();
app.get('/', (req, res) => {
    res.send('Bots are active and cycling!');
});
app.listen(3000, () => {
    console.log('[SERVER] Health check running on port 3000');
});

// Self-ping to keep the service alive
function keepAlive() {
    setInterval(() => {
        http.get('http://localhost:3000', res => {
            console.log(`[Self-Ping] Status: ${res.statusCode}`);
        }).on('error', err => {
            console.error('[Self-Ping] Error:', err.message);
        });
    }, 5 * 60_000); // every 5 minutes
}

keepAlive();
botCycle();

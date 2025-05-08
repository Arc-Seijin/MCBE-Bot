const bedrock = require('bedrock-protocol');
const express = require('express');
const http = require('http');

const SERVER_HOST = 'Test-LEaV.aternos.me';
const SERVER_PORT = 31944;
const USERNAME_1 = 'chikabot69'; // cb
const USERNAME_2 = 'ChikaBadmoosh69'; // CB

let bot1 = null;
let bot2 = null;

function startBot(username) {
    console.log(`[BOT] Attempting to connect as ${username}...`);
    const bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        offline: true // no Microsoft login
    });

    bot.on('login', () => console.log(`[BOT] ${username} Logged in.`));
    bot.on('spawn', () => console.log(`[BOT] ${username} Spawned.`));
    bot.on('disconnect', reason => console.log(`[BOT] ${username} Disconnected: ${reason}`));
    bot.on('kicked', reason => console.log(`[BOT] ${username} Kicked: ${reason}`));
    bot.on('error', err => console.log(`[BOT] ${username} Error:`, err));

    return bot;
}

// Bot loop logic
async function botCycle() {
    console.log('[CYCLE] Starting bot cycle...');

    while (true) {
        if (!bot1) {
            bot1 = startBot(USERNAME_1);
        }

        await wait(60 * 1000); // wait 1 minute

        bot2 = startBot(USERNAME_2);

        await wait(5000); // wait 5 seconds

        if (bot1) {
            bot1.disconnect();
            bot1 = null;
        }

        await wait(60 * 1000); // wait 1 minute

        bot1 = startBot(USERNAME_1);

        await wait(5000); // wait 5 seconds

        if (bot2) {
            bot2.disconnect();
            bot2 = null;
        }
    }
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

// Self-ping to keep Koyeb alive
function keepAlive() {
    setInterval(() => {
        http.get('http://localhost:3000', res => {
            console.log(`[Self-Ping] Status: ${res.statusCode}`);
        }).on('error', err => {
            console.error('[Self-Ping] Error:', err.message);
        });
    }, 5 * 60 * 1000); // every 5 minutes
}

keepAlive();
botCycle();

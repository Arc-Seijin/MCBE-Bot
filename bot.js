const bedrock = require('bedrock-protocol');
const express = require('express');

const SERVER_HOST = 'Test-LEaV.aternos.me'; // Your Aternos server IP
const SERVER_PORT = 31944; // Fixed port
const USERNAME = 'chikabot69'; // Change to your bot's name

let bot;

function startBot() {
    console.log('[BOT] Connecting...');
    bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: USERNAME,
        offline: true // Set to true if using cracked server
    });

    bot.on('spawn', () => {
    console.log('[BOT] Spawned into the world!');

    setInterval(() => {
        if (!bot.entity) return; // Prevent errors if entity isn't ready
        const newPosition = {
            x: bot.entity.position.x,
            y: bot.entity.position.y,
            z: bot.entity.position.z + 1 // Slight movement forward
        };

        bot.queue('move_player', {
            runtime_id: bot.entity.runtimeId,
            position: newPosition,
            pitch: bot.entity.pitch,
            yaw: bot.entity.yaw,
            head_yaw: bot.entity.headYaw,
            mode: 0,
            on_ground: true,
            ridden_runtime_id: 0,
            tick: 0n
        });

        console.log('[BOT] Moved slightly to avoid AFK kick.');
    }, 60000); // Moves every 1 min
});

    bot.on('join', () => {
        console.log('[BOT] Joined the server!');
    });

    bot.on('disconnect', (reason) => {
        console.log(`[BOT] Disconnected: ${reason}`);
        console.log('[BOT] Reconnecting in 10 seconds...');
        setTimeout(startBot, 10000); // Auto-reconnect after 10s
    });

    bot.on('kicked', (reason) => {
        console.log(`[BOT] Kicked: ${reason}`);
        console.log('[BOT] Reconnecting in 10 seconds...');
        setTimeout(startBot, 10000);
    });

    bot.on('error', (err) => {
        console.log(`[BOT] Error: ${err}`);
    });

    // Send message every 5 minutes to stay AFK
    setInterval(() => {
        if (bot && bot.queue) {
            bot.queue('text', { message: 'I am still here!' });
            console.log('[BOT] Sent AFK message.');
        }
    }, 120000); // 5 minutes
}

// Start bot initially
startBot();

// Express server to keep Koyeb awake
const app = express();
const PORT = 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Health check server running on port ${PORT}`));


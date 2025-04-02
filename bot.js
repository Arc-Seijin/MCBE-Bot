const bedrock = require('bedrock-protocol'); const express = require('express');

const SERVER_HOST = 'Test-LEaV.aternos.me'; // Your Aternos server IP const SERVER_PORT = 31944; // Fixed port const USERNAME_1 = 'chikabot69'; // First bot's name const USERNAME_2 = 'ChikaBadmoosh'; // Second bot's name

let bot1 = null, bot2 = null;

function startBot(username) { console.log([BOT] Attempting to connect as ${username}...);

let bot = bedrock.createClient({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: username,
    offline: true // Set to true if using cracked server
});

if (username === USERNAME_1) bot1 = bot;
else bot2 = bot;

bot.on('login', () => {
    console.log(`[BOT] ${username} Logging in...`);
});

bot.on('spawn', () => {
    console.log(`[BOT] ${username} Spawned into the world!`);

    setInterval(() => {
        if (!bot.entity) {
            console.log(`[BOT] ${username} Entity not available for movement.`);
            return;
        }
        const randomOffset = (Math.random() - 0.5) * 2;
        const newPosition = {
            x: bot.entity.position.x + randomOffset,
            y: bot.entity.position.y,
            z: bot.entity.position.z + randomOffset
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
        console.log(`[BOT] ${username} moved by ${randomOffset.toFixed(2)} blocks.`);
    }, 60000); // Move every 1 minute

    setInterval(() => {
        if (!bot.entity) {
            console.log(`[BOT] ${username} Entity not available for punching.`);
            return;
        }
        bot.queue('animate', {
            action: 0, // Swing arm (air punch)
            runtime_entity_id: bot.entity.runtimeId
        });
        console.log(`[BOT] ${username} punched the air.`);
    }, 45000); // Punch air every 45 seconds
});

bot.on('join', () => {
    console.log(`[BOT] ${username} Joined the server!`);
});

bot.on('disconnect', (reason) => {
    console.log(`[BOT] ${username} Disconnected: ${reason}`);
    setTimeout(() => startBot(username), 5000);
});

bot.on('kicked', (reason) => {
    console.log(`[BOT] ${username} Kicked: ${reason}`);
    setTimeout(() => startBot(username), 5000);
});

bot.on('error', (err) => {
    console.log(`[BOT] ${username} Error:`, err);
});

setInterval(() => {
    if (bot && bot.queue) {
        bot.write('text', {
            type: 1,
            needs_translation: false,
            source_name: username,
            message: `${username} is still here!`
        });
        console.log(`[BOT] ${username} Sent AFK message.`);
    }
}, 120000); // Every 2 minutes

}

startBot(USERNAME_1); setTimeout(() => startBot(USERNAME_2), 5000);

const app = express(); app.get('/', (req, res) => res.send('Bots are running!')); app.listen(3000, () => console.log(Health check server running));


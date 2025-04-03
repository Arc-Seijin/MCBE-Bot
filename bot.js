const bedrock = require('bedrock-protocol'); const express = require('express');

const SERVER_HOST = 'Test-LEaV.aternos.me'; // Aternos server IP const SERVER_PORT = 31944; // Fixed port const USERNAME_1 = 'chikabot69'; const USERNAME_2 = 'ChikaBadmoosh';

let activeBot = null; let nextBot = USERNAME_2;

function startBot(username) { console.log([BOT] Attempting to connect as ${username}...); let bot = bedrock.createClient({ host: SERVER_HOST, port: SERVER_PORT, username: username, offline: true // Set to true for cracked server });

bot.on('login', () => {
    console.log(`[BOT] ${username} Logging in...`);
});

bot.on('spawn', () => {
    console.log(`[BOT] ${username} Spawned into the world!`);
    activeBot = bot;
    
    setTimeout(() => {
        nextBot = username === USERNAME_1 ? USERNAME_2 : USERNAME_1;
        console.log(`[BOT] Switching to ${nextBot} in 1 minute...`);
        bot.end();
        setTimeout(() => startBot(nextBot), 60000); // Wait 1 min before switching
    }, 60000);
    
    setInterval(() => {
        if (!bot.entity) return;
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
        console.log(`[BOT] ${username} moved slightly.`);
    }, 30000);
    
    setInterval(() => {
        if (!bot.entity) return;
        bot.queue('animate', {
            action: 0, // Swing arm (punch air)
            runtime_id: bot.entity.runtimeId
        });
        console.log(`[BOT] ${username} punched air.`);
    }, 45000);
    
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
    }, 120000);
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

}

// Start first bot startBot(USERNAME_1);

// Express health check const app = express(); app.get('/', (req, res) => res.send('Bots are running!')); app.listen(3000, () => console.log(Health check server running));

            

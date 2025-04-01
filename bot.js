const bedrock = require('bedrock-protocol');
const express = require('express');

const SERVER_HOST = 'Test-LEaV.aternos.me'; // Your Aternos server IP
const SERVER_PORT = 31944; // Fixed port
const USERNAME_1 = 'chikabot69'; // First bot's name
const USERNAME_2 = 'ChikaBadmoosh'; // Second bot's name

let bot1 = null, bot2 = null;

function startBot(username) {
    console.log(`[BOT] Attempting to connect as ${username}...`);
    
    let bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        offline: true // Set to true if using cracked server
    });

    // Set bot1 or bot2 based on the username
    if (username === USERNAME_1) {
        bot1 = bot; // Set bot1
    } else {
        bot2 = bot; // Set bot2
    }

    bot.on('login', () => {
        console.log(`[BOT] ${username} Logging in...`);
    });

    bot.on('spawn', () => {
        console.log(`[BOT] ${username} Spawned into the world!`);

        setInterval(() => {
            if (!bot.entity) return;
            const randomOffset = (Math.random() - 0.5) * 2; // Random small movement
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

            console.log(`[BOT] ${username} moved slightly by ${randomOffset.toFixed(2)} blocks.`);
        }, 60000); // Moves every 1 minute
    });

    bot.on('join', () => {
        console.log(`[BOT] ${username} Joined the server!`);
    });

    bot.on('disconnect', (reason) => {
        console.log(`[BOT] ${username} Disconnected: ${reason}`);
        // Restart bot on disconnect
        setTimeout(() => startBot(username), 5000);
    });

    bot.on('kicked', (reason) => {
        console.log(`[BOT] ${username} Kicked: ${reason}`);
        // Restart bot on kick
        setTimeout(() => startBot(username), 5000);
    });

    bot.on('error', (err) => {
        console.log(`[BOT] ${username} Error:`, err);
    });

    // Send message every 5 minutes to stay AFK
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
    }, 120000); // 5 minutes
}

// Start both bots
startBot(USERNAME_1);
setTimeout(() => startBot(USERNAME_2), 5000); // Small delay to prevent conflicts

// Express health check
const app = express();
app.get('/', (req, res) => res.send('Bots are running!'));
app.listen(3000, () => console.log(`Health check server running`));

const bedrock = require('bedrock-protocol');
const express = require('express');

const SERVER_HOST = 'Test-LEaV.aternos.me'; // Your Aternos server IP
const SERVER_PORT = 31944; // Fixed port
const USERNAME_1 = 'chikabot69'; // First bot's name
const USERNAME_2 = 'ChikaBadmoosh'; // Second bot's name

let bot1 = null, bot2 = null;
let activeBot = 1; // Variable to track which bot is active

function startBot(username) {
    console.log(`[BOT] Connecting as ${username}...`);
    
    let bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        offline: true // Set to true if using cracked server
    });

    if (username === USERNAME_1) {
        bot1 = bot; // Set bot1
    } else {
        bot2 = bot; // Set bot2
    }

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
        // Switch to the other bot immediately after disconnect
        setTimeout(() => {
            if (activeBot === 1) {
                startBot(USERNAME_2); // Start bot2 if bot1 disconnects
                activeBot = 2;
            } else {
                startBot(USERNAME_1); // Start bot1 if bot2 disconnects
                activeBot = 1;
            }
        }, 0); // No delay, starts immediately
    });

    bot.on('kicked', (reason) => {
        console.log(`[BOT] ${username} Kicked: ${reason}`);
        // Same behavior on kick as on disconnect
        setTimeout(() => {
            if (activeBot === 1) {
                startBot(USERNAME_2); // Start bot2 if bot1 is kicked
                activeBot = 2;
            } else {
                startBot(USERNAME_1); // Start bot1 if bot2 is kicked
                activeBot = 1;
            }
        }, 0); // No delay
    });

    bot.on('error', (err) => {
        console.log(`[BOT] ${username} Error: ${err}`);
    });

    // Send message every 5 minutes to stay AFK
    setInterval(() => {
        if (bot && bot.queue) {
            bot.queue('text', { message: `${username} is still here!` });
            console.log(`[BOT] ${username} Sent AFK message.`);
        }
    }, 120000); // 5 minutes
}

// Start bot1 initially and ensure bot2 connects when bot1 disconnects
startBot(USERNAME_1);

// Express server to keep Koyeb awake
const app = express();
const PORT = 3000;

app.get('/', (req, res) => res.send('Bots are running!'));
app.listen(PORT, () => console.log(`Health check server running on port ${PORT}`));

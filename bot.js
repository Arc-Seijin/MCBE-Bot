const bedrock = require('bedrock-protocol');
const express = require('express');

const SERVER_HOST = 'Test-LEaV.aternos.me';
const SERVER_PORT = 31944;
const USERNAME_1 = 'chikabot69';
const USERNAME_2 = 'ChikaBadmoosh69';

let bot1 = null;
let bot2 = null;

function startBot(username, onSpawn, onDisconnect) {
    console.log(`[BOT] Attempting to connect as ${username}...`);

    let bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        offline: true // No authentication, cracked mode
    });

    bot.on('login', () => console.log(`[BOT] ${username} Logged in.`));
    
    bot.on('spawn', () => {
        console.log(`[BOT] ${username} Spawned into the world.`);
        if (onSpawn) onSpawn(bot);
    });

    bot.on('disconnect', (reason) => {
        console.log(`[BOT] ${username} Disconnected: ${reason}`);
        if (onDisconnect) onDisconnect();
    });

    bot.on('kicked', (reason) => console.log(`[BOT] ${username} Kicked: ${reason}`));
    bot.on('error', (err) => console.log(`[BOT] ${username} Error:`, err));

    return bot;
}

// Function to manage the bot switching loop
function startBotLoop() {
    bot1 = startBot(USERNAME_1, () => {
        setTimeout(() => {
            console.log(`[BOT] ${USERNAME_1} Leaving in 5 seconds...`);
            setTimeout(() => {
                bot1.disconnect();
                console.log(`[BOT] ${USERNAME_1} Left. Now starting ${USERNAME_2}...`);
                bot2 = startBot(USERNAME_2, () => {
                    setTimeout(() => {
                        console.log(`[BOT] ${USERNAME_2} Leaving in 5 seconds...`);
                        setTimeout(() => {
                            bot2.disconnect();
                            console.log(`[BOT] ${USERNAME_2} Left. Restarting cycle...`);
                            startBotLoop(); // Restart the cycle
                        }, 5000);
                    }, 60000); // Bot 2 stays for 1 minute
                });
            }, 5000);
        }, 60000); // Bot 1 stays for 1 minute
    });
}

// Health check server
const app = express();
app.get('/', (req, res) => res.send('Bots are running!'));
app.listen(3000, () => console.log("[Server] Health check running on port 3000"));

// Start the loop
startBotLoop();

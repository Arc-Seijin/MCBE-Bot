const bedrock = require('bedrock-protocol');
const express = require('express'); // Import Express for health check

// Server details
const SERVER_HOST = 'Test-LEaV.aternos.me';
const SERVER_PORT = 31944;
const USERNAME_1 = 'chikabot69';
const USERNAME_2 = 'ChikaBadmoosh';
const AUTH_TYPE = 'microsoft'; // Enables Microsoft login

let bot1 = null;
let bot2 = null;

// Start bot function
function startBot(username, onSpawn) {
    console.log(`[BOT] Attempting to connect as ${username}...`);
    
    let bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        auth: AUTH_TYPE, // Use Microsoft authentication
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
    });

    bot.on('kicked', (reason) => {
        console.log(`[BOT] ${username} Kicked: ${reason}`);
    });

    bot.on('error', (err) => {
        console.log(`[BOT] ${username} Error:`, err);
    });

    return bot;
}

// Bot cycling to avoid AFK kicks
function cycleBots() {
    bot1 = startBot(USERNAME_1, () => {
        setTimeout(() => {
            bot2 = startBot(USERNAME_2, () => {
                setTimeout(() => {
                    console.log("[BOT] Disconnecting bot 1...");
                    bot1.close();
                    bot1 = null;
                    
                    setTimeout(() => {
                        bot1 = startBot(USERNAME_1, () => {
                            setTimeout(() => {
                                console.log("[BOT] Disconnecting bot 2...");
                                bot2.close();
                                bot2 = null;
                                
                                // Restart the cycle
                                setTimeout(cycleBots, 1000);
                            }, 5000);
                        });
                    }, 60000);
                }, 5000);
            });
        }, 60000);
    });
}

// Start the bot cycle
cycleBots();

// ==================== HEALTH CHECK SERVER ====================
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Bots are running!');
});

// Start Express server
app.listen(PORT, () => {
    console.log(`[Server] Health check running on port ${PORT}`);
});

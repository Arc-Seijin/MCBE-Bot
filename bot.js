const bedrock = require('bedrock-protocol');

const SERVER_HOST = 'Test-LEaV.aternos.me';
const SERVER_PORT = 31944;
const USERNAME_1 = 'chikabot69';
const USERNAME_2 = 'ChikaBadmoosh';

let bot1 = null;
let bot2 = null;

function startBot(username, callback) {
    console.log(`[BOT] Attempting to connect as ${username}...`);
    
    let bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        offline: true
    });

    bot.on('login', () => {
        console.log(`[BOT] ${username} Logging in...`);
    });

    bot.on('spawn', () => {
        console.log(`[BOT] ${username} Spawned into the world!`);
        if (callback) callback(bot);
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

function cycleBots() {
    bot1 = startBot(USERNAME_1, () => {
        setTimeout(() => {
            bot2 = startBot(USERNAME_2, () => {
                setTimeout(() => {
                    console.log("[BOT] Disconnecting bot 1...");
                    bot1.close();
                    
                    setTimeout(() => {
                        bot1 = startBot(USERNAME_1, () => {
                            setTimeout(() => {
                                console.log("[BOT] Disconnecting bot 2...");
                                bot2.close();
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

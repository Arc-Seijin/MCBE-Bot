const bedrock = require('bedrock-protocol');

const SERVER_HOST = 'Test-LEaV.aternos.me';
const SERVER_PORT = 31944;
const USERNAME_1 = 'chikabot69';
const USERNAME_2 = 'ChikaBadmoosh';
const AUTH_TYPE = 'microsoft';

let bot1 = null;
let bot2 = null;

function startBot(username, duration, onReady) {
    console.log(`[BOT] Connecting as ${username}...`);

    let bot = bedrock.createClient({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        auth: AUTH_TYPE,
    });

    bot.on('login', () => console.log(`[BOT] ${username} logged in.`));

    bot.on('spawn', () => {
        console.log(`[BOT] ${username} spawned.`);
        if (onReady) onReady(bot);

        // Disconnect after the specified duration
        setTimeout(() => {
            console.log(`[BOT] Disconnecting ${username}...`);
            bot.close();
        }, duration);
    });

    bot.on('disconnect', (reason) => console.log(`[BOT] ${username} Disconnected: ${reason}`));
    bot.on('kicked', (reason) => console.log(`[BOT] ${username} Kicked: ${reason}`));
    bot.on('error', (err) => console.log(`[BOT] ${username} Error:`, err));

    return bot;
}

function cycleBots() {
    bot1 = startBot(USERNAME_1, 60000, () => {
        setTimeout(() => {
            bot2 = startBot(USERNAME_2, 60000, () => {
                setTimeout(cycleBots, 5000);
            });
        }, 5000);
    });
}

// Start the bot cycle
cycleBots();

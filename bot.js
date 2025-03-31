const { createClient } = require('bedrock-protocol');

let bot;

function startBot() {
    bot = createClient({
        host: "Test-LEaV.aternos.me", // Your server address
        port: 31944, // Your server port
        username: "AFKBot", // Change this to your bot's username
        offline: false // Set to true if the server is cracked
    });

    bot.on('login', () => {
        console.log('[BOT] Logged in successfully!');
    });

    bot.on('end', () => {
        console.log('[BOT] Disconnected! Reconnecting in 5 seconds...');
        setTimeout(startBot, 5000); // Reconnect after 5 seconds
    });

    bot.on('error', (err) => {
        console.error('[BOT] Error:', err);
    });

    // Prevent AFK Kick by sending a command every 5 minutes
    setInterval(() => {
        bot.write('command_request', { command: 'say I am still here!', origin: { type: 0 } });
    }, 300000); // 5 minutes (300000 ms)
}

startBot();


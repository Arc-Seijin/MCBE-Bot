const { Client } = require('bedrock-protocol');

const options = {
    host: 'Test-LEaV.aternos.me',  // Change to your Aternos server address
    port: 31944,  // Default Bedrock port
    username: 'chikabot69'  // Change bot name if needed
};

// Function to connect the bot
function startBot() {
    console.log('Connecting to server...');
    const bot = new Client(options);

    bot.on('disconnect', (reason) => {
        console.log(`Bot disconnected: ${reason}`);
        console.log('Reconnecting...');
        setTimeout(startBot, 5000);  // Reconnect after 5 seconds
    });

    bot.on('join', () => {
        console.log('Bot has joined the server.');
    });

    bot.on('error', (err) => {
        console.log(`Bot error: ${err}`);
    });
}

startBot(); // Start the bot initially

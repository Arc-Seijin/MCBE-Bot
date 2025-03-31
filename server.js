const express = require('express');

const app = express();
const PORT = 3000;

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Bot is running and online!');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Health check server running on port ${PORT}`);
});

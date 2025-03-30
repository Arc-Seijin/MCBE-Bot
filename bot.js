
const { createClient } = require("bedrock-protocol");
const express = require("express");

// Minecraft Bot Configuration
const bot = createClient({
  host: "Test-LEaV.aternos.me", // Replace with your actual server IP/hostname
  port: 31944, // Default Bedrock port
  username: "chikabot69",
  offline: false, // Set to true if using a cracked server
});

// Event: When bot connects
bot.on("join", () => {
  console.log("Bot joined the server!");
});

// Event: When bot disconnects
bot.on("end", () => {
  console.log("Bot disconnected! Reconnecting in 5 seconds...");
  setTimeout(() => {
    bot.connect();
  }, 5000);
});

// Event: Log messages
bot.on("text", (packet) => {
  if (packet.source_name) {
    console.log(`[${packet.source_name}]: ${packet.message}`);
  }
});

// Express Server for Koyeb Health Check
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Health check server running on port ${PORT}`));

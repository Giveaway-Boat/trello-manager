require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

(async () => {
    client.slashCommands = new Collection();
    ['slashCommand', 'events', 'errorHandler'].forEach((handler) => {
        require(`./handlers/${handler}`)(client);
    });
    client.login(process.env.TOKEN);
})();

module.exports = client;

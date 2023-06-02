require('dotenv').config();
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    run: async (client) => {
        client.user.setActivity(`Giveaway Boat Trello`, { type: ActivityType.Watching });
        console.log(client.user.tag + ' is up and running in ' + client.guilds.cache.size + ' server with ' + client.users.cache.size + ' users cached');
    },
};

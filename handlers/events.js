const { readdirSync } = require('fs');

module.exports = (client) => {
    let count = 0;
    readdirSync('./events/').forEach((file) => {
        const event = require(`../events/${file}`);
        client.on(event.name, (...args) => event.run(client, ...args));
        count++;
    });
    console.log(`Client Events Loaded ${count}`, 'event');
};

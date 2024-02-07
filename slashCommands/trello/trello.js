const { ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();
const Trello = require('trello');
const config = require('../../config.js');
const superagent = require('superagent');

module.exports = {
    name: 'trello',
    description: 'Add something to trello',
    options: [
        {
            name: 'list',
            description: 'List to add this to',
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        },
        {
            name: 'name',
            description: 'Name of card',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'description',
            description: 'Description of card',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    run: async (client, interaction) => {
        if (!config.owners.includes(interaction.user.id)) return;
        const lists = await superagent
            .get(`https://api.trello.com/1/boards/RnkO6fHj/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`)
            .then((res) => res.body)
            .catch((err) => console.error('Error in get lists', err));

        let listObj = lists.find((data) => data.name.toLowerCase().replaceAll(' ', '_') === interaction.options.getString('list'));

        const trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_TOKEN);

        trello.addCard(interaction.options.getString('name'), interaction.options.getString('description') ?? null, listObj.id, function (error, trelloCard) {
            if (error) {
                console.log(`Could not add card: ${trelloCard}`, error);
            } else {
                interaction.reply({ content: `Added card with the name of \`${interaction.options.getString('name')}\` to list \`${listObj.name}\` in Giveaway Boat Trello` });
            }
        });
    },
};

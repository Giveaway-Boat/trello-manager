const { ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();
const Trello = require('trello');

module.exports = {
    name: 'trello',
    description: 'Add something to trello',
    options: [
        {
            name: 'list',
            description: 'List to add this to',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'Next Update',
                    value: 'next',
                },
                {
                    name: 'QOL Code Changes',
                    value: 'qol',
                },
                {
                    name: 'Daily Tasks',
                    value: 'daily',
                },
                {
                    name: 'Bugs',
                    value: 'bugs',
                },
                {
                    name: 'Planned',
                    value: 'planned',
                },
                {
                    name: 'Website Update',
                    value: 'website',
                },
                {
                    name: 'Suggestions',
                    value: 'suggestions',
                },
            ],
        },
        {
            name: 'name',
            description: 'Name of card',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    run: async (client, interaction) => {
        let listId;
        const list = interaction.options.getString('list');
        let listName;
        if (list === 'next') {
            listId = '63fcc471e79ff45703ffc951';
            listName = 'Next Update';
        } else if (list === 'qol') {
            listId = '641627ac737295cee4ce8396';
            listName = 'QOL Code Changes';
        } else if (list === 'daily') {
            listId = '63b91ea8a35e16006769cd74';
            listName = 'Daily Tasks';
        } else if (list === 'bugs') {
            listId = '63b91ea8a35e16006769cd76';
            listName = 'Bugs';
        } else if (list === 'planned') {
            listId = '63b91ea8a35e16006769cd75';
            listName = 'Planned';
        } else if (list === 'website') {
            listId = '6404b222ac9ae8d30b0e20cc';
            listName = 'Website Updates';
        } else if (list === 'suggestions') {
            listId = '63b91ec5b23676006e5e8278';
            listName = 'Suggestions';
        } else {
            return interaction.reply({ content: `An unknown error occured`, ephemeral: true });
        }

        const trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_TOKEN);

        trello.addCard(interaction.options.getString('name'), null, listId, function (error, trelloCard) {
            if (error) {
                console.log('Could not add card:', error);
            } else {
                interaction.reply({ content: `Added card with the name of \`${interaction.options.getString('name')}\` to list \`${listName}\`` });
            }
        });
    },
};

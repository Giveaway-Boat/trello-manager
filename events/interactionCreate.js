const { InteractionType, PermissionsBitField, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const superagent = require('superagent');

module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (interaction.isAutocomplete()) {
            if (interaction.commandName === 'trello') {
                const focusedValue = interaction.options.getFocused();
                const lists = await superagent
                    .get(`https://api.trello.com/1/boards/RnkO6fHj/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`)
                    .then((res) => res.body)
                    .catch((err) => console.error('Error in get lists', err));

                let choices;
                const obj = {};

                for (const data of lists) {
                    obj[data.name] = data.name.toLowerCase().replaceAll(' ', '_');
                }

                choices = Object.keys(obj).map((key) => ({ Value: obj[key], Name: key }));

                const filtered = choices.filter((choices) => choices.Name.toLowerCase().includes(focusedValue.toLowerCase()));
                await interaction.respond(filtered.map((choices) => ({ name: choices.Name, value: choices.Value.toLowerCase() })).slice(0, 25));
            }
        }
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) return;

            const embed = new EmbedBuilder().setColor('#028A0F');

            if (command.botPerms) {
                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                    embed.setDescription(`I don't have **\`${command.botPerms}\`** permission in ${interaction.channel.toString()} to execute this **\`${command.name}\`** command.`);
                    return interaction.reply({ embeds: [embed] });
                }
            }

            if (command.userPerms) {
                if (!interaction.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                    embed.setDescription(`You don't have **\`${command.userPerms}\`** permission in ${interaction.channel.toString()} to execute this **\`${command.name}\`** command.`);
                    return interaction.reply({ embeds: [embed] });
                }
            }
            try {
                await command.run(client, interaction);
            } catch (error) {
                if (interaction.replied) {
                    await interaction
                        .editReply({
                            content: `An unexcepted error occured.`,
                        })
                        .catch(() => {});
                } else {
                    await interaction
                        .reply({
                            ephemeral: true,
                            content: `An unexcepted error occured.`,
                        })
                        .catch(() => {});
                }
                console.error(error);
            }
        }
    },
};

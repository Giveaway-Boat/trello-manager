const { readdirSync } = require('fs');
const { PermissionsBitField, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

module.exports = (client) => {
    const data = [];
    let count = 0;
    readdirSync('./slashCommands/').forEach((dir) => {
        const slashCommandFile = readdirSync(`./slashCommands/${dir}/`).filter((files) => files.endsWith('.js'));

        for (const file of slashCommandFile) {
            const slashCommand = require(`../slashCommands/${dir}/${file}`);

            if (!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split('.')[0]} application command name is required.`);

            if (!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split('.')[0]} application command description is required.`);

            client.slashCommands.set(slashCommand.name, slashCommand);

            data.push({
                name: slashCommand.name,
                description: slashCommand.description,
                type: slashCommand.type,
                options: slashCommand.options ? slashCommand.options : null,
                default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null,
            });
            count++;
        }
    });
    console.log(`Client SlashCommands Command (/) Loaded: ${count}`, 'cmd');
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.', 'cmd');
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: data,
            });
            console.log('Successfully reloaded application (/) commands.', 'cmd');
        } catch (error) {
            console.error(error);
        }
    })();
};

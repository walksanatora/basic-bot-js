const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config()
const fs = require('fs');
const cfg = require('./config.json')

var commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = cfg.client

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	command.guildIds.forEach(element => {
		if (command.canDeploy) {
		commands.push(command.data.toJSON())
	}});
}
console.log(commands)

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('Started refreshing global application (/) commands.');
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		console.log('Successfully reloaded global application (/) commands\n wait 1hr for them to become visible');
	} catch (error) {
		console.error(error);
	}
})();

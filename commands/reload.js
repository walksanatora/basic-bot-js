const { SlashCommandBuilder } = require('@discordjs/builders');
const { execSync } = require("child_process");
const discord = require('discord.js')
const os = require('os');
const { exit } = require('process');
const { authorized,blank } = require('../libs/util.js')

const data = new SlashCommandBuilder()
	.setName('reload')
	.setDescription('reloads the bots state')
	.addSubcommand((sub) =>
		sub.setName('bot')
		.setDescription('reloads the bot')
		.addStringOption((opt) =>
			opt.setName('method')
			.setDescription('the method used to reset the bot')
			.addChoices([
				['service','service'],
				['exit','exit']
			])
			.setRequired(true)
		)
	)
	.addSubcommand((sub) =>
		sub.setName('commands')
		.setDescription('reloads /commands')
		.addStringOption((opt) =>
			opt.setName('scope')
			.setDescription('the scope of the bot commands to load')
			.addChoices([
				['guild','guild'],
				['global','global']
			])
		)
	)

async function func(interaction,client) {
	switch (interaction.options.getSubcommand(true)) {
		case 'bot':
			if (! authorized(interaction)) {await interaction.reply({content:'not authorized to reload bot',ephemeral:true});break}
			const method = interaction.options.getString('method')
			if (method == 'exit'){
				await interaction.reply({content:'exiting, git pulling, npm installing and restarting', ephemeral: true})
				client.user.setPresence({ activities: [{ name: 'restarting' }], status: 'dnd' });
				exit()
			} else {
				if (process.env.SERVICE == undefined){
					await interaction.reply({content:'unable to restart service, service name not set in .env',ephemeral:true})
					break;
				}
				await interaction.reply({content:'reloading bot via service',ephemeral:true})
				await client.user.setPresence({ activities: [{ name: 'restarting' }], status: 'dnd' });
				execSync(`sudo systemctl restart ${process.env.SERVICE}`)
			}
		break;
		case 'commands':
			if (! authorized(interaction)) {await interaction.reply({content:'not authorized to reload commands',ephemeral:true});break}
			const scope = interaction.options.getString('scope')
			if (scope == undefined) {
				require('../guildCommands.js')
				require('../globalCommands.js')
				await interaction.reply({content:'reloaded all commands (wait 1 hr for global to take effect)',ephemeral:true})
			} else if (scope == 'guild') {
				require('../guildCommands.js')
				await interaction.reply({content:'reloaded guild commands',ephemeral:true})
			} else {
				require('../globalCommands.js')
				await interaction.reply({content:'reloded global commands (wait 1 hr for it to take effect)',ephemeral:true})
			}
			
		break;
	}
}

module.exports={
	'data':data, 
	'help':{
		short: "reload command", 
		long: "reloads the bots features in various ways", 
		subCommands: {
			bot: 'reloads the bot',
			commands: 'reloads bot commands'
		}
	}, 
	'canDeploy':true,
	'guildIds':[], 
	'function': func
}
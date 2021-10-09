/*
This is a example command to be used as a basis for commands
*/

const { SlashCommandBuilder } = require('@discordjs/builders');

//creating a slash command via the special builder provided by @discordjs/builders
const data = new SlashCommandBuilder()
	.setName('example')
	.setDescription('logs something to the console')

// first arg is the interaction object, second arg is the discord client
// function *must* be async because function is awaited
async function func(interaction,client){ 
	console.log('this was ran')
	await interaction.reply({content:'command was ran :)'})
}

module.exports={
	'data':data, //slash command
	'help':{
		short: "A example command", //the string shown when showing all commands
		long: "A very simple example command which logs stuff to console and replys to the message", //the string shown when showing this command
		subCommands: false // false/undefined to show no subcommands, dictioary to add help text for subcommands
	}, //sting to be used when the help command is called
	'canDeploy':false, //can this command be deployed globally to all guilds
	'guildIds':[], //guildIDs to deploy to (for specific commands) (strings)
	'function': func //async function to be executed when the command is run
}
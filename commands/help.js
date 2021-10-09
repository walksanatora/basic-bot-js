const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js')

const data = new SlashCommandBuilder() 
	.setName('help')
	.setDescription('Help embed')
	.addStringOption((opt)=>
		opt.setName('command')
		.setDescription('the command to see further help on')
	)
	.addStringOption((opt)=>
		opt.setName('subcommand')
		.setDescription('the subcommand to see further help on')
	)

async function func(interaction,client){
	if (interaction.option.getString('command') == undefined) { 
		const exampleEmbed = new discord.MessageEmbed()
			.setColor([0,255,128])
			.setTitle('A full list of commands')
		const serverCommands = []
		Object.keys(commands).forEach(element => {
			command = commands[element]
			if (interaction.guildId in command.guildIds || command.canDeploy){
				serverCommands.push(command)
			}
		});
		serverCommands.forEach(element =>{
			exampleEmbed.addField('/'+element.data.name,element.help.short,true)
		})
		await interaction.reply({ embeds:[exampleEmbed],ephemeral: true})
	} else {
		try {
			const cmd = commands[interaction.option.getString('command')]
		} catch (err) {
			await interaction.reply({content:'invalid command',ephemeral:true})
			return
		}
		if (interaction.option.getString('subcommand') == undefined){
			const exampleEmbed = new discord.MessageEmbed()
				.setColor([0,255,128])
				.setTitle(cmd.data.name)
				.addField('help string',cmd.help.long)
			await interaction.reply({embeds: [exampleEmbed],ephemeral: true})
		} else if (cmd.help.subCommands[interaction.option.getString('subcommand')] != undefined) {
			const exampleEmbed = new discord.MessageEmbed()
				.setColor([0,255,128])
				.setTitle(`${cmd.data.name}:${interaction.option.getString('subcommand')}`)
				.addField('help string',cmd.help.subCommands[interaction.option.getString('subcommand')])
			await interaction.reply({embeds: [exampleEmbed],ephemeral: true})
		} else {
			await interaction.reply({content:'subcommand not found',ephemeral: true})
		}
	}
}

module.exports={
	'data':data, 
	'help':{
		short: "help command", 
		long: "a help command to help you use other commands", 
		subCommands: undefined
	}, 
	'canDeploy':true,
	'guildIds':[], 
	'function': func
}
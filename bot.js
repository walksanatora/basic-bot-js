const discord = require('discord.js')
const fs = require('fs');
const glob = require('glob')

const cfg = require('./config.json')

const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILD_MESSAGES,discord.Intents.FLAGS.GUILDS,discord.Intents.FLAGS.GUILD_VOICE_STATES]});

/*
variables in config.json
token: your discord token
client: the client ID of said bot
presence: a list of presences to cycle through
*/

const wittyPresences = cfg.presence

client.once('ready', async () => {
	console.log(`Bot is logged in and ready! with tag ${client.user.tag}`);
	client.user.setPresence({ activities: [{ name: wittyPresences[Math.floor(Math.random()*wittyPresences.length)] }], status: 'online' })
	setInterval(
		function(){
			client.user.setPresence({ activities: [{ name: wittyPresences[Math.floor(Math.random()*wittyPresences.length)] }], status: 'online' })
		},
		10000
	)

});

global.commands = {}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands[command.data.name] = command
}

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()){
		console.log(`Invoking /command ${interaction.commandName} from user ${interaction.user.username}`)
		try {
			await commands[interaction.commandName].function(interaction,client)	
		} catch (error) {
			console.log('ERROR OCCURRED OHNO!!!')
			const exampleEmbed = new discord.MessageEmbed()
				.setColor('#ff0000')
				.setTitle('Error occured')
				.addField('Excpetion',error.toString())
			console.log(error.stack)
			await interaction.reply({embeds: [exampleEmbed]})
		}
	}else if (interaction.isAutocomplete()){
		var option = interaction.options.getFocused(true).name
		var command = interaction.commandName
		var current = interaction.options.get(option).value
		if (command == 'audio') {
			var files = glob.GlobSync(`**/audio/${current}*`).found
			var resp = []
			for (let index = 0; index < files.length; index++) {
				resp[files[index]] = files[index];
			}
			interaction.respond(resp)
		}
	}
});

client.login(cfg.token);
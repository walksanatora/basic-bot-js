const discord = require('discord.js')
const fs = require('fs');

const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILD_MESSAGES,discord.Intents.FLAGS.GUILDS]});

/*
variables in config.json
token: your discord token
client: the client ID of said bot
presence: a list of presences to cycle through
*/

const wittyPresences = require('./config.json').presence

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

client.on('messageCreate', async message => {
	const db = require('./storage.json')
	var con = message.content.trim()
	if (con.startsWith('p!')) {
		con = con.substr(2)
		const cmd = con.split(' ')
		console.log(cmd)
		switch (cmd[0]) {
			case 'user':
				message.reply({content: JSON.stringify(db.user[cmd[1]])})
			break;
			case 'server':
				message.reply({content: JSON.stringify(db.server[message.guild.id])})
			break;
			default:
				break;
		}
	}
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
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
});

client.login(require('./config.json').token);
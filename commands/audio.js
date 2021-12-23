const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs')

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});

const data = new SlashCommandBuilder()
	.setName('audio')
	.setDescription('kills your sanity')
	.addStringOption((opt)=>
		opt.setName('file')
		.setDescription('the audio file to play')
		.setAutocomplete(true)
	)

async function func(interaction,client){
	if (interaction.member.voice.channelId == null){await interaction.reply({content:'join a vc',ephemeral: true}); return} 
	var connection = joinVoiceChannel({
		channelId: interaction.member.voice.channel.id,
		guildId: interaction.channel.guild.id,
		adapterCreator: interaction.channel.guild.voiceAdapterCreator,
	});
	player.stop(true)
	var afile = interaction.options.getString('file')
	if(afile == null) {afile = audio[Math.floor(Math.random()*audio.length)]}
	var audioResource = createAudioResource(`./${afile}`)
	player.play(audioResource)
	connection.subscribe(player)
	await interaction.reply({content:afile,ephemeral: true})
	player.on(AudioPlayerStatus.Idle, () => {
		try {
			connection.destroy()
			connection = undefined
		}
		catch(err){}
	});
	
}

module.exports={
	'data':data, //slash command
	'help':{
		short: 'steals sanity',
		long: 'plays audio in the vc you are in, stealing other sanity',
		subCommands: false
	}, //sting to be used when the help command is called
	'canDeploy':false, //can this command be deployed globally to all guilds
	'guildIds':['783738781097263140'], //guildIDs to deploy to (for specific commands) (strings)
	'function': func //async function to be executed when the command is run
}
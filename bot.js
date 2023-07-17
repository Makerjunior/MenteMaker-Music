const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();
const token ='YOUR_BOT_TOKEN'; // Substitua pelo token do seu bot
let dispatcher;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
    console.log(message.content);

    if (message.content.startsWith('!play')) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('Você precisa estar em um canal de voz primeiro!');
        }

        const songURL = message.content.split(' ')[1];
        if (!songURL) {
            return message.reply('Por favor, forneça uma URL válida do YouTube!');
        }

        try {
            const connection = await voiceChannel.join();
            const stream = ytdl(songURL, { filter: 'audioonly' });
            dispatcher = connection.play(stream);

            dispatcher.on('finish', () => {
                voiceChannel.leave();
            });
        } catch (error) {
            console.error('Erro ao reproduzir música:', error);
            message.reply('Ocorreu um erro ao reproduzir a música!');
        }
    }

    if (message.content.startsWith('!pause')) {
        if (dispatcher && !dispatcher.paused) {
            dispatcher.pause();
            message.reply('A música foi pausada!');
        } else {
            message.reply('Não há nenhuma música sendo reproduzida no momento.');
        }
    }

    if (message.content.startsWith('!resume')) {
        if (dispatcher && dispatcher.paused) {
            dispatcher.resume();
            message.reply('A música foi retomada!');
        } else {
            message.reply('Não há nenhuma música pausada no momento.');
        }
    }

    if (message.content.startsWith('!stop')) {
        if (dispatcher) {
            dispatcher.destroy();
            message.member.voice.channel.leave();
            message.reply('A reprodução da música foi interrompida!');
        } else {
            message.reply('Não há nenhuma música sendo reproduzida no momento.');
        }
    }
});

client.login(token);
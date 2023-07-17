# MenteMaker-Music

Tutorial: Como criar um bot do Discord usando Node.js 14.16.0

Neste tutorial, você aprenderá como criar um bot do Discord usando Node.js 14.16.0. O bot será capaz de reproduzir música a partir de URLs do YouTube. Aqui está um passo a passo para configurar e executar o bot:

Passo 1: Preparação do ambiente

Certifique-se de ter o Node.js 14.16.0 instalado no seu sistema. Você pode fazer o download em: https://nodejs.org/en/

Passo 2: Inicialização do projeto

Abra o terminal ou prompt de comando e navegue até a pasta onde deseja criar o projeto do bot do Discord. Execute o seguinte comando para iniciar um novo projeto Node.js:

```
npm init -y
```

Esse comando criará um arquivo `package.json` com as configurações padrão.

Passo 3: Instalação das dependências

Agora, instale as seguintes dependências necessárias para o bot:

```
npm install ytdl-core@4.11.5
npm install discord.js@12.5.1
npm install ffmpeg-static@4.3.0
npm install @discordjs/opus@0.5.0
```

Essas dependências são usadas para reproduzir músicas a partir de URLs do YouTube e para interagir com a API do Discord.

Passo 4: Configuração do bot

Crie um novo arquivo chamado `bot.js` (ou qualquer outro nome de sua escolha) e cole o seguinte código nele:

```javascript
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();
const token = 'YOUR_BOT_TOKEN'; // Substitua pelo token do seu bot
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
```

Certifique-se de substituir `'YOUR_BOT_TOKEN'` pelo token do seu bot. Se você ainda não tem um bot do Discord, você pode criar um na página de desenvolvedores do Discord (https://discord.com/developers/applications) seguindo a documentação oficial.

Passo 5: Executando o bot

No terminal ou prompt de comando, execute o seguinte comando para iniciar o bot:

```
node bot.js
```

Se tudo estiver configurado corretamente, você verá a mensagem "Logged in as BOT_USERNAME" indicando que o bot está online e conectado ao Discord.

Passo 6: Adicionando o bot ao servidor

Para adicionar o bot ao seu servidor, você precisa ter permissões de administrador no servidor ou ter permissões suficientes para adicionar bots. Use o seguinte link para convidar o bot para o seu servidor:

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=8
```
Substitua `YOUR_CLIENT_ID` pelo ID do seu aplicativo Discord. Você pode encontrar o ID do seu aplicativo na página de desenvolvedores do Discord.

Parabéns! Agora você tem um bot do Discord funcional que pode reproduzir música a partir de URLs do YouTube. Experimente os comandos `!play`, `!pause`, `!resume` e `!stop` no seu servidor para controlar a reprodução de música.

Observação: Este tutorial utiliza a versão 12.5.1 da biblioteca `discord.js` porque o código fornecido está escrito para essa versão. Se você quiser usar a versão mais recente da biblioteca, você precisará fazer algumas alterações no código.

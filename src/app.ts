import dotenv from 'dotenv'
dotenv.config()

import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
const client: Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
import PlayerClass from './music';
import fs from 'fs'
client['commands'] = new Collection();
const commands = fs.readdirSync("./src/commands")
for (const rawFileName of commands) {
    const fileName = rawFileName.split(".")[0]
    const file = require('./commands/' + fileName)
    client['commands'].set(fileName, file.default)
}

const player = new PlayerClass(Client)
import './events'


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client['commands'].get(interaction.commandName);
    
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);

export { player }
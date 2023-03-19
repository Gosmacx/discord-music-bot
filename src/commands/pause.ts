import { SlashCommandBuilder } from 'discord.js'
import { player } from '../app';

const command = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause song!'), 
    async execute(interaction : any) {
        player.pause(interaction)
        await interaction.reply("Song paused")
    },
};

export default command
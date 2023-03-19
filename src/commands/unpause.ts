import { SlashCommandBuilder } from 'discord.js'
import { player } from '../app';

const command = {
    data: new SlashCommandBuilder()
        .setName('unpause')
        .setDescription('Unpause song!'), 
    async execute(interaction : any) {
        player.unpause(interaction)
        await interaction.reply("Song unpaused")
    },
};

export default command
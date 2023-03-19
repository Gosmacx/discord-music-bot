import { SlashCommandBuilder } from 'discord.js'
import { player } from '../app';

const command = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop song!'), 
    async execute(interaction : any) {
        player.stop(interaction)
        await interaction.reply("Stopped")
    },
};

export default command
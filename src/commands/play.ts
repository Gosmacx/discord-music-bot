import { SlashCommandBuilder } from 'discord.js'
import { player } from '../app';
// CommandInteraction


const command = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song!')
        .addStringOption(option =>
            option.setName('song')
                .setRequired(true)
                .setDescription('Song name')),
    async execute(interaction: any) {
        const query = interaction.options.get("song").value
        await player.play(interaction, query)
    },
};

export default command
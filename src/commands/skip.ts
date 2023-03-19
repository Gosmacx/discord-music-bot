import { SlashCommandBuilder } from 'discord.js'
import { player } from '../app';
// CommandInteraction


const command = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip song!'),
    async execute(interaction: any) {
        player.skip(interaction)

    },
};

export default command
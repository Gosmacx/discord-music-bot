import { player } from '../app'

player.on('track-added', (interaction, song) => {
    const message = `:partying_face: Added to queue | **${song.title}**`
    if (!interaction.isRepliable()) return;
    interaction.editReply({ content: message })
})

player.on('skipped', (interaction) => {
    const message = `Song being skipped...`
    if (interaction.isRepliable()) {
        interaction.reply({ ephemeral: true, content: message })
    } else if (interaction.channel) {
        interaction.channel.send(message)
    }
})

player.on('searching', (interaction, query) => {
    const message = `:mag: **${query.title}** | We're searching everywhere...`
    if (interaction.isRepliable()) {
        interaction.reply({ ephemeral: true, content: message })
    } else if (interaction.channel) {
        interaction.channel.send(message)
    }
})

player.on('playing', (interaction, song) => {
    if (interaction.channel) {
        interaction.channel.send(`Song playing **${song.title}**`)
    }
})
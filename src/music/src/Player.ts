import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import { Client, Interaction } from 'discord.js'
import Service from '../src/Service'
import Utils from '../utils'
import * as types from '../utils/tpyes'

type Result = {
    title: string,
    id: string,
    thumbnail: string,
    url: string,
    interaction: Interaction | undefined
}

type Event = {
    eventType: 'playing' | 'searching' | 'track-added' | 'skipped' | 'stopped',
    emitFunction: (interaction: Interaction, song: Result) => void
}

class Player {
    queue: []
    client: Client
    audioPlayerGuilds: Map<string, AudioPlayer>
    guilds: Map<string, any>
    events: Event[]
    constructor(client: any) {
        this.queue = []
        this.client = client
        this.audioPlayerGuilds = new Map()
        this.guilds = new Map()
        this.events = []
    }

    private audioPlayer(guildId: string) {
        const hasPlayer = this.audioPlayerGuilds.has(guildId)

        if (!hasPlayer) {

            const createdAudioPlayer = createAudioPlayer()
            this.audioPlayerGuilds.set(guildId, createdAudioPlayer)

            // apply to next song event
            createdAudioPlayer.on(AudioPlayerStatus.Idle, () => {
                const song = this.nextSong(guildId)
                if (!song) return;
                this.playerEngine(song.interaction, song)
            });
        }

        return this.audioPlayerGuilds.get(guildId)
    }

    private async youtubeInfoEngine(url: string) {
        const result = await Service.getSong(url)
        if (!result) return;

        return result
    }

    private async youtubeSearchEngine(query: string) {
        const result = await Service.search(query)
        if (!result || !Array.isArray(result)) return;

        return result[0]
    }

    private async search(query: string, handleEmit: Function, interaction: Interaction): Promise<Result> {
        return new Promise(async (resolve) => {
            const type = Utils.typeSelector(query)

            const engines = {
                [types.YOUTUBE]: this.youtubeSearchEngine,
                [types.YOUTUBE_URL]: (_query: string) => Object.create({ title: '', id: '', thumbnail: '', url: _query })
            }
            const { emitFunction } = this.events.find(i => i.eventType === 'searching') ?? {}
            if (emitFunction) {
                emitFunction(interaction, {
                    title: query,
                    id: '',
                    thumbnail: '',
                    url: '',
                    interaction
                })
            }
            // As soon as the url is obtained, the song starts playing
            const info = await engines[type](query)
            resolve(info)

            // Emit song info to user
            if (type === types.YOUTUBE_URL) {
                const urlToSongInfo = await this.youtubeInfoEngine(query)
                handleEmit(urlToSongInfo)
            } else {
                handleEmit(info)
            }

        })
    }

    private addQueue(guildId: string, song: Result, interaction: any) {

        if (!this.guilds.has(guildId)) {
            this.guilds.set(guildId, { queue: [] })
        }

        const guild = this.guilds.get(guildId)

        if (Array.isArray(guild.queue)) {
            song.interaction = interaction
            guild.queue.push(song)
        }
    }

    private nextSong(guildId: string) {
        const guild = this.guilds.get(guildId)
        if (!guild) return;

        guild.queue.splice(0, 1)
        const song = guild.queue?.[0]
        if (this.queue.length <= 0) {
            this.guilds.delete(guildId);
        }

        if (song) return song
        else return null
    }

    private playerEngine(interaction: any, song: Result) {
        const connection =
            getVoiceConnection(interaction.guildId) ??
            joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });

        try {
            const rawSong = Service.getStream(song.url)
            const songAudio = createAudioResource(rawSong)
            connection.subscribe(this.audioPlayer(interaction.guildId))
            this.audioPlayer(interaction.guildId).play(songAudio)
            const { emitFunction } = this.events.find(i => i.eventType === 'playing')
            if (emitFunction) {
                if (song.title.length < 1) {
                    song.title = song.url
                }
                emitFunction(interaction, song)
            }
        } catch (error) {
            console.log("Error on playerEngine", error)
        }
    }

    public on(eventType: Event['eventType'], emitFunction: Event['emitFunction']) {
        this.events.push({
            eventType,
            emitFunction
        })

        return;
    }

    public pause(interaction: Interaction) {
        this.audioPlayer(interaction.guildId).pause()
    }

    public skip(interaction: Interaction) {
        const song = this.nextSong(interaction.guildId)
        if (!song) return null;
        this.playerEngine(interaction, song);
        const event = this.events.find(i => i.eventType === 'skipped')
        if (event) {
            event.emitFunction(interaction, song)
        }
    }

    public stop(interaction: Interaction) {
        try {
            this.audioPlayer(interaction.guildId).stop()
            const event = this.events.find(i => i.eventType === 'stopped')
            this.guilds.delete(interaction.guildId)
            this.audioPlayerGuilds.delete(interaction.guildId)
            if (event) {
                event.emitFunction(interaction, {
                    id: '',
                    thumbnail: '',
                    title: '',
                    url: '',
                    interaction
                })
            }
        } catch (error) {
            
        }
    }

    public unpause(interaction: Interaction) {
        this.audioPlayer(interaction.guildId).unpause()
    }

    public play(interaction: Interaction, query: string): Promise<{ song: Result, guild: boolean }> {
        return new Promise(async (songEmitToUser) => {
            const guild = this.guilds.get(interaction.guildId)

            const handleEmit = (data: Result) => {
                this.addQueue(interaction.guildId, data, interaction)
                const event = this.events.find(i => i.eventType === 'track-added')
                if (event) {
                    event.emitFunction(interaction, data)
                }
                songEmitToUser({ song: data, guild: true })
            }

            const song: Result = await this.search(query, handleEmit, interaction)
            if (guild && guild.queue.length > 0) return;

            const player = this.audioPlayer(interaction.guildId)
            if (player.state.status === 'playing') return;

            this.playerEngine(interaction, song)
        })

    }
}

export default Player
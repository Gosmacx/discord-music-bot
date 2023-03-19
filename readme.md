# Discord bot music module

Discord **music module** with example bot 🔥.

## Used Technologies 👨‍💻
`Typescript`, `Nodejs`, `discord.js`

## Music Module Usage

```js
    const player = new Player(Client)

    player.play(interaction, 'query')

    player.on((interaction, song) => {
        console.log(song.title)
    })
```

## Bot Commands
`play` -> Playing a music with keyword or youtube video link
`pause` -> Pause music
`unpause` -> Unpause music
`skip` -> Skip next music
`stop` -> Stop player
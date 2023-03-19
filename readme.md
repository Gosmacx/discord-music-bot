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
    <br>
`pause` -> Pause music
<br>
`unpause` -> Unpause music
<br>
`skip` -> Skip next music
<br>
`stop` -> Stop player

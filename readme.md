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

## App Video

https://user-images.githubusercontent.com/50182711/227149292-e2628ea7-be94-4cb4-a9e0-2012b1c32e24.mov


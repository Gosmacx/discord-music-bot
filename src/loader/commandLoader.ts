import dotenv from 'dotenv'
dotenv.config()

import { REST, Routes } from 'discord.js';
import fs from 'fs'
const _commands = fs.readdirSync("./src/commands")


const commands = [];

for (const rawFileName of _commands) {
    const fileName = rawFileName.split(".")[0]
    const file = require('../commands/' + fileName)
    const jsonData = file.default.data.toJSON()
    commands.push(jsonData)   
}

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

const rest = new REST({ version: '10' }).setToken(TOKEN);

const Load = async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }

}

Load()
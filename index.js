require('http')
  .createServer(function (req, res) {
    res.write('OK')
    res.end()
  })
  .listen(8080)

const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js')
const { createConnection } = require('mysql')
const { token, mysql: msCfg } = require('./config.json')

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

require('./helpers/extends')

client.con = createConnection({
  host: msCfg.host,
  user: msCfg.user,
  password: msCfg.pass,
  database: msCfg.db,
})

client.con.connect()

client.commands = new Collection()

const commandFolders = fs.readdirSync('./commands')

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`)
    client.commands.set(command.data.name, command)
  }
}

const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

client.login(token)

import socketIO from 'socket.io'
import { Client, Intents } from 'discord.js'

import { Connection } from '../models/connection.mjs'

export default function () {
  this.nuxt.hook('render:before', (_renderer) => {
    const client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
      ]
    })

    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`)
      client.user.setActivity('Lurk lurk lurking')
    })

    client.on('disconnect', (e) => {
      console.log('disconnect', e)
    })

    client.on('guildCreate', (a) => {
      console.log('guildCreate', a)
    })

    client.on('messageCreate', (a) => {
      console.log('messageCreate', a)
    })

    client.on('messageUpdate', (a) => {
      console.log('messageUpdate', a)
    })

    client.login(process.env.DISCORD_BOT_TOKEN)

    this.nuxt.hook('listen', (server, listener) => {
      const io = socketIO(server)
      this.nuxt.hook('close', () => io.close())
      this.nuxt.hook('close', () => client.destroy())
      io.on('connection', function (socket) {
        const user = new Connection(client, socket)
        console.log('a user connected')
        socket.on('disconnect', function () {
          console.log('user disconnected')
        })
        socket.emit('connection', { status: 'ok' })
        // import { v4 as uuidv4 } from 'uuid'
      })
    })
  })
}

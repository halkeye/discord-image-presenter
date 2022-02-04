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
      // TODO - process.exit(1)?
      console.log('disconnect', e)
    })

    client.login(process.env.DISCORD_BOT_TOKEN)

    this.nuxt.hook('listen', (server, listener) => {
      const io = socketIO(server)
      this.nuxt.hook('close', () => io.close())
      this.nuxt.hook('close', () => client.destroy())
      io.on('connection', function (socket) {
        const user = new Connection(client, socket)

        const onMessage = msg => user.onMessage(msg.guildId, msg.channelId, msg.id, msg)
        client.on('messageCreate', onMessage)
        client.on('messageUpdate', onMessage)

        console.log('a user connected')
        socket.on('disconnect', function () {
          console.log('user disconnected')
          client.off('messageCreate', onMessage)
          client.off('messageUpdate', onMessage)
          user.disconnect()
        })
        socket.emit('connection', { status: 'ok' })
        // import { v4 as uuidv4 } from 'uuid'
      })
    })
  })
}

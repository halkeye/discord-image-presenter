import socketIO from 'socket.io'
import { Client, Intents, Permissions } from 'discord.js'
import QueueEventEmitter from 'queue-event-emitter'

import { Connection } from '../models/connection.mjs'

const wait = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

export default function () {
  this.nuxt.hook('render:before', (_renderer) => {
    const client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
      ]
    })

    let isReady = false
    client.on('ready', () => {
      isReady = true
      console.log(`Logged in as ${client.user.tag}!`)
      client.user.setActivity('Lurk lurk lurking')
    })

    client.on('disconnect', (e) => {
      // TODO - process.exit(1)?
      console.log('disconnect', e)
    })

    client.on('guildCreate', function (guild) {
      console.log('the client joins a guild', guild)
    })

    client.on('guildDelete', function (guild) {
      console.log('the client deleted/left a guild', guild)
    })

    client.login(process.env.DISCORD_BOT_TOKEN)

    this.nuxt.hook('listen', (server, listener) => {
      const io = socketIO(server)
      this.nuxt.hook('close', () => io.close())
      this.nuxt.hook('close', () => client.destroy())
      io.on('connection', async function (socket) {
        const logger = console.log.bind(console, `ip: ${socket.request.connection.remoteAddress}, id: ${socket.id}`)
        logger('a user connected')
        while (!isReady) { // eslint-disable-line
          await wait(500)
        }
        const user = new Connection(client, socket, logger)

        const onMessage = msg => user.onMessage(msg.guildId, msg.channelId, msg.id, msg)
        client.on('messageCreate', onMessage)
        client.on('messageUpdate', onMessage)

        const queue = new QueueEventEmitter()
        queue.on('login', (...args) => user.login(...args))
        queue.on('selectGuild', (...args) => user.selectGuild(...args))
        queue.on('selectChannel', (...args) => user.selectChannel(...args))

        socket.onAny((eventName, ...args) => {
          logger('onAny', eventName, args)
          queue.emit(eventName, ...args)
        })

        socket.on('disconnect', function () {
          logger('user disconnected')
          client.off('messageCreate', onMessage)
          client.off('messageUpdate', onMessage)
          user.disconnect()
        })
        socket.emit('connection', { status: 'ok' })
        // import { v4 as uuidv4 } from 'uuid'

        socket.emit('SET_INVITE_URL', client.generateInvite({
          permissions: [
            Permissions.FLAGS.ADD_REACTIONS,
            Permissions.FLAGS.READ_MESSAGE_HISTORY,
            Permissions.FLAGS.VIEW_CHANNEL
          ],
          scopes: ['bot']
        }))
      })
    })
  })
}

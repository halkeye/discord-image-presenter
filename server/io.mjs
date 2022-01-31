import { Client, Intents, Permissions } from 'discord.js'
import axios from 'axios'

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

const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

const nullNotFound = (e) => {
  // doesnt exist
  if (e.httpStatus === 404) {
    return null
  }
  // we don't have access
  if (e.httpStatus === 403) {
    return null
  }
  throw e
}
export default function (socket, _io) {
  const user = {
    guilds: {}
  }
  console.log('connected', user)

  socket.emit('SET_GUILDS', null)
  socket.emit('SET_CHANNELS', null)
  socket.emit('SET_MESSAGES', null)

  const getGuild = async (guildId) => {
    if (!user.guilds[guildId]) {
      throw new Error(`No access to guild ${guildId}`)
    }
    return client.guilds.fetch(guildId).catch(nullNotFound)
  }

  return Object.freeze({
    async login (token) {
      console.log('login', token)

      while (!isReady) { // eslint-disable-line no-unmodified-loop-condition
        console.log('login.waiting for ready')
        await sleep()
      }

      const me = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: token
        }
      }).then(resp => resp.data)
      user.memberId = me.id

      const guilds = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: token
        }
      }).then(resp => client.guilds.fetch(resp.data.map(guild => guild.id)).catch(nullNotFound))
        .then(resps => resps.filter(Boolean))

      socket.emit('SET_INVITE_URL', client.generateInvite({
        permissions: [
          Permissions.FLAGS.ADD_REACTIONS,
          Permissions.FLAGS.READ_MESSAGE_HISTORY,
          Permissions.FLAGS.VIEW_CHANNEL
        ],
        scopes: ['bot']
      }))

      const subGuilds = guilds.map(guild => ({
        id: guild.id,
        name: guild.name,
        icon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      }))
      socket.emit('SET_GUILDS', subGuilds)
      user.guilds = subGuilds.reduce(function (prev, guild) {
        prev[guild.id.toString()] = guild.name
        return prev
      }, {})
      return { status: 'ok' }
    },
    async selectGuild (guildId) {
      while (!isReady) { // eslint-disable-line no-unmodified-loop-condition
        console.log('selectGuild.waiting for ready')
        await sleep()
      }
      console.log('selectGuild.user', guildId, user)
      const guild = await getGuild(guildId)
      if (!guild) {
        throw new Error(`Invalid Guild ID ${guildId}`)
      }
      user.selectedGuild = guildId
      const member = await guild.members.fetch(user.memberId)
      if (!member) {
        throw new Error(`Can't access this guild ${guild}`)
      }

      const channels = guild.channels.cache
        .filter(channel => channel.viewable)
        .filter(channel => channel.isText())
        .filter(channel => channel.permissionsFor(member).has(Permissions.FLAGS.READ_MESSAGE_HISTORY))

      socket.emit('SET_CHANNELS', channels.map(c => ({
        id: c.id,
        name: c.name,
        nsfw: c.nsfw,
        topic: c.topic
      })))
      return { status: 'ok' }
    },
    async selectChannel (channelId) {
      console.log('selecChannel.user', channelId, user)
      const guild = await getGuild(user.selectedGuild)
      if (!guild) {
        throw new Error(`Invalid Guild ID ${user.selectedGuild}`)
      }
      const member = await guild.members.fetch(user.memberId)
      if (!member) {
        throw new Error(`Can't access this guild ${guild}`)
      }
      const channel = await guild.channels.fetch(channelId)
      if (!channel) {
        throw new Error(`Invalid Channel ID ${channelId}`)
      }
      const hasPermission = channel.permissionsFor(member).has(Permissions.FLAGS.READ_MESSAGE_HISTORY)
      if (!hasPermission) {
        throw new Error('User cant read')
      }
      let messages = await channel.messages.fetch()
      messages = messages.filter(m => m.attachments.size)

      socket.emit('SET_MESSAGES', messages.map(m => ({
        id: m.id,
        createdTimestamp: m.createdTimestamp,
        author: m.author.username,
        content: m.content,
        attachments: Array.from(m.attachments.values())
          .filter(a => a.contentType.startsWith('image/'))
          .map(a => a.url)
        // reactions: m.reactions
      })))
      return {
        status: 'ok'
      }
    }
  })
}

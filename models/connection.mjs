import axios from 'axios'
import { Permissions } from 'discord.js'

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

function _mapMessage (m) {
  return {
    id: m.id,
    createdTimestamp: m.createdTimestamp,
    author: m.author.username,
    content: m.content,
    attachments: Array.from(m.attachments.values())
      .filter(a => a.contentType.startsWith('image/'))
      .map(a => a.url)
      // reactions: m.reactions
  }
}

export class Connection {
  constructor (discordSocket, socket) {
    this.socket = socket
    this.discordSocket = discordSocket
    this.guilds = {}

    socket.emit('SET_GUILDS', null)
    socket.emit('SET_CHANNELS', null)
    socket.emit('SET_MESSAGES', null)
  }

  disconnect () {
    // unbind anything as needed
  }

  onMessage (guildId, channelId, _id, msg) {
    if (!this.selectedGuildId) { return }
    if (guildId !== this.selectedGuildId) { return }
    if (channelId !== this.selectedChannelId) { return }

    this.socket.emit('UPDATE_MSG', _mapMessage(msg))
    // CLIENT
    // object of msg id to message
    // computed list of messages sorted by msg.createdTimestamp
  }

  getGuild (guildId) {
    if (!this.guilds[guildId]) {
      throw new Error(`No access to guild ${guildId}`)
    }
    return this.discordSocket.guilds.fetch(guildId).catch(nullNotFound)
  }

  async login (token) {
    console.log('login', token)

    this.socket.emit('SET_INVITE_URL', this.discordSocket.generateInvite({
      permissions: [
        Permissions.FLAGS.ADD_REACTIONS,
        Permissions.FLAGS.READ_MESSAGE_HISTORY,
        Permissions.FLAGS.VIEW_CHANNEL
      ],
      scopes: ['bot']
    }))

    const me = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: token
      }
    }).then(resp => resp.data)
    this.memberId = me.id

    const usersGuilds = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: token
      }
    })
    const mutualGuilds = await this.discordSocket.guilds.fetch(usersGuilds.data.map(guild => guild.id)).catch(nullNotFound)
    const subGuilds = mutualGuilds.map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    }))
    this.socket.emit('SET_GUILDS', subGuilds)
    this.guilds = subGuilds.reduce(function (prev, guild) {
      prev[guild.id.toString()] = guild.name
      return prev
    }, {})
    return { status: 'ok' }
  }

  async selectGuild (guildId) {
    if (guildId === null) {
      delete this.selectedGuild
      return
    }

    console.log('selectGuild.user', guildId, this.guilds)
    const guild = await this.getGuild(guildId)
    if (!guild) {
      throw new Error(`Invalid Guild ID ${guildId}`)
    }
    this.selectedGuildId = guildId
    const member = await guild.members.fetch(this.memberId)
    if (!member) {
      throw new Error(`Can't access this guild ${guild}`)
    }

    const channels = guild.channels.cache
      .filter(channel => channel.viewable)
      .filter(channel => channel.isText())
      .filter(channel => channel.permissionsFor(member).has(Permissions.FLAGS.READ_MESSAGE_HISTORY))

    this.socket.emit('SET_CHANNELS', channels.map(c => ({
      id: c.id,
      name: c.name,
      nsfw: c.nsfw,
      topic: c.topic
    })))
    return { status: 'ok' }
  }

  async selectChannel (channelId) {
    console.log('selecChannel.user', channelId, this.guilds)
    const guild = await this.getGuild(this.selectedGuildId)
    if (!guild) {
      throw new Error(`Invalid Guild ID ${this.selectedGuildId}`)
    }
    const member = await guild.members.fetch(this.memberId)
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

    this.selectedChannelId = channelId

    let messages = await channel.messages.fetch()
    messages = messages.filter(m => m.attachments.size)

    this.socket.emit('SET_MESSAGES', messages.map(m => _mapMessage(m)))
    return {
      status: 'ok'
    }
  }
}

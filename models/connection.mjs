import fetch from 'node-fetch'
import { Permissions } from 'discord.js'

function checkHttpStatus (res) {
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return res
}

function discordFetch (url, token) {
  return fetch(url, {
    headers: {
      Authorization: token
    }
  }).then(checkHttpStatus).then(resp => resp.json()).catch((err) => {
    throw new Error(`Unable to access ${url}: "${err}"`)
  })
}

function validAttachment (a) {
  return a.contentType.startsWith('image/')
}

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
  return Array.from(m.attachments.entries())
    .filter(([id, att]) => validAttachment(att))
    .map(([id, att]) => ({
      id: `${m.id}_${id}`,
      createdTimestamp: m.createdTimestamp,
      author: m.author.username,
      content: m.content,
      attachment: att.url
      // reactions: m.reactions
    }))
}

export class Connection {
  constructor (discordSocket, socket, logger) {
    this.socket = socket
    this.discordSocket = discordSocket
    this.guilds = {}
    this.logger = logger || console.log

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

    _mapMessage(msg).forEach(msg => this.socket.emit('UPDATE_MSG', msg))
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
    this.logger('login', token)

    const me = await discordFetch('https://discord.com/api/users/@me', token)
    this.logger('me', me)
    this.memberId = me.id

    const usersGuilds = await discordFetch('https://discord.com/api/users/@me/guilds', token)

    const mutualGuilds = await this.discordSocket.guilds.fetch(usersGuilds.map(guild => guild.id)).catch(nullNotFound)

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

    this.logger('selectGuild.user', guildId, this.guilds)
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
    this.logger('selecChannel.user', channelId, this.guilds)
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
    messages = messages.filter(m => m.attachments.size && m.attachments.some(validAttachment))

    this.socket.emit('SET_MESSAGES', messages.map(m => _mapMessage(m)).flat(1))
    return {
      status: 'ok'
    }
  }
}

const { Client, Intents } = require('discord.js')
const axios = require('axios')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

function getGuilds () {
  return client.guilds.cache.map((guild) => {
    return {
      id: guild.id,
      name: guild.name,
      channels: guild.channels.cache.map(channel => ({ id: channel.id, name: channel.name }))
    }
  })
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log(`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=1024&scope=bot`)

  // console.log('startup', getGuilds())
  /*
  client.user.setActivity("the upright organ");
	client.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
	.then(link => {
		console.log(`Generated bot invite link: ${link}`);
		inviteLink = link;
	});
  */
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

export default function (_socket, _io) {
  const user = {
    guilds: {}
  }
  console.log('connected', user)

  return Object.freeze({
    async login (token) {
      try {
        console.log('login')
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
        }).then(resp => resp.data)
        user.guilds = guilds.reduce(function (prev, guild) {
          prev[guild.id.toString()] = guild.name
          return prev
        }, {})
        return { status: 'ok', guilds }
      } catch (err) {
        console.error(err)
        return { status: 'err', error: err }
      }
    },
    selectGuild (guildId) {
      try {
        console.log('selectGuild.user', user)
        if (!user.guilds[guildId]) {
          throw new Error(`Invalid Guild ID ${guildId}`)
        }
        const guild = client.guilds.cache.find(guild => guild.id === guildId)
        if (!guild) {
          throw new Error(`Invalid Guild ID ${guildId}`)
        }
        user.selectedGuild = guildId
        const member = guild.members.cache.find(member => member.id === user.memberId)
        console.log({ member, members: guild.members.cache })
        // 	Permissions.FLAGS.READ_MESSAGE_HISTORY,
        // 	const { Permissions } = require('discord.js');
        // if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        //  console.log('This member can kick');
        // }
        return {
          status: 'ok',
          channels: guild.channels.cache.map(channel => ({ id: channel.id, name: channel.name }))
        }
      } catch (err) {
        console.error(err)
        return { status: 'err', error: err }
      }
    },
    selectChannel (channelId) {
      try {
        console.log('selecChannel.user', user)
        const guild = client.guilds.cache.find(guild => guild.id === user.selectedGuild)
        if (!guild) {
          throw new Error(`Invalid Guild ID ${user.selectedGuild}`)
        }
        const channel = guild.channels.cache.find(channel => channel.id === channelId)
        if (!channel) {
          throw new Error(`Invalid Channel ID ${channelId}`)
        }
        return {
          status: 'ok',
          messages: []
        }
      } catch (err) {
        console.error(err)
        return { status: 'err', error: err }
      }
    }
  })
}

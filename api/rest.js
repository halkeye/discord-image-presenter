const bodyParser = require('body-parser')
const app = require('express')()
const { Server } = require('socket.io')
const { Client, Intents } = require('discord.js')

const io = new Server(app)
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

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})

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

app.use(bodyParser.json())
app.use((err, _req, res, next) => {
  console.log(err); // eslint-disable-line
  const status = err.statusCode || 500
  const message = err.message
  const data = err.data
  res.status(status).json({ message, data })
  next(err)
})

app.all('/getJSON', (req, res) => {
  console.log(req.user)
  res.json({ data: 'data' })
})

module.exports = app

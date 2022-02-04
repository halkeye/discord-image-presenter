import test from 'ava'
import sinon from 'sinon'
import { Connection } from '../../../models/connection.mjs'

function mockDiscordSocket () {
  return {
    on: sinon.stub()
  }
}

function mockSocketIo () {
  return {
    onAny: sinon.stub(),
    on: sinon.stub(),
    emit: sinon.stub()
  }
}

test.beforeEach((t) => {
  t.context.socket = mockSocketIo()
  t.context.discordSocket = mockDiscordSocket()
  t.context.guildId = 123
  t.context.channelId = 234
  t.context.messageId = 456

  t.context.connection = new Connection(t.context.discordSocket, t.context.socket)
})

test('takes in parameters', (t) => {
  t.truthy(t.context.connection)
})

test('new message emits UPDATE_MSG', (t) => {
  t.deepEqual(t.context.socket.emit.getCalls().map(c => c.args), [
    ['SET_GUILDS', null],
    ['SET_CHANNELS', null],
    ['SET_MESSAGES', null]
  ])
  t.context.socket.emit.resetHistory()
  t.context.connection.selectedGuildId = t.context.guildId
  t.context.connection.selectedChannelId = t.context.channelId

  t.context.connection.onMessage(t.context.guildId, t.context.channelId, t.context.messageId, {
    id: t.context.messageId,
    createdTimestamp: 0,
    author: { username: 'halkeye' },
    content: 'message',
    attachments: new Set([{
      contentType: 'image/png',
      url: 'https://example.com/path/to/image.png'
    }])
  })
  t.deepEqual(t.context.socket.emit.getCalls().map(c => c.args), [
    ['UPDATE_MSG', {
      attachments: ['https://example.com/path/to/image.png'],
      author: 'halkeye',
      content: 'message',
      createdTimestamp: 0,
      id: t.context.messageId
    }]
  ])
})

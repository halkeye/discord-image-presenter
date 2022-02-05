import connection from '~/plugins/socketio'

export default {
  getters: {
    isAuthenticated (state) {
      return state.auth.loggedIn
    },
    loggedInUser (state) {
      return state.auth.user
    },
    messages (state) {
      return Object.values(state.messages).sort((a, b) => a.createdTimestamp - b.createdTimestamp)
    },
    currentGuild (state) {
      if (!state.selectedGuildId) { return null }
      return state.guilds.find(guild => guild.id === state.selectedGuildId)
    },
    currentChannel (state) {
      if (!state.selectedChannelId) { return null }
      return state.channels.find(channel => channel.id === state.selectedChannelId)
    }
  },
  state: () => {
    return {
      guilds: [],
      channels: [],
      messages: {},
      emitErrors: {},
      socketCalls: [],
      inviteUrl: '',
      selectedGuildId: 0,
      selectedChannelId: 0
    }
  },
  mutations: {
    SET_CHANNELS (state, data) {
      state.channels = data ? [...data] : []
    },
    SET_GUILDS (state, data) {
      state.guilds = data ? [...data] : []
    },
    SET_MESSAGES (state, data) {
      if (data !== null) {
        if (!Array.isArray(data)) {
          data = data.reduce(function (prev, cur) {
            prev[cur.id] = cur
            return prev
          }, {})
        }
        state.messages = { ...data }
      } else {
        state.messages = {}
      }
    },
    UPDATE_MSG (state, data) {
      state.messages = { ...state.messages, [data.id]: data }
    },
    SET_INVITE_URL (state, data) {
      state.inviteUrl = data
    },
    RECORD_SOCKET_CALL (state, data) {
      console.log('RECORD_SOCKET_CALL', data)
      state.socketCalls = [...state.socketCalls, data]
    },
    SELECT_CHANNEL (state, data) {
      state.selectedChannelId = data
    },
    SELECT_GUILD (state, data) {
      state.selectedGuildId = data
    }
  },
  actions: {
    login ({ commit }) {
      commit('RECORD_SOCKET_CALL', ['login'])
      connection.emit('login', this.$auth.strategy.token.get())
    },
    selectGuild ({ commit }, guildId) {
      commit('RECORD_SOCKET_CALL', ['selectGuild', guildId])
      connection.emit('selectGuild', guildId)
    },
    selectChannel ({ commit }, channelId) {
      commit('RECORD_SOCKET_CALL', ['selectChannel', channelId])
      connection.emit('selectChannel', channelId)
    },
    asyncEmit (_, context) {
      if (!context.eventName) {
        throw new Error('No eventName in asyncEmit invocation!')
      }

      const eventName = context.eventName
      const socket = window.$nuxt.$root.mainSocket
      return new Promise(function (resolve) {
        socket.emit(eventName, context)
        socket.once(eventName, resolve)
      })
    }
  }
}

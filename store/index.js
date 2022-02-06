import Fifo from 'localstorage-fifo'
import connection from '~/plugins/socketio'

export default {
  getters: {
    enabledMessageCollection () {
      console.log('enabledMessageCollection')
      return new Fifo({ namespace: 'em' })
    },
    isAuthenticated (state) {
      return state.auth.loggedIn
    },
    loggedInUser (state) {
      return state.auth.user
    },
    messages (state, getters) {
      const collection = getters.enabledMessageCollection
      return Object.values(state.messages)
        .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
        .map(m => ({ ...m, authorized: collection.get(`m:${m.id}`) }))
    },
    enabledMessages (_state, getters) {
      return getters.messages.filter(m => m.authorized)
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
      emitErrors: [],
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
    REPORT_ERROR (state, data) {
      state.emitErrors = [...state.emitErrors, data]
    },
    SELECT_CHANNEL (state, data) {
      state.selectedChannelId = data
    },
    SELECT_GUILD (state, data) {
      state.selectedGuildId = data
    }
  },
  actions: {
    unauthorizeMessage ({ commit, state, getters }, id) {
      getters.enabledMessageCollection.remove(`m:${id}`)
      commit('UPDATE_MSG', { ...state.messages[id], authorized: false })
    },
    authorizeMessage ({ commit, state, getters }, id) {
      getters.enabledMessageCollection.set(`m:${id}`, true)
      commit('UPDATE_MSG', { ...state.messages[id], authorized: true })
    },
    login ({ dispatch }) {
      dispatch('asyncEmit', ['login', this.$auth.strategy.token.get()])
    },
    getGuilds ({ dispatch }) {
      dispatch('asyncEmit', ['getGuilds'])
    },
    selectGuild ({ dispatch }, guildId) {
      dispatch('asyncEmit', ['selectGuild', guildId])
    },
    selectChannel ({ dispatch }, channelId) {
      dispatch('asyncEmit', ['selectChannel', channelId])
    },
    asyncEmit ({ commit }, [eventName, ...args]) {
      commit('RECORD_SOCKET_CALL', [eventName, ...args])
      return new Promise(function (resolve) {
        connection.emit(eventName, ...args)
        connection.once('RESPONSE_' + eventName, resolve)
      })
    }
  }
}

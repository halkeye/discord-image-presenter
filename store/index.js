import Vue from 'vue'
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
      return Object.values(state.messages)
        .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
        .map(m => ({ ...m, authorized: !!state.messageApprovals[m.id] }))
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
      messageApprovals: {},
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
        state.messages = Object.values(data).reduce(function (prev, m) {
          prev[m.id] = m
          return prev
        }, {})
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
    },
    SET_APPROVAL (state, data) {
      if (data.approved) {
        Vue.set(state.messageApprovals, data.id, true)
      } else {
        Vue.delete(state.messageApprovals, data.id)
      }
    }
  },
  actions: {
    unauthorizeMessage ({ commit }, id) {
      commit('SET_APPROVAL', { approved: false, id })
    },
    authorizeMessage ({ commit }, id) {
      commit('SET_APPROVAL', { approved: true, id })
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

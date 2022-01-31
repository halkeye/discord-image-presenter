export default {
  getters: {
    isAuthenticated (state) {
      return state.auth.loggedIn
    },
    loggedInUser (state) {
      return state.auth.user
    }
  },
  state: () => {
    return {
      guilds: null,
      emitErrors: {},
      inviteUrl: ''
    }
  },
  mutations: {
    '$nuxtSocket/SET_EMIT_ERRORS' (state, { label, emitEvt, err }) {
      state.emitErrors[emitEvt] = (state.emitErrors[emitEvt] || []).concat(err)
    },
    SET_CHANNELS (state, data) {
      state.channels = [...data]
    },
    SET_GUILDS (state, data) {
      state.guilds = [...data]
    },
    SET_INVITE_URL (state, data) {
      state.inviteUrl = data
    }
  },
  actions: {
  }
}

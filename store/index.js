import { v4 as uuidv4 } from 'uuid'

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
      channels: null,
      messages: null,
      emitErrors: {},
      inviteUrl: ''
    }
  },
  mutations: {
    '$nuxtSocket/SET_EMIT_ERRORS' (state, { label, emitEvt, err }) {
      state.emitErrors[emitEvt] = (state.emitErrors[emitEvt] || []).concat({
        guid: uuidv4(),
        ...err
      })
    },
    SET_CHANNELS (state, data) {
      state.channels = data ? [...data] : null
    },
    SET_GUILDS (state, data) {
      state.guilds = data ? [...data] : null
    },
    SET_MESSAGES (state, data) {
      state.messages = data ? [...data] : null
    },
    SET_INVITE_URL (state, data) {
      state.inviteUrl = data
    }
  },
  actions: {
  }
}

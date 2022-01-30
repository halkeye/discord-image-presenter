export default {
  getters: {
    isAuthenticated (state) {
      return state.auth.loggedIn
    },
    loggedInUser (state) {
      return state.auth.user
    },
    guilds (state) {
      return state.guilds
    }
  },
  state: () => {
    return {
      guilds: process.client ? localStorage.getItem('discordGuilds') : null
    }
  },
  mutations: {
    SET_GUILDS (state, data) {
      console.log('setting guilds', data)
      // TODO - add cache ttl
      localStorage.setItem('discordGuilds', data)
      state.guilds = data
    }
  },
  actions: {
    async getGuilds ({ state, commit }) {
      console.log('getting guilds', state)
      if (state.guilds === null) {
        let guilds = await this.$axios.$get('https://discord.com/api/users/@me/guilds')
        guilds = guilds.map(guild => ({ name: guild.name, id: guild.id }))
        commit('SET_GUILDS', guilds)
      }
    },
    async getChannels ({ state, commit }) {
      console.log('getting channels', state)
      console.log('channels', await this.$axios.$get('https://discord.com/api/users/@me'))
      if (state.channels === null) {
        const guildID = 1
        const channels = await this.$axios.$get(`https://discord.com/api/guilds/${guildID}/channels`)
        // `guilds = guilds.map(guild => ({ name: guild.name, id: guild.id }))
        commit('SET_CHANNELS', channels)
      }
    }
  }
}

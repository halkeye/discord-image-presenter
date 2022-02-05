<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import connection from '~/plugins/socketio'

export default {
  name: 'LayoutWrapper',
  computed: {
    ...mapState({
      emitErrors: 'emitErrors'
    })
  },
  watch: {
    $route (to, from) {
      if (to.params.guild && !from.params.guild) {
        this.$store.dispatch('selectGuild', to.params.guild)
      }
      if (to.params.channel && !from.params.channel) {
        this.$store.dispatch('selectChannel', to.params.channel)
      }
      this.$store.commit('SELECT_GUILD', to.params.guild)
      this.$store.commit('SELECT_CHANNEL', to.params.channel)
    },
    $auth (to, from) {
      console.log('watch-$auth', to, from)
    }
  },
  mounted () {
    connection.onAny((eventName, ...args) => {
      console.log('onAny', eventName, args)
      this.$store.commit(eventName, ...args)
    })
    this.$root.mainSocket = connection
    // TODO - on disconnect refresh?
    if (this.$auth.loggedIn) {
      this.$store.dispatch('login')
      if (this.$route.params.guild) {
        this.$store.dispatch('selectGuild', this.$route.params.guild)
      }
      if (this.$route.params.channel) {
        this.$store.dispatch('selectChannel', this.$route.params.channel)
      }
    }
    this.$store.commit('SELECT_GUILD', this.$route.params.guild)
    this.$store.commit('SELECT_CHANNEL', this.$route.params.channel)
  }
}
</script>
const IndexPage = { template: '<div>IndexPage</div>' }

<template>
  <div>
    <NavBar />
    <div class="d-flex justify-content-center align-items-center min-vh-100 min-vw-100">
      <div class="shadow-lg p-3 mb-5 bg-white rounded" style="width: 90%">
        <ErrorBanners :emit-errors="emitErrors" />
        <Nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import connection from '~/plugins/socketio'

export default {
  name: 'DefaultLayout',
  computed: {
    ...mapState({
      emitErrors: 'emitErrors'
    })
  },
  watch: {
    $route (to, from) {
      /*
      if (to.name === 'index') {
        this.$store.dispatch('selectGuild', null)
      } else if (to.name === 'guild') {
        this.$store.dispatch('selectGuild', to.params.guild)
      } else if (to.name === 'guild-channel' || to.name === 'guild-channel-images') {
        this.$store.dispatch('selectGuild', to.params.guild)
        this.$store.dispatch('selectChannel', to.params.channel)
      }
      */
      console.log('watch-$route', to, from)
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
  }
}
</script>

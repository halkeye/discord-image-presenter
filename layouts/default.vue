<template>
  <div class="bg-gray-100 min-h-screen">
    <NavBar />
    <Nuxt />
  </div>
</template>

<script>
import connection from '~/plugins/socket.io.js'

export default {
  name: 'DefaultLayout',
  mounted () {
    connection.onAny((eventName, ...args) => {
      console.log('onAny', eventName, args)
      this.$store.commit(eventName, ...args)
    })
    this.$root.mainSocket = connection
  }
}
</script>

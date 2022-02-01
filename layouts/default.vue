<template>
  <div>
    <NavBar />
    <div class="d-flex justify-content-center align-items-center min-vh-100 min-vw-100">
      <div class="shadow-lg p-3 mb-5 bg-white rounded" style="width: 90%">
        <Nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import connection from '~/plugins/socketio'

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

<template>
  <DangerNotification v-if="error" :message="error" />
</template>

<script>
import DangerNotification from '~/components/DangerNotification'

export default {
  name: 'LoginPage',

  components: {
    DangerNotification
  },

  // middleware: 'guest',

  data () {
    return {
      error: null
    }
  },

  created () {
    /*
    if (!this.$auth.loggedIn) {
      this.$auth.loginWith('discord')
    }
    */
  },

  methods: {
  }
}
</script>

<template>
  <DangerNotification v-if="error" :message="error" />
</template>

<script>
export default {
  name: 'LoginPage',
  middleware: 'guest',

  data () {
    return {
      error: null
    }
  },

  created () {
    if (!this.$auth.loggedIn) {
      this.$auth.loginWith('discord')
    }
  },

  methods: {
  }
}
</script>

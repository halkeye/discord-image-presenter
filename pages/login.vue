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

  mounted () {
    this.$auth.loginWith('discord')
  },

  methods: {
  }
}
</script>

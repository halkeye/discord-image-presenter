<template>
  <div>
    <DiscordMessages :messages="messages" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ChannelIndexPage',
  auth: true,
  computed: {
    ...mapState({
      messages: 'messages'
    })
  },
  mounted () {
    this.$store.dispatch('selectChannel', this.$route.params.channel)
  }
}
</script>

<template>
  <div>
    <DiscordMessages :messages="messages" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ChannelIndexPage',
  auth: true,
  computed: {
    ...mapGetters({
      messages: 'messages'
    })
  }
}
</script>

<template>
  <div>
    <b-button variant="primary" @click="present">
      Present
    </b-button>
    <DiscordMessages :messages="messages" />
    <pre>{{ JSON.stringify(currentGuild, null, 2) }}</pre>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ChannelIndexPage',
  auth: true,
  computed: {
    ...mapGetters({
      messages: 'messages',
      currentGuild: 'currentGuild'
    })
  },
  methods: {
    present () {
      const href = this.$router.resolve({ name: 'g-guild-c-channel-images', params: this.$route.params }).href
      window.open(href, `guild_${this.$route.params.guild}`, 'location=no,menubar=no,resizable=yes,scrollbars=no,status=no,titlebar=yes,toolbar=no')
    }
  }
}
</script>

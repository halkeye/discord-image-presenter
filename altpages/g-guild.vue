<template>
  <div>
    Guild Page
    <DiscordChannels :channels="channels" :guild-id="$route.params.guild" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GuildIndexPage',
  auth: true,
  computed: {
    guild () { return this.$route.params.guild },
    ...mapState({
      channels: 'channels'
    })
  }
}
</script>

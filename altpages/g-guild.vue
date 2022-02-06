<template>
  <div v-if="currentGuild">
    {{ currentGuild.name }}'s Channels
    <DiscordChannels :channels="channels" :guild-id="$route.params.guild" />
  </div>
  <b-spinner v-else label="Loading" />
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'GuildIndexPage',
  auth: true,
  computed: {
    guild () { return this.$route.params.guild },
    ...mapGetters({
      currentGuild: 'currentGuild'
    }),
    ...mapState({
      channels: 'channels'
    })
  }
}
</script>

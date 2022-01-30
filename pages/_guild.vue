<template>
  <div class="bg-gray-100 min-h-screen">
    <NavBar />
    <DiscordChannels :guild="$route.params.channel" />
    <input
      :value="$route.params.channel"
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GuildIndexPage',
  auth: true,
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  }
}
</script>

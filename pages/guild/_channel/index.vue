<template>
  <div class="bg-gray-100 min-h-screen">
    <NavBar />
    <DiscordChannels guild="1234" />
    channel-index-page
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ChannelIndexPage',
  auth: true,
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  }
}
</script>

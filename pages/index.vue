<template>
  <div class="bg-gray-100 min-h-screen">
    <NavBar />
    <DiscordGuilds v-if="isAuthenticated" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'IndexPage',
  auth: false,
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  }
}
</script>

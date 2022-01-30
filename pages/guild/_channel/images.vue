<template>
  <div class="bg-gray-100 min-h-screen">
    <NavBar />
    channel-images-page
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ChannelImagesPage',
  auth: true,
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  }
}
</script>

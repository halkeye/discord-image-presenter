<template>
  <div>
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

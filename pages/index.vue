<template>
  <div>
    <DiscordGuilds if="guilds != null" :invite-url="inviteUrl" :guilds="guilds" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'IndexPage',
  auth: false,
  computed: {
    ...mapState({
      guilds: 'guilds',
      inviteUrl: 'inviteUrl'
    })
  }
}
</script>

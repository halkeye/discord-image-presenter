<template>
  <div>
    <DiscordGuilds if="guilds != null" :invite-url="inviteUrl" :guilds="guilds" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PageSelectAGuild',
  auth: true,
  computed: {
    ...mapState({
      guilds: 'guilds',
      inviteUrl: 'inviteUrl'
    })
  }
}
</script>

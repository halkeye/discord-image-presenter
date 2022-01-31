<template>
  <div>
    <div v-if="emitErrors">
      <div v-for="(value, name, index) in emitErrors" :key="index">
        <b-alert v-for="err in value" :key="err.message" variant="danger" show>
          {{ err.message }}
        </b-alert>
      </div>
    </div>
    <DiscordMessages v-if="messages != null" />
    <DiscordChannels v-else-if="channels != null" />
    <DiscordGuilds v-else-if="guilds != null" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'IndexPage',
  auth: false,
  computed: {
    ...mapState({
      emitErrors: 'emitErrors',
      guilds: 'guilds',
      channels: 'channels',
      messages: 'messages'
    })
  }
}
</script>

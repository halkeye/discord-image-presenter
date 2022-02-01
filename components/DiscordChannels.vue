<template>
  <div>
    <strong>Which channel?</strong>:
    <div v-if="channels != null">
      <b-row cols="1" cols-sm="1" cols-md="3" cols-lg="5">
        <b-col v-for="channel in channels" :key="channel.id" class="p-2">
          <b-button variant="primary" style="width: 100%; height: 100%;" @click="selectChannel(channel.id)">
            #{{ channel.name }}
          </b-button>
        </b-col>
      </b-row>
    </div>
    <b-spinner v-else label="Spinning" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DiscordChannels',

  computed: {
    ...mapState({
      channels: 'channels'
    })
  },
  methods: {
    selectChannel (channelId) {
      this.$store.dispatch('selectChannel', channelId)
    }
  }
}
</script>

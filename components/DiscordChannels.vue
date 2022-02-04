<template>
  <div>
    <strong>Which channel?</strong>:
    <b-row cols="1" cols-sm="1" cols-md="3" cols-lg="5">
      <b-col v-for="channel in channels" :key="channel.id" class="p-2">
        <nuxt-link :to="'c/' + channel.id + '/'">
          <b-button variant="primary" style="width: 100%; height: 100%;">
            #{{ channel.name }}
          </b-button>
          </nuext-link>
        </nuxt-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'DiscordChannels',
  props: {
    guildId: {
      type: String,
      default: () => '0'
    },
    channels: {
      type: Array,
      default: () => []
    }
  }
}
</script>

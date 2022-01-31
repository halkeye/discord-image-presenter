<template>
  <div class="max-w-4xl mx-auto sm:px-6 lg:px-8 grow">
    <div class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6 w-full">
      <strong>Which channel?</strong>:
      <ul>
        <li v-for="channel in channels" :key="channel.id">
          <nuxt-link :to="'/guild/' + channel.id" class="flex">
            <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
              {{ channel.name }}
            </button>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DiscordChannels',

  data () {
    return {
      channels: []
    }
  },

  computed: {
    // ...mapState({ channels: 'channels' }),
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },

  watch: {
    emitErrors (newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`)
    }
  },

  async mounted () {
    const guildID = this.$attrs.guild

    const selectGuildResp = await this.socket.emitAsync('selectGuild', guildID)
    console.log('selectGuildResp', selectGuildResp)
    if (selectGuildResp.status === 'ok') {
      this.channels = selectGuildResp.channels
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto sm:px-6 lg:px-8 grow">
    <div class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6 w-full">
      <div v-if="messages != null">
        <div v-for="message in messages" :key="message.id" class="p-2">
          <img :src="message.attachments[0]">
          <b-form-checkbox v-model="checked[message.id]" name="check-button" switch>
            Switch Checkbox <b>(Checked: {{ checked[message.id] }})</b>
          </b-form-checkbox>
          <blockquote>{{ message.content }}</blockquote>
          <dd>By: {{ message.author }}</dd>
          <dd>At: {{ formatTime(message.createdTimestamp) }}</dd>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DiscordMessages',

  data () {
    return {
      checked: {}
    }
  },

  computed: {
    ...mapState({
      messages: 'messages'
    })
  },
  methods: {
    formatTime (timestamp) {
      return new Date(timestamp)
    },
    async selectChannel (channelId) {
      this.socket = this.$nuxtSocket({ persist: 'defaultLabel' })
      await this.$store.dispatch(
        '$nuxtSocket/emit',
        {
          label: 'defaultLabel',
          evt: 'selectChannel',
          msg: channelId,
          emitTimeout: 5000
        }
      )
    }
  }
}
</script>

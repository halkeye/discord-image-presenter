<template>
  <div class="max-w-4xl mx-auto sm:px-6 lg:px-8 grow">
    <div class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6 w-full">
      <div v-if="messages != null">
        <b-row>
          <b-col v-for="msg in messages" :key="msg.id" :style="boxStyles(msg.id)" class="m-2 p-5" @click="toggle(msg.id)">
            <img :src="msg.attachments[0]" style="height: 10em;">
            <blockquote>{{ msg.content }}</blockquote>
            <dd>By: {{ msg.author }}</dd>
            <dd>At: {{ formatTime(msg.createdTimestamp) }}</dd>
            <b-form-checkbox v-model="checked[msg.id]" name="check-button" switch>
              Approved
            </b-form-checkbox>
          </b-col>
        </b-row>
        </b-row>
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
    boxStyles (id) {
      return {
        userSelect: 'none',
        width: '20em',
        border: `2px solid ${this.checked[id] ? 'green' : 'red'}`,
        backgroundColor: this.checked[id] ? '#ACD1AF' : '#F47174',
        borderRadius: '10%',
        height: '20em'
      }
    },
    toggle (id) {
      this.checked = { ...this.checked, [id]: !this.checked[id] }
    },
    formatTime (timestamp) {
      return new Date(timestamp).toLocaleString()
    }
  }
}
</script>

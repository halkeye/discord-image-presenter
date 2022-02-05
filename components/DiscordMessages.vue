<template>
  <div v-if="messages != null">
    <b-row cols="1" cols-sm="2" cols-md="4" cols-lg="6">
      <b-col v-for="msg in messages" :key="msg.id" :style="boxStyles(msg.id)" class="m-2 p-5" @click="toggle(msg.id)">
        <img :src="msg.attachment" style="height: 10em;">
        <blockquote>{{ msg.content }}</blockquote>
        <dd>By: {{ msg.author }}</dd>
        <dd>At: {{ formatTime(msg.createdTimestamp) }}</dd>
        <b-form-checkbox v-model="checked[msg.id]" name="check-button" switch>
          Approved
        </b-form-checkbox>
      </b-col>
    </b-row>
  </div>
  <b-spinner v-else label="Spinning" />
</template>

<script>
export default {
  name: 'DiscordMessages',

  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      checked: {}
    }
  },

  methods: {
    boxStyles (id) {
      return {
        userSelect: 'none',
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

<template>
  <div v-if="messages != null">
    <b-row cols="1" cols-sm="2" cols-md="4" cols-lg="6">
      <b-col v-for="msg in messages" :key="msg.id" :style="boxStyles(msg)" class="m-2 p-3" @click="toggle(msg)">
        <div :style="imgStyles(msg.attachment)" />
        <b-form-checkbox v-model="msg.authorized" name="check-button" switch>
          Approved
        </b-form-checkbox>
        <dd>By: {{ msg.author }}</dd>
        <dd>At: {{ formatTime(msg.createdTimestamp) }}</dd>
        <blockquote class="blockquote">
          {{ msg.content }}
        </blockquote>
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
    boxStyles (msg) {
      return {
        userSelect: 'none',
        border: `2px solid ${msg.authorized ? 'green' : 'red'}`,
        backgroundColor: msg.authorized ? '#ACD1AF' : '#F47174',
        borderRadius: '10%',
        height: '24em',
        width: '100%'
      }
    },

    imgStyles (url) {
      return {
        height: '14em',
        backgroundImage: `url(${url})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center'
      }
    },

    toggle (msg) {
      if (msg.authorized) {
        this.$store.dispatch('unauthorizeMessage', msg.id)
      } else {
        this.$store.dispatch('authorizeMessage', msg.id)
      }
    },

    formatTime (timestamp) {
      return new Date(timestamp).toLocaleString()
    }
  }
}
</script>

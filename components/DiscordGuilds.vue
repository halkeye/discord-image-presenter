<template>
  <div class="max-w-4xl mx-auto sm:px-6 lg:px-8 grow">
    <div class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6 w-full">
      <strong>Select a discord server</strong>:
      <ul>
        <li v-for="guild in guilds" :key="guild.id">
          <nuxt-link :to="'/guild/' + guild.id" class="flex">
            <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
              {{ guild.name }}
            </button>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'DiscordGuilds',
  computed: {
    ...mapState({ guilds: 'guilds' })
  },
  mounted () {
    this.$store.dispatch('getGuilds')
  }
}
</script>

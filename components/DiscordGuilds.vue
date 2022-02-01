<template>
  <div>
    <strong>Select a discord server</strong>:
    <div v-if="guilds != null">
      <b-row cols="1" cols-sm="2" cols-md="4" cols-lg="6">
        <b-col v-for="guild in guilds" :key="guild.id">
          <b-card
            :title="guild.name"
            :img-src="guild.icon"
            img-alt="Logo for guil"
            img-top
            style="width: 20rem"
            class="mb-2"
          >
            <b-button variant="primary" @click="selectGuild(guild.id)">
              Choose Server
            </b-button>
          </b-card>
        </b-col>
      </b-row>
      <div>
        <a class="btn btn-secondary" :href="inviteUrl">
          Add bot to your server
        </a>
      </div>
    </div>
    <template v-else>
      <b-spinner label="Spinning" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'DiscordGuilds',
  computed: {
    ...mapState({
      guilds: 'guilds',
      inviteUrl: 'inviteUrl'
    })
  },
  methods: {
    selectGuild (guildId) {
      this.$store.dispatch('selectGuild', guildId)
    }
  }
}
</script>

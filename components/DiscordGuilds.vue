<template>
  <div class="max-w-4xl mx-auto sm:px-6 lg:px-8 grow">
    <div class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6 w-full">
      <div v-if="emitErrors['selectGuild']">
        <b-alert v-for="err in emitErrors['selectGuild']" :key="err.message" variant="danger" show>
          {{ err.message }}
        </b-alert>
      </div>
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
          <a :href="inviteUrl">
            Add bot to your server
          </a>
        </div>
      </div>
      <template v-else>
        <b-spinner label="Spinning" />
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DiscordGuilds',
  computed: {
    ...mapState({
      emitErrors: 'emitErrors',
      guilds: 'guilds',
      inviteUrl: 'inviteUrl'
    })
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    async selectGuild (guildId) {
      this.socket = this.$nuxtSocket({ persist: 'defaultLabel' })
      await this.$store.dispatch(
        '$nuxtSocket/emit',
        {
          label: 'defaultLabel',
          evt: 'selectGuild',
          msg: guildId,
          emitTimeout: 5000
        }
      )
      alert('going to /guild/guildid')
    }
  }
}
</script>

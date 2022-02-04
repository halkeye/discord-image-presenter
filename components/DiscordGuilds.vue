<template>
  <div>
    <strong>Select a discord server</strong>:
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
          <nuxt-link :to="'/g/' + guild.id + '/'">
            <b-button variant="primary">
              Choose Server
            </b-button>
          </nuxt-link>
        </b-card>
      </b-col>
    </b-row>
    <div>
      <a class="btn btn-secondary" :href="inviteUrl">
        Add bot to your server
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiscordGuilds',
  props: {
    guilds: {
      type: Array,
      default: () => []
    },
    inviteUrl: {
      type: String,
      default: () => ''
    }
  }
}
</script>

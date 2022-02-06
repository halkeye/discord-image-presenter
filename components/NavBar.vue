<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand>
      <nuxt-link to="/">
        <img src="/android-chrome-512x512.png" width="30" height="30" class="d-inline-block align-top" alt="">
      </nuxt-link>
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-text v-if="isAuthenticated">
        <b-button @click="logout">
          Logout as {{ loggedInUser.username }}
        </b-button>
      </b-nav-text>
      <b-nav-text v-if="!isAuthenticated">
        <b-button @click="login">
          Log In
        </b-button>
      </b-nav-text>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  /* Move this to a ShowUsername and Logout component */
  methods: {
    async logout () {
      await this.$auth.logout()
    },
    async login () {
      await this.$auth.loginWith('discord', { scope: ['guilds'] })
    }
  }
}
</script>

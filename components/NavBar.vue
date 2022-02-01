<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand>
      <nuxt-link to="/">
        <NuxtLogo style="height: 25px" />
      </nuxt-link>
    </b-navbar-brand>
    <b-navbar-nav>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  /* Move this to a ShowUsername and Logout component */
  mounted () {
    if (this.$store.getters.isAuthenticated) {
      this.reportLogin()
    }
  },
  methods: {
    ...mapActions({
      reportLogin: 'login'
    }),
    async logout () {
      await this.$auth.logout()
    },
    async login () {
      await this.$auth.loginWith('discord', { scope: ['guilds'] })
    }
  }
}
</script>

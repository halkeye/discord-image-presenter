<template>
  <div class="px-4 py-5 my-5 text-center">
    <img class="d-block mx-auto mb-4" src="/android-chrome-512x512.png" alt="Logo" width="72" height="57">
    <h1 class="display-5 fw-bold">
      Image Lurker
    </h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <nuxt-link to="/g/" class="btn btn-primary btn-lg px-4 gap-3">
          Select A Server
        </nuxt-link>
        &nbsp;
        <button type="button" class="btn btn-outline-secondary btn-lg px-4">
          Secondary
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'IndexPage',
  auth: false,
  computed: {
    ...mapState({
      guilds: 'guilds',
      inviteUrl: 'inviteUrl'
    })
  }
}
</script>

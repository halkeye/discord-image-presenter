<template>
  <div v-if="emitErrors.length">
    <b-alert v-for="err in emitErrors" :key="err.id" variant="danger" show>
      {{ err.message }}
    </b-alert>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ErrorBanners',
  computed: {
    ...mapState({
      emitErrors: 'emitErrors'
    })
  }
}
</script>

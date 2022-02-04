<template>
  <div v-if="emitErrors">
    <div v-for="(value, name, index) in emitErrors" :key="index">
      <b-alert v-for="err in value" :key="err.message" variant="danger" show>
        {{ err.message }}
      </b-alert>
    </div>
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

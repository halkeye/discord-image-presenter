<template>
  <LayoutWrapper>
    <ErrorBanners :emit-errors="emitErrors" />
    <Nuxt />
  </LayoutWrapper>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LayoutEmpty',
  computed: {
    ...mapState({
      emitErrors: 'emitErrors'
    })
  }
}
</script>

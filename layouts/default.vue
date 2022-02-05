<template>
  <LayoutWrapper>
    <NavBar />
    <div class="d-flex justify-content-center align-items-center min-vh-100 min-vw-100">
      <div class="shadow-lg p-3 mb-5 bg-white rounded" style="width: 90%">
        <ErrorBanners :emit-errors="emitErrors" />
        <Nuxt />
      </div>
    </div>
  </LayoutWrapper>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LayoutDefault',
  computed: {
    ...mapState({
      emitErrors: 'emitErrors'
    })
  }
}
</script>

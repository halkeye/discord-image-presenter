<template>
  <VueSlickCarousel
    v-if="messages && messages.length"
    :arrows="true"
    :dots="false"
    :adaptive-height="true"
    :autoplay="true"
    :center-mode="true"
    :infinite="true"
  >
    <div v-for="message in messages" :key="message.id" :style="styleFor(message)" class="att-container vh-100" />
  </VueSlickCarousel>
</template>

<script>
import { mapGetters } from 'vuex'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'ChannelImagesPage',
  auth: true,
  components: {
    VueSlickCarousel
  },
  layout: 'empty',
  computed: {
    ...mapGetters({ messages: 'messages' })
  },
  methods: {
    styleFor (msg) {
      return {
        backgroundImage: `url(${msg.attachment})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center'
      }
    }
  }
}
</script>

<style>
body {
  overflow: hidden
}

.slick-slide:not(.slick-active) .att-container {
  display: none !important;
}
</style>

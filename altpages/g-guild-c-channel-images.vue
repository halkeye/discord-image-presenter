<template>
  <div v-if="frontImage" :class="'flip-card' + flippedClassName">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img :src="frontImage.attachment">
      </div>
      <div v-if="backImage" class="flip-card-back">
        <img :src="backImage.attachment">
      </div>
    </div>
  </div>
  <b-spinner v-else label="Loading" />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ChannelImagesPage',
  auth: true,
  layout: 'empty',
  data () {
    return {
      messages: [],
      messageIdx: 0,
      frontImage: null,
      backImage: null,
      flipped: false,
      counterInterval: null
    }
  },
  computed: {
    ...mapGetters({ authorizedMessages: 'authorizedMessages' }),
    flippedClassName () {
      return this.flipped ? ' flipped' : ' notflipped'
    }
  },
  watch: {
    authorizedMessages () {
      // if theres no (cached) messages, and some get authorized, copy them over
      if (!this.messages.length) {
        this.messages = this.authorizedMessages
      }
    }
  },
  created () {
    this.counterInterval = setInterval(this.showNextImage.bind(this), 3000)

    // make a copy
    this.messages = this.authorizedMessages
    // preset to first message
    this.frontImage = this.messages[0]
  },
  destroyed () {
    clearInterval(this.counterInterval)
    clearInterval(this.flippedInterval)
  },
  methods: {
    showNextImage () {
      // if next image is outside bounds, copy
      if (this.messageIdx + 1 >= this.messages.length) {
        this.messages = this.authorizedMessages
        this.messageIdx = 0
      } else {
        this.messageIdx += 1
      }

      const nextImageToShow = this.messages[this.messageIdx]

      if (this.flipped) {
        // back is currently shown
        this.frontImage = nextImageToShow
      } else {
        // front is currently shown
        this.backImage = nextImageToShow
      }
      this.flipped = !this.flipped
    }
  }
}
</script>

<style>
body {
  overflow: hidden
}
.flip-card {
  height: 100vh !important;
  background-color: white;
  border: 1px solid #f1f1f1;
  perspective: 1000px;
}

.flip-card img {
  height: 100%; /* remove if dont want to stretch */
  max-height: 100vh !important;
  max-width: 100vw !important;
}

.flip-card .flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card .flip-card-front, .flip-card .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card .flip-card-front {
}

.flip-card .flip-card-back {
  transform: rotateY(180deg);
}
</style>

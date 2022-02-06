import { sortRoutes } from '@nuxt/utils'

export default {
  server: {
    host: '0',
    port: 3000
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'discord-image-presenter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/multiTabState.client.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    '~/modules/io.mjs'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  auth: {
    redirect: {
      login: '/login/',
      logout: '/',
      callback: '/login/',
      home: '/'
    },
    strategies: {
      discord: {
        scope: ['email', 'identify', 'guilds'],
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET
      }
    }
  },

  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'g-guild-c-channel-images',
        path: '/g/:guild/c/:channel/images/',
        component: resolve('altpages/g-guild-c-channel-images.vue')
      })
      routes.push({
        name: 'select-messages',
        path: '/g/:guild/c/:channel/',
        component: resolve('altpages/select-messages.vue')
      })
      routes.push({
        name: 'g-guild',
        path: '/g/:guild/',
        component: resolve('altpages/g-guild.vue')
      })
      routes.push({
        name: 'select-a-guild',
        path: '/g',
        component: resolve('altpages/select-a-guild.vue')
      })
      sortRoutes(routes)
      console.log('routes', JSON.stringify(routes, null, 2))
    },
    trailingSlash: true,
    middleware: ['auth']
  }
}

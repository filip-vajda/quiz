// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: [
    '~/assets/css/main.css',
    '~/assets/css/animations.css',
  ],
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700, 800],
    },
    display: 'swap',
  },
  app: {
    head: {
      title: 'Refresher Pub Quiz',
      htmlAttrs: { lang: 'sk' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#111111' },
      ],
    },
  },
})

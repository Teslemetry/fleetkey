// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-qrcode'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  nitro: {
    preset: 'cloudflare_pages',
    storage: {
      kv: {
        driver: 'cloudflare-kv-binding',
        binding: 'KV'
      }
    },
    devStorage: {
      kv: {
        driver: 'fs',
        base: './.data/kv'
      }
    }
  },

  typescript: {
    strict: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})

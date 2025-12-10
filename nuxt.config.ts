// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],



  runtimeConfig: {
    // Server-only config (private)
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
    
    // Public config (exposed to client)
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api'
    }
  },

  typescript: {
    strict: true,
    typeCheck: false  // Disabled to avoid vue-tsc dependency issues
  }
})
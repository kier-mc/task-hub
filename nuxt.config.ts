// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "nuxt-vitest", "@nuxtjs/supabase", "@vueuse/nuxt"],
  pinia: {
    autoImports: ["defineStore", "useStore"],
  },
  imports: {
    dirs: ["stores"],
  },
  components: ["~/components/forms", "~/components/svg", "~/components"],
  css: ["@/assets/scss/reset.scss", "@/assets/scss/main.scss"],
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Inter&display=swap",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      openWeatherKey: process.env.OPENWEATHER_KEY,
    },
  },
});

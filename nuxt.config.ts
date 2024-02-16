// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    https: {
      key: "localhost-key.pem",
      cert: "localhost.pem",
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase", "@vueuse/nuxt", "@nuxt/test-utils/module"],
  pinia: {
    autoImports: ["defineStore", "useStore"],
  },
  imports: {
    dirs: ["stores"],
  },
  components: ["~/components/forms", "~/components/svg", "~/components"],
  css: ["@/assets/scss/index.scss"],
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
  supabase: {
    redirect: false,
  },
  // vite: {
  //   server: {
  //     hmr: {
  //       host: "localhost",
  //       protocol: "ws",
  //     },
  //   },
  // },
});

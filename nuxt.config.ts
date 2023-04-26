// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["@pinia/nuxt", "nuxt-vitest", "@nuxtjs/supabase"],
    pinia: {
      autoImports: ["defineStore", "useStore"]
    },
    imports: {
      dirs: ["stores"]
    },
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
      }
})

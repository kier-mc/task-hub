// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "nuxt-vitest", "@nuxtjs/supabase"],
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
  // vite: {
  //   server: {
  //     fs: {
  //       // Allow serving files from one level up to the project root
  //       // allow: [".."],
  //       strict: false,
  //     },
  //   },
  // },
  hooks: {
    ready(nuxt) {
      console.log("Workspace dir:", nuxt.options.workspaceDir);
      console.log("Modules dir:", nuxt.options.modulesDir);
    },
  },
});

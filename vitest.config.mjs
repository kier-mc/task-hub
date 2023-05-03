import { defineVitestConfig } from "nuxt-vitest/config";
export default defineVitestConfig({
  test: {
    coverage: {
      provider: "c8",
      reportsDirectory: "./__test__/coverage",
    },
    // dangerouslyIgnoreUnhandledErrors: true,
  },
});

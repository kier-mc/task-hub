import { defineVitestConfig } from "nuxt-vitest/config";
export default defineVitestConfig({
  test: {
    coverage: {
      provider: "v8",
      reportsDirectory: "./__test__/coverage",
    },
  },
});

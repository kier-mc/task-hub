import { defineVitestConfig } from "@nuxt/test-utils/config";
export default defineVitestConfig({
  test: {
    coverage: {
      provider: "v8",
      reportsDirectory: "./__test__/coverage",
    },
    environment: "nuxt",
  },
});

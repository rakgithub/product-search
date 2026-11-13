import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/index.ts"],
      reporter: ["text-summary", "lcov"],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 75 },
    },
  },
});

import { fileURLToPath } from "node:url";
import next_env from "@next/env";
import { configDefaults, defineConfig } from "vitest/config";

const { combinedEnv } = next_env.loadEnvConfig(process.cwd());

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": fileURLToPath(
        new URL("./node_modules/server-only/empty.js", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: [...configDefaults.exclude, "tests/**"],
    env: combinedEnv,
  },
});

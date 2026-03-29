import { defineConfig } from "vitest/config"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@libsql\/client$/, replacement: "@libsql/client/web" },
    ],
  },
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    viteReact(),
  ],
  test: {
    environment: "node",
  },
})

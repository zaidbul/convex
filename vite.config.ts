import { defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const config = defineConfig({
  resolve: {
    alias: [
      { find: /^@libsql\/client$/, replacement: "@libsql/client/web" },
    ],
  },
  optimizeDeps: {
    include: [
      "prismjs",
      "prismjs/components/prism-clike",
      "prismjs/components/prism-javascript",
      "prismjs/components/prism-typescript",
      "prismjs/components/prism-json",
      "prismjs/components/prism-markup",
    ],
  },
  plugins: [
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config

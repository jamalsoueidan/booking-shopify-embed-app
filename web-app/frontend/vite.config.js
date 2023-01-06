import react from "@vitejs/plugin-react";
import { dirname } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true }),
    splitVendorChunkPlugin(),
    visualizer(),
    tsconfigPaths(),
  ],
  build: {
    manifest: true,
    rollupOptions: {
      input: "./main.tsx",
    },
  },
});

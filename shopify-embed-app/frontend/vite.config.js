import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import react from "@vitejs/plugin-react";
import { dirname } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import { checker } from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

if (
  process.env.npm_lifecycle_event === "build" &&
  !process.env.CI &&
  !process.env.SHOPIFY_API_KEY
) {
  console.warn(
    "\nBuilding the frontend app without an API key. The frontend build will not run without an API key. Set the SHOPIFY_API_KEY environment variable when running the build command.\n",
  );
}

const proxyOptions = {
  changeOrigin: false,
  configure: (proxy) => {
    proxy.on("error", (err) => {
      console.log("proxy error", err);
    });
  },
  secure: true,
  target: `http://127.0.0.1:${process.env.BACKEND_PORT}`,
  ws: false,
};

const host = process.env.HOST
  ? process.env.HOST.replace(/https?:\/\//, "")
  : "localhost";

let hmrConfig;
if (host === "localhost") {
  hmrConfig = {
    clientPort: 64999,
    host: "localhost",
    port: 64999,
    protocol: "ws",
  };
} else {
  hmrConfig = {
    clientPort: 443,
    host: host,
    port: process.env.FRONTEND_PORT,
    protocol: "wss",
  };
}

let build = {};
if (process.env.npm_lifecycle_event === "build") {
  build = {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-router-dom", "react-dom", "react-query"],
          shopify: ["@shopify/app-bridge-react", "@shopify/polaris"],
        },
      },
      plugins: [dynamicImportVars({})],
    },
  };
}
export default defineConfig({
  build,
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
  },
  plugins: [
    react(),
    checker({ typescript: true }),
    splitVendorChunkPlugin(),
    visualizer(),
    tsconfigPaths(),
  ],
  resolve: {
    preserveSymlinks: true,
  },
  root: dirname(fileURLToPath(import.meta.url)),
  server: {
    hmr: hmrConfig,
    host: "localhost",
    port: process.env.FRONTEND_PORT,
    proxy: {
      "^/(\\?.*)?$": proxyOptions,
      "^/api(/|(\\?.*)?$)": proxyOptions,
    },
  },
});

import { defineConfig } from "vite";
import fullReload from "vite-plugin-full-reload";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";
import checker from 'vite-plugin-checker';
import million from "million/compiler";
import path from "path";

export default defineConfig({
  plugins: [
    checker({ typescript: false }),
    react(),
    fullReload(["**/*.ts*", "**/*.js*", "**/*.mjs"], {
      always: true,
      root: "src",
    }),
    splitVendorChunkPlugin(),
    nodePolyfills({
      protocolImports: true,
    }),
    million.vite({
      mode: "vdom",
    }),
  ],
  build: {
    target: "chrome87",
    outDir: "build",
    minify: "terser",
  },
  server: {
    hmr: false,
  },
  resolve: {
    alias: {
      "react-declarative": path.resolve(__dirname, "../dist/index.modern.js"),
      "react/jsx-runtime": path.resolve(__dirname, "./src/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./src/jsx-dev-runtime"),
    },
  },
  optimizeDeps: {
    exclude: [
      'react-declarative'
    ]
  }
});

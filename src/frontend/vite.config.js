import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import { portfolioSavePlugin } from "./scripts/portfolio-save.mjs";

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://uqzsh-gqaaa-aaaaq-qaada-cai.localhost:8081/authorize`
    : `https://id.ai/authorize`;

process.env.II_URL = process.env.II_URL || ii_url;

const courseProxy = {
  "/ai-future-of-work": {
    target: "https://terrybrutus-aiandthefuture-sample.netlify.app",
    changeOrigin: true,
    rewrite: (url) => url.replace(/^\/ai-future-of-work/, "") || "/",
  },
  "/blockchain": {
    target: "https://whyblockchainmatters-by-terrybrutus.netlify.app",
    changeOrigin: true,
    rewrite: (url) => url.replace(/^\/blockchain/, "") || "/",
  },
  "/phishing": {
    target: "https://phishingcourse-by-terrybrutus.netlify.app",
    changeOrigin: true,
    rewrite: (url) => url.replace(/^\/phishing/, "").replace(/^\/(?=\?|$)/, "/story.html") || "/story.html",
  },
};

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    cssMinify: true,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      ...courseProxy,
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  preview: {proxy: courseProxy},
  plugins: [
    {
      name: "static-project-pages",
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = new URL(request.url ?? "/", "http://localhost");
          if (url.pathname.startsWith("/stylebook/demo/") && !url.pathname.split("/").pop().includes(".")) {
            request.url = "/stylebook/demo/index.html";
          }
          if (["/common-thread/", "/worduel-notify/"].includes(url.pathname)) {
            request.url = `${url.pathname}index.html${url.search}`;
          }
          next();
        });
      },
    },
    portfolioSavePlugin(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@icp-sdk/core"]
  },
});

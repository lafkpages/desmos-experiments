import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess({})],

  kit: {
    adapter: adapter(),

    alias: {
      $assets: "./src/assets",
      $types: "./src/types",
    },

    csp: {
      directives: {
        "font-src": ["data:"],

        // unsafe-eval and blob: are required for Desmos
        "script-src": [
          "self",
          "https://va.vercel-scripts.com",
          "https://www.desmos.com",
          "unsafe-eval",
          "blob:",
        ],
      },
    },
  },
};

export default config;

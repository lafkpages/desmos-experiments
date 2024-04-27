import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess({})],

  kit: {
    adapter: adapter(),

    alias: {
      $assets: "./src/assets",
      $components: "./src/components",
      $types: "./src/types",
    },

    csp: {
      directives: {
        "font-src": ["self", "data:"],

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

import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess({})],

  kit: {
    adapter: adapter(),

    alias: {
      $static: "./static",
      $types: "./src/types",
    },

    csp: {
      directives: {
        "font-src": ["data:"],
        "script-src": ["https://www.desmos.com", "unsafe-eval", "blob:"],
      },
    },
  },
};

export default config;

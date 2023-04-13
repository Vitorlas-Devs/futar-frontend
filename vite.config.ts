/// <reference types="vitest" />

import { defineConfig } from "vite";
import { resolve } from "path";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import dns from "dns";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: "src/assets/quasar-variables.sass" }),
    VueI18nPlugin({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths!
      include: resolve(__dirname, "src/locales/**"),
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
      "~": resolve(__dirname, "src"),
    },
  },
  define: {
    "process.env": {},
  },

  // https://github.com/vitest-dev/vitest
  test: {
    include: ["test/**/*.test.ts", "src/**/*.test.ts"],
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "istanbul", // or 'c8'
    },
    deps: {
      inline: ["@vue", "@vueuse", "vue-demi"],
    },
  },

  build: {
    // reportCompressedSize: true,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/")) {
            // Set the NPM package
            const modules = ["quasar", "@quasar", "vue", "@vue"];
            const chunk = modules.find((module) => id.includes(`/node_modules/${module}`));
            return chunk ? `vendor-${chunk}` : "vendor";
          }
        },
      },
    },
  },
});

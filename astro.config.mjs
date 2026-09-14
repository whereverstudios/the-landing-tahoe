import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

// Deployed to GitHub Pages at https://whereverstudios.github.io/the-landing-tahoe/
// Point a custom domain at the repo later and change `site` + drop `base`.
export default defineConfig({
  site: "https://whereverstudios.github.io",
  base: "/the-landing-tahoe",
  output: "static",
  trailingSlash: "always",
  // i18n configuration must match src/config/siteSettings.json.ts
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
      wrap: true,
    },
  },
  integrations: [
    mdx(),
    react(),
    icon(),
    sitemap(),
    compress({
      HTML: true,
      JavaScript: true,
      CSS: false,
      Image: false,
      SVG: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0,
    },
  },
});

// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import icon from "astro-icon";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

/*
  Routes kept out of the sitemap: the postcard form's utility pages (nothing to
  index — a form, a receipt and an error), the two RSS feeds (they are not
  pages), and the one media log that is still a placeholder. Utility and
  placeholder pages carry `noindex` in Layout.astro instead of being blocked in
  robots.txt, so crawlers can actually see the tag.
*/
const NOT_INDEXED = [
    "/postcards/error",
    "/postcards/success",
    "/postcards/new",
    "/blog-rss.xml",
    "/bookmarks-rss.xml",
    "/music",
];

// https://astro.build/config
export default defineConfig({
    site: "https://iamrob.in",
    /*
    Astro caches optimized images here (default: node_modules/.astro). Nixpacks
    mounts node_modules/.cache as the Docker build cache, so pointing the two
    at the same place is what makes the cache survive between deploys —
    otherwise every build re-encodes all ~97 images from cold.
  */
    cacheDir: "./node_modules/.cache/astro",
    integrations: [
        db(),
        icon(),
        sitemap({
            filter: (page) => {
                // Compare on the path alone, and without the trailing slash Astro
                // appends — otherwise every entry above would need two spellings.
                const path = new URL(page).pathname.replace(/\/$/, "");
                const isPostcardArchive =
                    /^\/postcards\/\d+$/.test(path) ||
                    /^\/postcards\/country\//.test(path);

                return !NOT_INDEXED.includes(path) && !isPostcardArchive;
            },
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
    // Node adapter (standalone) — deployed on Hetzner via Coolify, same as v3.
    // Pages stay static by default; only routes with `export const prerender =
    // false` (e.g. the postcard send form) render on demand.
    adapter: node({ mode: "standalone" }),
    security: {
        checkOrigin: false,
    },
});

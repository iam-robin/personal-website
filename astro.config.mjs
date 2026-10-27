// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import icon from "astro-icon";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

/* Not in the sitemap: postcard utility pages, the RSS feeds, placeholder logs. */
const NOT_INDEXED = [
    "/postcards/error",
    "/postcards/success",
    "/postcards/new",
    "/blog-rss.xml",
    "/bookmarks-rss.xml",
    "/music",
];

export default defineConfig({
    site: "https://iamrob.in",
    /* Nixpacks caches node_modules/.cache between deploys, so optimized images survive. */
    cacheDir: "./node_modules/.cache/astro",
    integrations: [
        db(),
        icon(),
        sitemap({
            filter: (page) => {
                // Compare paths without the trailing slash Astro appends.
                const path = new URL(page).pathname.replace(/\/$/, "");
                const isPostcardArchive =
                    /^\/postcards\/\d+$/.test(path) ||
                    /^\/postcards\/country\//.test(path);

                const isLab = path === "/lab" || path.startsWith("/lab/");
                return !NOT_INDEXED.includes(path) && !isPostcardArchive && !isLab;
            },
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
    adapter: node({ mode: "standalone" }),
    security: {
        checkOrigin: false,
    },
});

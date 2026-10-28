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

/* The lab lives in src/pages/_lab, which Astro doesn't route by itself.
   Its routes are injected for `astro dev` only, so production builds never
   contain them. */
const LAB_ROUTES = [
    ["/lab", "index.astro"],
    ["/lab/tokens", "tokens.astro"],
    ["/lab/components", "components/index.astro"],
    ["/lab/components/preview/[component]", "components/preview/[component].astro"],
];

/** @returns {import("astro").AstroIntegration} */
const devOnlyLab = () => ({
    name: "dev-only-lab",
    hooks: {
        "astro:config:setup": ({ command, injectRoute }) => {
            if (command !== "dev") return;
            for (const [pattern, file] of LAB_ROUTES) {
                injectRoute({ pattern, entrypoint: `./src/pages/_lab/${file}` });
            }
        },
    },
});

export default defineConfig({
    site: "https://iamrob.in",
    /* Nixpacks caches node_modules/.cache between deploys, so optimized images survive. */
    cacheDir: "./node_modules/.cache/astro",
    integrations: [
        db(),
        icon(),
        devOnlyLab(),
        sitemap({
            filter: (page) => {
                // Compare paths without the trailing slash Astro appends.
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
    adapter: node({ mode: "standalone" }),
    security: {
        checkOrigin: false,
    },
});

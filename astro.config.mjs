// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import db from "@astrojs/db";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://iamrob.in",
    integrations: [
        icon(),
        db(),
        sitemap({
            filter: (page) =>
                !page.includes('/postcards/error') &&
                !page.includes('/postcards/success') &&
                !page.includes('/postcards/new') &&
                !page.endsWith('/blog-rss.xml') &&
                !page.endsWith('/bookmarks-rss.xml'),
        }),
    ],

    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
                "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
                "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
                "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
                "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
                "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
            },
        },
    },

    adapter: vercel(),
});

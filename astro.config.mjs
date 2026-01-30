// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import db from "@astrojs/db";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
    site: "https://iamrob.in",
    integrations: [icon(), db()],

    vite: {
        plugins: [tailwindcss()],
    },

    adapter: vercel(),
});

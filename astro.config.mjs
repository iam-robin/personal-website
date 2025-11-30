// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import db from "@astrojs/db";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    integrations: [svelte(), icon(), db()],

    vite: {
        plugins: [tailwindcss()],
    },
});

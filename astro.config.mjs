// @ts-check
import { readdirSync, watch } from "node:fs";
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
    ["/lab/analog", "analog.astro"],
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

/* `astro dev` exports the blog from the vault on start and again whenever a
   note in its blog/ folder changes, so drafts show up locally while writing.
   Builds never touch the vault (the build server has none); they use the
   committed data/blog/. */
/** @returns {import("astro").AstroIntegration} */
const devBlogFromVault = () => ({
    name: "dev-blog-from-vault",
    hooks: {
        "astro:config:setup": async ({ command, logger }) => {
            if (command !== "dev") return;
            // Imported here so builds don't need the export's dev dependencies
            const { VAULT_PATH } = await import("./scripts/export/lib/utils.mjs");
            const { exportBlog } = await import("./scripts/export/export-blog.mjs");
            const vaultBlog = `${VAULT_PATH}/blog`;
            try {
                // Also fails without permission, e.g. in a sandboxed shell
                readdirSync(vaultBlog);
            } catch (err) {
                const code = /** @type {NodeJS.ErrnoException} */ (err).code;
                logger.warn(`Can't read ${vaultBlog} (${code}), showing the committed blog posts only.`);
                return;
            }
            const run = () => exportBlog().catch((err) => logger.error(err.message));
            await run();

            // A config change restarts the server and runs this again
            const store = /** @type {{ vaultBlogWatcher?: import("node:fs").FSWatcher }} */ (globalThis);
            store.vaultBlogWatcher?.close();
            /** @type {NodeJS.Timeout | undefined} */
            let timer;
            store.vaultBlogWatcher = watch(vaultBlog, () => {
                clearTimeout(timer);
                timer = setTimeout(run, 300);
            });
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
        devBlogFromVault(),
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

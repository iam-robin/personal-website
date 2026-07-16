// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import db from '@astrojs/db';
import icon from 'astro-icon';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://iamrob.in',
  integrations: [db(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  // Node adapter (standalone) — deployed on Hetzner via Coolify, same as v3.
  // Pages stay static by default; only routes with `export const prerender =
  // false` (e.g. the postcard send form) render on demand.
  adapter: node({ mode: 'standalone' }),
  security: {
    checkOrigin: false,
  },
});

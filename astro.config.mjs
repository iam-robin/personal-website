import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import react from '@astrojs/react';
import remarkGfm from 'remark-gfm';
import vercel from '@astrojs/vercel';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
    site: 'https://iamrob.in',
    output: 'static',
    adapter: vercel({
        runtime: 'nodejs20.x'
    }),
    integrations: [tailwind(), icon(), react(), db()],
    markdown: {
        remarkPlugins: [remarkGfm]
    }
});

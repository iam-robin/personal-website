import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import react from '@astrojs/react';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
export default defineConfig({
    site: 'https://iamrob.in',
    integrations: [tailwind(), icon(), react()],
    markdown: {
        remarkPlugins: [remarkGfm]
    }
});
